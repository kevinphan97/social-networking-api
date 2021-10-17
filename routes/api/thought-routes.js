const router = require('express').Router();

const { route } = require('.');
const {
    getAllThoughts,
    GetThoughtsById,
    createThoughts,
    updateThoughts,
    deleteThoughts,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controllers');

router.route('/').get(getAllThoughts);

router.route('/:id').get(GetThoughtsById).put(updateThoughts).delete(deleteThoughts);

router.route('/:userId').post(createThoughts);

router.route('/:thoughtId/reactions').post(addReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;