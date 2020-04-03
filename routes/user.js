const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/set_user_offline', async (req, res, next) => {
    try {
        await User.updateOne({_id: req.user._id}, {$set: {is_online: false, last_seen_at: new Date()}}).exec()
        return res.json({success: 1});
    } catch (error) {
        return next(error);
    }
});

module.exports = router;