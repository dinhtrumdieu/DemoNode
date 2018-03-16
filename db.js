const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testing').then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

const MyModel = mongoose.model('location', new mongoose.Schema(
    {
        name: String,
        location: {
            formType: [Number],  // [<longitude>, <latitude>]
        }
    }));
// Works

/*MyModel.create({
    name: "Polo Grounds",
    location: {
        formType: [-73.9375, 40.323],
    }
});*/

MyModel.find(
    {
        location:
            {
                formType: [-73.9375, 40.323]
            }
    }
).exec().then(data => {
    console.log(data)
}).catch(error => console.log(error));

/*MyModel.find().exec().then(data => {
    console.log(data)
}).catch(error => console.log(error));*/
