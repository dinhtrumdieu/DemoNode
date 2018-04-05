import mongoose from 'mongoose'

let PersonSchema =  mongoose.Schema({
    name: String,
    age: Number,
    birthday: Date,
    gender: String,
    // define the geospatial field
    loc: {
        type: {type: String},
        coordinates: []
    },
});

// define the index
PersonSchema.index({loc: '2dsphere'});

export const Person = mongoose.model('Person', PersonSchema);