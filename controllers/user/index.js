const router = require('express').Router();
const userRouter = require('./user');
const dashboardRouter = require('./dashboard');

router.use('/', userRouter);
router.use('/dashboard', dashboardRouter);

module.exports = router;