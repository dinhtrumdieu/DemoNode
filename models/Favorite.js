import mongoose from 'mongoose'

let FavoriteSchema = mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    status: Number
});

export const Favorite = mongoose.model('Favorite', FavoriteSchema);
