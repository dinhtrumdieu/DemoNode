import mongoose from 'mongoose'

let LocationObject = mongoose.Schema({
    loc: {
        type: {type: String},
        coordinates: []
    }
});
// define the index
LocationObject.index({loc: '2dsphere'});

export const Location = mongoose.model('Location', LocationObject);