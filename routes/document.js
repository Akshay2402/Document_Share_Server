const router = require('express').Router();
const mongoose = require('mongoose');
const Document = mongoose.model('Document');
const User = mongoose.model('User');
const mailer = require('../controllers/mailer');

router.post('/new', async (req, res, next) => {
    try {
        if (!req.body.content) {
            throw { status: 400, message: 'Missing Field Content!' };
        }
        const documentObj = {
            content: req.body.content
        };
        const documentInstance = new Document(documentObj);
        const savedDoc = await documentInstance.save();

        // update doc_id to the user
        const user = await User.findById(req.user._id).exec();
        if (!user.documents) {
            user.documents = [savedDoc._id];
        } else {
            user.documents.push(savedDoc._id);
        }
        await user.save();
        return res.json(savedDoc);
    } catch (error) {
        return next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {

        let user = await User.findById(req.user._id)
        .select('documents last_seen_at is_online')
        .populate('documents')
        .exec();
        
        user.is_online = true;
        user.markModified('is_online');
        await user.save();

        // assuming only one document right now as we are not giving creating new doc fuctionality
        // TODO: Later we will change it when applications scope increases
        const doc = user.documents[0];

        // get users who has been shared this document
        let users = await User.find({documents: {$in: [doc._id]}})
        .select('name email is_online last_seen_at')
        .lean().exec();

        return res.json({doc, users}); 
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
        if (req.body.content) {
            doc.content = req.body.content;
            doc.markModified('content');
            return res.json(await doc.save());
        } else {
            return res.json(doc);
        }

    } catch (error) {
        return next(error);
    }
});


/**
 * THIS API WILL BE USED IN FUTURE
 */
router.post('/delete', async (req, res, next) => {
    try {
        if (!req.body.docId) {
            throw { status: 400, message: 'Missing Field Doc Id!' };
        }
        if (!mongoose.Types.ObjectId.isValid(req.body.docId)) {
            throw { status: 400, message: 'Invalid Document Id!' };
        }
        await Document.remove({_id: req.body._id});

        //TODO: remove doc from all the users having shared this doc
        return res.json({success: 1});
    } catch (error) {
        
    }
});

// Document can be Shared only to regestered user 
router.post('/share', async (req, res, next) => {
    try {
        if (!req.body.email, !req.body.doc_id) {
            throw { status: 400, message: 'Missing Field Email or Doc Id!' };
        }
        const user = await User.findOne({email: req.body.email}).exec();
        if (!user) {
            throw { status: 400, message: 'This user is not registered!' };
        }

        if (!user.documents) {
            user.documents = [req.body.doc_id];
        } else {
            user.documents.push(req.body.doc_id);
        }
        user.markModified('documents');
        await user.save();

        // Notify user that a document has been shared to him
        const mailPaylod = mailer.constructMailPayload(user.name, 'DOCUMENT_SHARE', {from: req.user.name});
        await mailer.sendMail([user.email], mailPaylod);
        
        return res.json({success: 1});
    } catch (error) {
        
    }
});

module.exports = router;