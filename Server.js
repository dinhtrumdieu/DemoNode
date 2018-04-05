import express from 'express';
import mongoose from 'mongoose';
import {api} from "./routes";
import {Person} from "./models/Person";

const app = express();
const port =  3000;

api(app);

app.listen(port, () => console.log(`Your API Server is running on port ${ port }`));

// Mongodb connect
mongoose.connect('mongodb://localhost:27017/testing').then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

let data = [
    {
        name: "Nguyen Trung Dinh",
        age: 23,
        birthday: 20-4-1995,
        gender: "male",
        loc: {type: 'Point', coordinates: [-20.0, 5.0]}
        },
    {
        name: "Nguyen Thi Teo",
        age: 23,
        birthday: 20-4-1995,
        gender: "female",
        loc: {type: 'Point', coordinates: [6.0, 10.0]}
    },
    {
        name: "Nguyen Trung Tien",
        age: 23,
        birthday: 20-4-1995,
        gender: "male",
        loc: {type: 'Point', coordinates: [8.0, 8.0]}
    },

];

/*Person.create(data);*/
