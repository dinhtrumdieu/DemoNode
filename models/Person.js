import mongoose from 'mongoose'

let PersonSchema = mongoose.Schema({
    name: String,
    age: Number,
    birthday: Date,
    gender: String,
    // define the geospatial field
    loc: {
        type: {type: String},
        coordinates: []
    },
    avatar: String,
    images: [],
    accountId: String,
    introduce: String,
    company: String,
    office: String,
});

// define the index
PersonSchema.index({loc: '2dsphere'});

export const Person = mongoose.model('Person', PersonSchema);