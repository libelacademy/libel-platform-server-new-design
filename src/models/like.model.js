import mongoose from '../config/mongodb.js';

const likeSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    }
  },
  {
    collection: 'likes',
    versionKey: false,
    timestamps: true
  }
)

const Like = mongoose.model('Like', likeSchema);

export default Like;