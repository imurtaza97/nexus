// server/controllers/paymentController.js
const SystemPreference = require('../models/SystemPreference');
const Organization = require('../models/Organization');
const PlanPayment = require('../models/PlanPayment');
const { formatDate } = require('../utils/dateUtils');
const sendEmail = require('../utils/sendEmail');
const currenciesData = require('currencies.json');
const Staff = require('../models/Staff');
const Plans = require('../models/Plan');
const puppeteer = require('puppeteer');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const ALGORITHM = 'aes-256-cbc'; // AES encryption with CBC mode
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes key

const getCurrencySymbol = (currencyCode) => {
  const currencies = currenciesData.currencies; // Access the array

  // Ensure currencies is an array
  if (!Array.isArray(currencies)) {
    throw new Error('Expected currencies to be an array');
  }

  if (currencyCode === 'INR') {
    return '₹';
  }

  // Find the currency with the matching code
  const currency = currencies.find(c => c.code === currencyCode);
  return currency ? currency.symbol : null;
};

//Get Razorpay Id and Key From ENV
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

//Create Order
const createOrder = async (req, res) => {
  const { amount, planId } = req.body;

  if (!amount || !planId) {
    return res.status(400).json({ error: 'Please provide both amount and plan ID.' });
  }

  try {
    const userId = req.user.userId;
    const user = await Staff.findById(userId).exec();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const organizationId = user.organization;
    if (!organizationId) return res.status(404).json({ error: 'Organization not found' });

    let plan = await Plans.findById(planId);
    if (!plan) return res.status(404).json({ error: 'No Plan found' });

    const activePlans = await PlanPayment.find({
      organization: organizationId,
      subscriptionStatus: 'active'
    }).exec();

    let newStartDate = new Date();
    if (activePlans.length > 0) {
      const latestActivePayment = activePlans.reduce((latest, payment) => payment.endDate > latest.endDate ? payment : latest, activePlans[0]);
      newStartDate = latestActivePayment.endDate;
    }

    const durationInMillis = plan.duration * 24 * 60 * 60 * 1000;
    const newEndDate = new Date(newStartDate.getTime() + durationInMillis);

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex')
    });

    let paymentHistory = new PlanPayment({
      organization: organizationId,
      selectedPlan: plan._id,
      amount: plan.price,
      date: new Date(),
      startDate: newStartDate,
      endDate: newEndDate,
      subscriptionStatus: "inactive",
      paymentStatus: "Under Process",
      orderId: order.id
    });

    await paymentHistory.save();

    const paymentToken = encrypt(paymentHistory._id.toString());

    res.json({
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      paymentToken: paymentToken // Send token to client
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
};

//Verify Order
const verifyPayment = async (req, res) => {
  const { paymentId, orderId, signature, paymentToken } = req.body;

  try {
    // Decrypt the paymentToken to get the payment history ID
    const decryptedPaymentId = decrypt(paymentToken);

    // Generate the signature for verification
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      // Find the payment record by the decrypted payment history ID
      const paymentRecord = await PlanPayment.findById(decryptedPaymentId).exec();
      const organization = await Organization.findById(paymentRecord.organization).exec();
      const plan = await Plans.findById(paymentRecord.selectedPlan).exec();
      const preferences = await SystemPreference.findOne(organization._Id).exec()

      if (!paymentRecord || !organization || !plan || !preferences) {
        return res.status(404).json({ error: 'Record not found.' });
      }

      // Get user preferences (assuming you have a function to get user preferences)
      const dateFormat = preferences.date_format || 'DD/MM/YYYY'; // Replace 'DD/MM/YYYY' with your default format


      // Format the startDate and endDate
      const formattedDate = formatDate(paymentRecord.date, dateFormat);
      const formattedStartDate = formatDate(paymentRecord.startDate, dateFormat);
      const formattedEndDate = formatDate(paymentRecord.endDate, dateFormat);

      // Update payment status to success
      await PlanPayment.updateOne(
        { _id: decryptedPaymentId },
        {
          paymentStatus: 'success',
          subscriptionStatus: 'active',
          paymentId: paymentId,
          orderId: orderId
        }
      ).exec();

      // Send invoice email
      const emailContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <style>
                body {
                  font-family: Arial, sans-serif;
                  color: #333;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  overflow: hidden;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                  background-color: #ffffff;
                  color: #000000;
                  text-align: center;
                }
                .header h1 {
                  font-size: 24px;
                  margin: 0;
                }
                .content {
                  padding: 20px;
                  text-align: center;
                }
                .content p {
                  font-size: 14px;
                }
                .footer {
                  background-color: #286fb4;
                  color: #ffffff;
                  padding: 10px;
                  text-align: center;
                  font-size: 14px;
                }
                .invoice-details {
                  padding: 20px;
                  width: 100%;
                  font-size: 14px;
                  text-align: center;
                  border-collapse: collapse;
                }
                .invoice-details th,
                .invoice-details td {
                  padding: 5px;
                  text-align: left;
                }
                .invoice-details tr.total-row td {
                  border-top: 1px solid #616161; /* Add thicker line for the Total row */
                  font-weight: bold;
                  font-size:18px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img
                    src="https://i.postimg.cc/MTdVhFmJ/dark-logo.png"
                    style="max-width: 100px"
                    alt="Nexus Logo"
                  />
                </div>
                <div class="content">
                  <p>Hello <strong>${organization.name}</strong>,</p>
                  <p>
                    Thank you for your payment. Here are the details of your transaction:
                  </p>
                  <h1>Your Invoice</h1>
                  <table class="invoice-details">
                    <tr>
                      <td>Transaction ID</td>
                      <td style="text-align: end">${paymentId}</td>
                    </tr>
                    <tr>
                      <td>Date of Payment</td>
                      <td style="text-align: end">${formattedDate}</td>
                    </tr>
                    <tr>
                      <td>Start Date</td>
                      <td style="text-align: end">${formattedStartDate}</td>
                    </tr>
                    <tr>
                      <td>End Date</td>
                      <td style="text-align: end">${formattedEndDate}</td>
                    </tr>
                    <tr>
                      <td>Selected Plan</td>
                      <td style="text-align: end">${plan.name}</td>
                    </tr>
                    <tr>
                      <td>Amount</td>
                      <td style="text-align: end">${paymentRecord.amount}</td>
                    </tr>
                    <tr class="total-row">
                      <td>Total</td>
                      <td style="text-align: end">${paymentRecord.amount}</td>
                    </tr>
                  </table>
                  <p>You can download your invoice from the link below:</p>
                  <a
                    href="http://localhost:3000/api/download-invoice/${paymentId}"
                    style="
                      display: inline-block;
                      padding: 10px 20px;
                      margin: 20px 0;
                      font-size: 16px;
                      color: #ffffff;
                      background-color: #286fb4;
                      text-decoration: none;
                      border-radius: 5px;
                      text-align: center;
                    "
                    >Download Invoice</a
                  >
                  <p>If you have any questions, please contact our support team.</p>
                  <p>Best regards,<br />Nexus</p>
                </div>
                <div class="footer">
                  <p>&copy; 2024 Nexus. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;

      const emailResult = await sendEmail({
        to: organization.email,
        subject: 'Your Payment Invoice',
        html: emailContent
      });

      if (!emailResult.success) {
        return res.status(500).json({ error: emailResult.error });
      }

      res.json({ message: 'Payment verified and invoice sent successfully.' });
    } else {
      // Update payment status to failed
      await PlanPayment.updateOne(
        { _id: decryptedPaymentId },
        {
          paymentStatus: 'failed',
          subscriptionStatus: 'inactive',
          paymentId: paymentId,
          orderId: orderId
        }
      ).exec();

      res.status(400).json({ error: 'The signature is invalid.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed.' });
  }
};

//Download Invoice
const GenerateDownloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the planPayment document from the database
    const planPayment = await PlanPayment.findOne({paymentId:id})
      .populate('organization')
      .populate('selectedPlan');

    if (!planPayment) {
      return res.status(404).send('PlanPayment not found');
    }
    const preferences = await SystemPreference.findOne({ organization: planPayment.organization }).exec()

    let order = planPayment.orderId;
    const parts = order.split('_'); // Split the string at the underscore
    const orderId = parts[1];

    const dateFormat = preferences.date_format || 'DD/MM/YYYY'; // Replace 'DD/MM/YYYY' with your default format

    // Format the startDate and endDate
    const formattedDate = formatDate(planPayment.date, dateFormat);
    const formattedStartDate = formatDate(planPayment.startDate, dateFormat);
    const formattedEndDate = formatDate(planPayment.endDate, dateFormat);

    const currencyCode = preferences.currency || 'INR'; // This could be fetched from preferences
    const currencySymbol = getCurrencySymbol(currencyCode);

    console.log(currencySymbol);
    // Organization details
    const organization = planPayment.organization;
    const organizationName = organization ? organization.name : 'N/A';
    const organizationAddress = organization ? organization.address : 'N/A';
    const organizationPhone = organization ? organization.phone : 'N/A';

    const templatePath = path.join(__dirname, '../template/invoice_template.html');
    const imagePath = path.join(__dirname, '../assets/dark_logo.png');

    // Convert image to Base64 directly within this function
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
    const imageBase64Data = `data:image/png;base64,${imageBase64}`;

    // Read the HTML template and replace placeholder
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');
    htmlContent = htmlContent.replace('{{imageBase64}}', imageBase64Data);
    htmlContent = htmlContent.replace('{{orderNumber}}', orderId);
    htmlContent = htmlContent.replace('{{date}}', formattedDate);
    htmlContent = htmlContent.replace('{{details}}', `
      <tr style="border-bottom: 1px solid #b9b9b9">
        <td style="padding: 10px; text-align: left">${planPayment.selectedPlan.name}</td>
        <td style="padding: 10px; text-align: left">${formattedEndDate}</td>
        <td style="padding: 10px; text-align: left">${formattedStartDate} - ${formattedEndDate}</td>
        <td style="padding: 10px; text-align: right">${currencySymbol}${planPayment.amount}</td>
      </tr>
    `);

    htmlContent = htmlContent.replace('{{currency}}', currencySymbol);
    htmlContent = htmlContent.replace('{{totalAmount}}', planPayment.amount);
    htmlContent = htmlContent.replace('{{organizationName}}', organizationName);
    htmlContent = htmlContent.replace('{{organizationAddress}}', organizationAddress + "," + organization.region + "," + organization.country);
    htmlContent = htmlContent.replace('{{organizationPhone}}', organizationPhone);


    // Launch Puppeteer and generate the PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // Check if the buffer is valid
    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).send('Error generating PDF');
    }

    // Set headers to trigger download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');

    // Send the PDF buffer
    res.end(pdfBuffer); // Use res.end for binary data
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
}

//Encrypt Order
const encrypt = (text) => {
  let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.alloc(16, 0));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
};

//Decrypt Order
const decrypt = (text) => {
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.alloc(16, 0));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = { createOrder, verifyPayment, GenerateDownloadInvoice };