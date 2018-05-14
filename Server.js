import express from 'express';
import mongoose from 'mongoose';
import {api} from "./routes";
import middleware from './middlewares';
import formidable from 'express-formidable';
import {socketIO} from "./socket";

const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('image'));
middleware(app);
api(app);
app.use(formidable({
    uploadDir: './image',
}));

app.post('/upload', function (req, res) {
    fs.rename(req.files.avatar.path, req.files.avatar.path + '.jpg', err => {
        console.error()
    });

    const avatar = req.files.avatar.path.split('/');
    res.send(JSON.stringify({avatar: (avatar[1] + '.jpg')}))

});

const server = app.listen(port, () => console.log(`Your API Server is running on port ${ port }`));
const io = require('socket.io').listen(server);
socketIO(io);
// Mongodb connect
mongoose.connect('mongodb://localhost:27017/demo').then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

