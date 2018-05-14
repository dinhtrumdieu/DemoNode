import mongoose from 'mongoose'

let DislikeSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    dislikeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
});

export const Dislike = mongoose.model('Dislike', DislikeSchema);
