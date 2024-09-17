const mongoose = require('mongoose');
const Organization = require("./Organization");
const Staff = require("./Staff");

const SystemPreferencesSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    staff:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    language: {
        type: String,
        default: 'en'
    },
    date_format: {
        type: String,
        default: 'YYYY-MM-DD'
    },
    time_zone: {
        type: String,
        default: 'UTC'
    },
    currency: {
        type: String,
        default: 'USD'
    },
    theme: {
        type: String,
        default: 'light'
    },
    isSetupComplete: {
        type:Boolean,
        default: false
    }
});

module.exports = mongoose.model('SystemPreferences', SystemPreferencesSchema);