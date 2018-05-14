import mongoose from 'mongoose'

let FavoriteSchema = mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    is_active: Boolean
});

export const Favorite = mongoose.model('Favorite', FavoriteSchema);
