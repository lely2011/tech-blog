const router = require('express').Router();
const userRoutes = require('./userRoutes');
const projectRoutes = require('./post');

router.use('/users', userRoutes);
router.user('/projects', projectRoutes);

module.exports = router;
