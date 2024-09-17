const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organization', // This should match the model name 'Organization'
        required: true
    },
    name: { type: String, required: true },
    gender: String,
    photo: String,
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: String,
    designation: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    accessTo: { type: Boolean, default: false },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    googleid: { type: String },
    themeFormat: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Staff', StaffSchema);
