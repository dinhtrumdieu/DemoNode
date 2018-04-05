const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testing').then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

let LocationObject = mongoose.Schema({
    loc: {
        type: {type: String},
        coordinates: []
    }
});
// define the index
LocationObject.index({loc: '2dsphere'});

const location = mongoose.model('Location', LocationObject);

let data = [
    {loc: {type: 'Point', coordinates: [-20.0, 5.0]}},
    {loc: {type: 'Point', coordinates: [6.0, 10.0]}},
    {loc: {type: 'Point', coordinates: [34.0, -50.0]}},
    {loc: {type: 'Point', coordinates: [-100.0, 70.0]}},
    {loc: {type: 'Point', coordinates: [38.0, 38.0]}}
];

/*
location.create(data);*/

let coords = {type: 'Point', coordinates: [6, 9]};

location.find({loc: {$near: coords}}).exec().then(data => {
    console.log('Closest to %s is %s', JSON.stringify(coords), data);
}).catch(error => {
    console.log(JSON.stringify(error))
});
