import mongoose from 'mongoose'

let FavoriteSchema = mongoose.Schema({
    sender_id: String,
    receiver_id: String,
    is_active: Boolean
});

export const Favorite = mongoose.model('Favorite', FavoriteSchema);