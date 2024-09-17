// Import the mongoose module
const mongoose = require("mongoose");

// Define a schema
const OrganizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: String,
    region: String,
    country: String,
    logo: String,
    type: String,
    subType: String,
    isGSTRegistered: { type: Boolean, default: false },
    gstin: String,
    isEmailVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    termsAccepted: {
        type: Boolean,
        required: true
      }
}, { timestamps: true });

// Compile model from schema
module.exports = mongoose.model('Organization', OrganizationSchema);