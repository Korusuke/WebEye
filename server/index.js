const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use('/urls', require('./redirect'));
router.use('/users', require('./signin/users'));

module.exports = router;