const router = require('express').Router();

router.get('/', (req, res, next) => {
    return res.json("Welcome to Document Sharer!");
});

module.exports = router;