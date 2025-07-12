import mongoose, { Schema } from "mongoose";

const ArticleSchema = new Schema({
  url: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);