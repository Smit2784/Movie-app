const Suggestion = require('../models/Suggestion');
const User = require('../models/User');

// VENDOR: Create a suggestion
exports.createSuggestion = async (req, res) => {
    try {
        const { subject, message, category } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user || user.role !== 'vendor') {
            return res.status(403).json({ success: false, message: 'Only vendors can submit suggestions' });
        }

        const suggestion = new Suggestion({
            vendorId: user._id,
            vendorName: user.name,
            subject,
            message,
            category: category || 'other',
        });

        await suggestion.save();
        res.status(201).json({ success: true, message: 'Suggestion submitted successfully', suggestion });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to submit suggestion', error: error.message });
    }
};

// VENDOR: Get own suggestions
exports.getVendorSuggestions = async (req, res) => {
    try {
        const suggestions = await Suggestion.find({ vendorId: req.user.userId })
            .sort({ createdAt: -1 });
        res.json({ success: true, suggestions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch suggestions' });
    }
};

// VENDOR: Delete own suggestion (only if still pending)
exports.deleteVendorSuggestion = async (req, res) => {
    try {
        const suggestion = await Suggestion.findOne({ 
            _id: req.params.id, 
            vendorId: req.user.userId 
        });

        if (!suggestion) {
            return res.status(404).json({ success: false, message: 'Suggestion not found' });
        }

        if (suggestion.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Can only delete pending suggestions' });
        }

        await Suggestion.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Suggestion deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete suggestion' });
    }
};

// ADMIN: Get all suggestions
exports.getAllSuggestions = async (req, res) => {
    try {
        const suggestions = await Suggestion.find()
            .sort({ createdAt: -1 });
        res.json({ success: true, suggestions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch suggestions' });
    }
};

// ADMIN: Reply to a suggestion
exports.replySuggestion = async (req, res) => {
    try {
        const { adminReply, status } = req.body;

        const suggestion = await Suggestion.findByIdAndUpdate(
            req.params.id,
            { 
                adminReply, 
                status: status || 'reviewed',
                repliedAt: new Date()
            },
            { new: true }
        );

        if (!suggestion) {
            return res.status(404).json({ success: false, message: 'Suggestion not found' });
        }

        res.json({ success: true, message: 'Reply sent successfully', suggestion });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to reply to suggestion' });
    }
};

// ADMIN: Delete any suggestion
exports.deleteSuggestion = async (req, res) => {
    try {
        const result = await Suggestion.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Suggestion not found' });
        }
        res.json({ success: true, message: 'Suggestion deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete suggestion' });
    }
};
