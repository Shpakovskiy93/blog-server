import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

        res.json(tags);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'articles not found'
        })
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'articles not found'
        })
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            }, 
            {
                $inc: {viewsCount: 1},
            },
            {
                returnDocument: 'after',
            },
        ).populate('user')
        .then((doc) => {
            if(!doc) {
                return res.status(404).json({
                    message: 'article not found!'
                })
            }
            res.json(doc);
        })
        .catch(err => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    message: 'failed to return article!!'
                })
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'article not found'
        })
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        })
        .then( doc => {
            if(!doc) {
                return res.status(404).json({
                    message: 'article not found'
                })
            }
            res.json({
                success: true,
            })
        })
        .catch(err => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    message: 'failed to delete article'
                })
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'articles not found'
        })
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'failed to create article'
        })
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.body.userId,
            tags: req.body.tags,
        });

        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'failed to update article'
        })
    }
};