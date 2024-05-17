

const { Schema, model, Types } = require("mongoose");

const postSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ["Agriculture", "Business", "Education", " Entertainment", " Art", " Investment", "Uncategorized", "Weather"], message: "VALUE : is not supported" },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },

}, { timestamps: true })


module.exports = model("Post", postSchema);