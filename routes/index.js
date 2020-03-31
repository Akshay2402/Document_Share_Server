const router = require('express').Router();

router.get('/', (req, res, next) => {
    return res.json("Smooth and Awesome");
});

module.exports = router;