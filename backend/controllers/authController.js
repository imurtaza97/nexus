require('dotenv').config();
const Organization = require('../models/Organization');
const Staff = require('../models/Staff');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const PlanPayment = require('../models/PlanPayment');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/sendEmail');

const authController = {

    //Registrastion Functions
    async registerUser(req, res) {
        const { name, organizationName, email, phone, password, designation, termsAccepted } = req.body;

        // Required fields Validator
        if (!name || !organizationName || !password || !email || !phone || !designation || !termsAccepted) {
            return res.status(400).json({ error: 'All fields are required, and you must accept the terms.' });
        }

        // Email Validator
        const normalizedEmail = email.toLowerCase();

        if (!validator.isEmail((normalizedEmail))) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        // Password Regex
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be at least 6 characters and include a letter, number, and special character.' });
        }

        // Find Organization
        let organization = await Organization.findOne({ email: normalizedEmail });
        if (organization) {
            return res.status(400).json({ error: 'You are already registered.' });
        }

        // Find Staff
        let staff = await Staff.findOne({ email: normalizedEmail });
        if (staff) {
            return res.status(400).json({ error: 'You are already associated with an organization and cannot create another one.' });
        }

        try {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate verification token and expiry date
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationTokenExpires = Date.now() + 86400000; // 1 day(24h)

            // Create Organization
            organization = new Organization({
                name: organizationName,
                email: email,
                phone: phone,
                termsAccepted: termsAccepted
            });
            await organization.save();

            // Create Staff
            staff = new Staff({
                organization: organization._id,
                name: name,
                email: normalizedEmail,
                phone: phone,
                designation: designation,
                password: hashedPassword,
                verificationToken,
                verificationTokenExpires
            });
            await staff.save();

            // Generate JWT token with staff._id
            const token = jwt.sign(
                { userId: staff._id, email: staff.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Generate verification URL
            const verificationURL = `http://yourdomain.com/verify-email/${verificationToken}`;

            // Send verification email
            const emailContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 0px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                        .header { background-color: #286fb4; color: #ffffff; padding: 20px; text-align: center; }
                        .header h1 { margin: 0; }
                        .content { padding: 20px; }
                        .content p { font-size: 16px; line-height: 1.5; }
                        .footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Nexus</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${name},</p>
                            <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking the button below:</p>
                            <a href="${verificationURL}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #286fb4; text-decoration: none; border-radius: 5px; text-align: center;">Verify Your Email</a>
                            <p>Please note that this link will expire in 1 day. If you did not request this verification, please ignore this email.</p>
                            <p>Best regards,<br>Nexus</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Nexus. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const emailResult = await sendEmail({
                to: normalizedEmail,
                subject: 'Verify Your Email Address',
                html: emailContent
            });

            if (!emailResult.success) {
                return res.status(500).json({ error: emailResult.error });
            }

            res.status(200).json({ message: 'Register successful, verification email sent.', token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //Login Functions
    async loginUser(req, res) {
        const { email, password } = req.body;

        //Email and Password Validatore
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        try {
            // Find the user by email
            const user = await Staff.findOne({ email });

            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password.' });
            }

            // Compare the password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password.' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({ message: 'Login successful!', token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //Get User's Details Functions
    async getUserDetails(req, res) {
        try {
            if (!req.userDetails) {
              return res.status(401).json({ error: 'User information is missing.' });
            }
        
            const { isPaid, isSubscriptionActive, user } = req.userDetails;
        
            res.status(200).json({
              message: 'Token is valid',
              isPaid,
              isSubscriptionActive,
              user,
            });
          } catch (error) {
            console.log('Error in getUserDetails:', error);
            res.status(401).json({ error: 'Token is invalid or has expired.' });
          }
    },

    //Dashboard Functions
    async dashboard(req, res) {
        // Example route for dashboard
        res.status(200).json({ message: 'Welcome to the dashboard' });
    }
};

module.exports = authController;
