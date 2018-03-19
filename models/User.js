import mongoose from 'mongoose'

export const User = mongoose.model('tests', new mongoose.Schema(
    {
        name: String,
        age : Number
    }));