const router = require('express').Router();
const mongoose = require('mongoose');
const Document = mongoose.model('Document');

router.post('/new', async (req, res, next) => {
    try {
        if (!req.body.content) {
            throw { status: 400, message: 'Missing Field Content!' };
        }
        const documentObj = {
            content: req.body.content,
            users: [req.user._id]
        };
        const documentInstance = new Document(documentObj);
        const savedDoc = await documentInstance.save();
        return res.json(savedDoc);
    } catch (error) {
        return next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const query = { users: req.user._id };
        const docs = await Document.find(query)
        .populate({path: 'users', select: 'name email is_online last_seen_at'})
        .sort({createdAt: -1})
        .lean()
        .exec();
        return res.json(docs);
    } catch (error) {
        return next(error);
    }
});

/**
 * Right now not taking care of user roles, if user have role to read only, edit or owner access
 * keeping it too simple. later on we can add the access control levels
 */
router.post('/update', async (req, res, next) => {
    try {
        if (!req.body.docId) {
            throw { status: 400, message: 'Missing Field Doc Id!' };
        }
        if (!mongoose.Types.ObjectId.isValid(req.body.docId)) {
            throw { status: 400, message: 'Invalid Document Id!' };
        }
        const doc = await Document.findById(req.body.docId).exec();
        const users = doc.users.map((user) => user.toString());
        if (!users.includes(req.user._id.toString())) {
            doc.users.push(req.user._id);
            doc.markModified('users');
        }
        if (req.body.content) {
            doc.content = req.body.content;
            doc.markModified('content');
        }
        return res.json(await doc.save());
    } catch (error) {
        return next(error);
    }
});

router.post('/delete', async (req, res, next) => {
    try {
        if (!req.body.docId) {
            throw { status: 400, message: 'Missing Field Doc Id!' };
        }
        if (!mongoose.Types.ObjectId.isValid(req.body.docId)) {
            throw { status: 400, message: 'Invalid Document Id!' };
        }
        await Document.remove({_id: req.body._id});
        return res.json({success: 1});
    } catch (error) {
        
    }
});

module.exports = router;