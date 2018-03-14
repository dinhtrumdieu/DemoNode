const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testing');

const userSchema = new mongoose.Schema({
    name:String,
    age:Number
});

const user = mongoose.model('user',userSchema);

user.find().exec().then().catch();
