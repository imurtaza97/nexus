const Organization = require('../models/Organization');
const SystemPreferences = require('../models/SystemPreference');
const Staff = require('../models/Staff');

const setupController = {
    async setupAccount(req, res) {
        const {
            address,
            country,
            state,
            pin,
            isGst,
            gstin,
            timeZone,
            dateFormat,
            currency,
            theme,
        } = req.body;

        // Check if user info is available in the request
        if (!req.user) {
            return res.status(401).json({ error: 'User information is incomplete.' });
        }

        // Find the user by User ID from the token
        const userId = req.user.userId;
        const user = await Staff.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the organizationId by user
        const organizationId = user.organization;
        if (!organizationId) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        try {
            let organization = await Organization.findByIdAndUpdate(
                organizationId,
                {
                    address: address + ',' + pin,
                    country: country,
                    region: state,
                    isGSTRegistered: isGst,
                    gstin: gstin
                },
                { new: true, runValidators: true } // Options to return the updated document and run schema validations
            ).exec();

            //Add System Preferences.
            let systemPreferences = await SystemPreferences.findOne({ staff: userId });
            if (!systemPreferences) {
                let systemPreferences = new SystemPreferences({
                    organization: organization._id,
                    staff: userId,
                    language: "en",
                    date_format: dateFormat,
                    time_zone: timeZone,
                    currency: currency,
                    theme: theme
                });
                await systemPreferences.save();

            } else {
                // Update existing system preferences
                await SystemPreferences.updateOne(
                    { staff: userId },
                    {
                        language: "en",
                        date_format: dateFormat,
                        time_zone: timeZone,
                        currency: currency,
                        theme: theme,
                        isSetupComplete: true
                    }
                ).exec();
            }

            res.status(200).json({ message: 'Congratulations! Your account setup is complete.'});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = setupController;
