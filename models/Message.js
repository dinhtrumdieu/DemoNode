import mongoose from 'mongoose'

let MessageSchema = mongoose.Schema({
    id_room: String,
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    content: String,
    createAt: Date
});

export const Message = mongoose.model('Message', MessageSchema);
