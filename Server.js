import express from 'express';
import mongoose from 'mongoose';
import {MyModel} from "./models/Location";
import {api} from "./routes";

const app = express();
const port =  3000;

api(app);

app.listen(port, () => console.log(`Your API Server is running on port ${ port }`));

// Mongodb connect
mongoose.connect('mongodb://localhost:27017/testing').then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));
