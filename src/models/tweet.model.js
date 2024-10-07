import mongoose, { Schema } from "mongoose";

const  tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        contentFile: {
            type: String,
            required: true
        }
    },
    {timestamps:true}
)

export const Tweet = mongoose.model("Tweet", tweetSchema)