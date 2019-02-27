const express = require('express')
const router = express.Router();

// serve up static resources
router.use('/static', express.static('static'));

// frontend routes
router.use('/', require('./Webapp'));

// all API routes
router.use('/api', require('./api'));

// any other url, send 404
router.use((req, res, next) => {
    res.status(404).send('404 ;)');
});

module.exports = router;
