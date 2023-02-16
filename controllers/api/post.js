const router = require('express').Router();
const isAuthenticated = require('../../util/auth');
const { Post, User, Comment } = require('../../models/index');


router.get('/newpost', isAuthenticated, async (req, res) => {
    try {
        res.render('newpost', { login: req.isAuthenticated() });
    } catch (err) { res.status(500).send('404 not found'); }
});


router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: { id: req.params.id },
            include: [
                { model: User },
                
                {
                    model: Comment,
                    include: [User]
                }]
        });
        if (!postData) {
            return res.status(404).send('404 not found');
        }
        const post = postData.get({ plain: true });
        res.render('post', { post, login: req.isAuthenticated() });
    } catch (err) { res.status(500).send('Something went wrong'); }
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const postData = await Post.findOne({ where: { id: req.params.id } });
        const post = postData.get({ plain: true });
        if (post.user_id !== req.user.id) {
            return res.status(400).send('lack of permisstion');
        }
        res.render('edit', { post, login: req.isAuthenticated() });
    } catch (err) { res.status(500).send('Something went wrong'); }
});


router.post('/', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    const user_id = req.user.id;
    try {
        await Post.create({
            title,
            content,
            user_id
        });
        res.status(201).redirect('/user/dashboard');
    } catch (err) { res.status(500).send('Failed to create new post'); }
});

router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const updatePost = await Post.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(201).send(updatePost);
    } catch (err) { res.status(500).send('Failed to update'); }
});


router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        await Post.destroy({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (err) { res.status(500).send('Failed to delete'); }
});

module.exports = router;