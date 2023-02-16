const router = require('express').Router();
const passport = require('passport');
const { User } = require('../../models/index');

// return the login page
router.get('/login', (req, res) => {
    res.render('login');
});


router.post('/login/password', passport.authenticate('local', {
    successReturnToOrRedirect: '/user/dashboard',
    failureRedirect: '/user/login',
}));

//return the signup page
router.get('/register', (req, res) => {
    res.render('register');
});


router.post('/register', async (req, res, next) => {
    try {
        const newUserData = await User.create(req.body);
        const newUser = newUserData.get({ plain: true });
        req.login(newUser, err => {
            if (err) { return next(err); }
            res.redirect('/user/dashboard');
        });
    } catch (err) {
        res.status(400).send(err.errors.map(e => e.message));
    }
});

//destroy the session and redirect to login page
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy();
        res.redirect('/user/login');
    });
});

module.exports = router;