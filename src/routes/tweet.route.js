import { Router } from "express";
import {
    createTweet,
    getTweetbyId,
    updateTweet,
    deleteTweet
} from '../controllers/tweet.controller.js'
import {upload} from '../middlewares/multer.middlewar.js'

const router = Router();
router.route('/createTweet').post(
    upload.fields([
        {
            name: "contentFile",
            maxCount: 1
        }
    ]),
    createTweet
);
router.route('/getTweetbyId/:tweetID').get(getTweetbyId)
router.route('/updatedTweet/:tweetID').patch(updateTweet)
router.route('/deleteTweet/:tweetID').delete(deleteTweet)


export default router