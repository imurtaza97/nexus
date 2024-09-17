const jwt = require('jsonwebtoken');
const User = require('../models/Staff'); // Adjust the path as needed
const Organizations = require('../models/Organization'); // Adjust the path as needed
const Subscription = require('../models/PlanPayment'); // Adjust the path as needed

const authMiddleware = async (req, res, next) => {
  const token = req.query.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Fetch user details from the database
    const user = await User.findById(decoded.userId).exec();
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const organization = await Organizations.findById(user.organization).exec();
    if (!organization) {
      return res.status(401).json({ error: 'Organization not found.' });
    }
    if (organization.isBlocked) {
      return res.status(401).json({ error: 'Organization is blocked.' });
    }

    // Find the latest subscription for the organization
    const subscription = await Subscription.findOne({ organization: organization._id })
      .sort({ endDate: -1 }) // Sort by endDate in descending order to get the latest
      .exec();

    // Check if the subscription is paid and active
    const currentDate = new Date();
    const isPaid = !!subscription;
    const isSubscriptionActive = subscription && subscription.endDate >= currentDate;

    req.userDetails = {
      isPaid,
      isSubscriptionActive,
      user: {
        email: user.email,
        userName: user.name,
        profile: user.photo,
        address: user.address,
        organization: {
          name: organization.name,
          phoneNumber: organization.phoneNumber,
        },
      },
    };

    next();
  } catch (error) {
    console.log('Error in authMiddleware:', error);
    res.status(401).json({ error: 'Token is invalid or has expired.' });
  }
};

module.exports = authMiddleware;