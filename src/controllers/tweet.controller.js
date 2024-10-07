import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {deleteMediaFromCloudinary} from '../utils/cloudinaryDelete.js'
import mongoose, {isValidObjectId} from "mongoose"

const createTweet = asyncHandler(async(req, res)=> {
    const {content} = req.body;
    if(!content || content.trim().length === 0 ){
        throw new ApiError(400, "content is required");
    }
    let contentLocalPath;
    if(req.files && Array.isArray(req.files.contentFile) && req.files.contentFile.length>0){
        contentLocalPath = req.files.contentFile[0].path;
    }
    const conFile = await uploadOnCloudinary(contentLocalPath)
    const tweet = await Tweet.create({content, contentFile: conFile?.url})

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet Uploaded SuccessFully")
    )
})

const getTweetbyId = asyncHandler(async(req, res)=> {
    const {tweetID} = req.params;
    if(!isValidObjectId(tweetID) || !tweetID){
        throw new ApiError(404, "Invalid tweet id")
    }
    const tweetDetails = await Tweet.findById(tweetID);
    if (!tweetDetails) {
        throw new ApiError(404, "Tweet not found");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, tweetDetails, "Tweet Fetched successfully")
    )
})

const updateTweet = asyncHandler(async(req,res) => {
    const {tweetID} = req.params;
    const {content} = req.body;
    if(!isValidObjectId(tweetID) || !tweetID){
        throw new ApiError(404, "Invalid tweet id")
    }
    const updatedTweet = await Tweet.findOneAndUpdate(
        { _id: tweetID },
        {
            content: content
        },
        { new: true }
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, "Tweet content updated successfully")
    )
})

const deleteTweet = asyncHandler(async(req, res)=> {
    const {tweetID} = req.params;
    if(!isValidObjectId(tweetID) || !tweetID){
        throw new ApiError(404, "Invalid tweet id")
    }

    function extractPublicId(url) {
        // Regular expression to match the publicId in the Cloudinary URL
        const pattern = /\/upload\/(?:v\d+\/)?([^\/]+)\./;
        const match = url.match(pattern);
        return match ? match[1] : null;
    }
    const tweet = await Tweet.findById(tweetID)
    if(!tweet){
        throw new ApiError(404, "tweet not found");
    }
    
    const deletedTweet = await Tweet.findByIdAndDelete(tweetID)
    const tweetPublicId = extractPublicId(deletedTweet.contentFile)
    await deleteMediaFromCloudinary(tweetPublicId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedTweet, "tweet deleted Successfully")
    )
})

export {
    createTweet,
    getTweetbyId,
    updateTweet,
    deleteTweet
}