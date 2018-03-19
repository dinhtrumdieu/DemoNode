import mongoose from 'mongoose'

export const MyModel = mongoose.model('location', new mongoose.Schema(
    {
        name: String,
        location: {
            formType:String,
            coordinates: [Number],  // [<longitude>, <latitude>]
        }
    }).index({ location: "2dsphere" }));