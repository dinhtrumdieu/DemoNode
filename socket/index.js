import {Message} from "../models/Message";

export const socketIO = (io) => {
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('join_room', (id_room) => {
            console.log(id_room);
            socket.on(id_room, (data) => {
                io.emit(id_room, data.data);
                Message.create(data.message)
            });
        });
    });

};

