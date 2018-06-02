import {Person} from "../models/Person";
import {Favorite} from "../models/Favorite";
import {Message} from "../models/Message";
import {Dislike} from "../models/Dislike";

export const api = (app) => {

    // get list
    app.route('/')
        .get(function (req, res) {
            let coords = {type: 'Point', coordinates: [8, 8]};
            Person.find({loc: {$near: coords}}).exec().then(data => {
                res.send(data);
            }).catch(error => {
                res.send(JSON.stringify(error))
            });
        });

    // find user
    app.route('/user/:longitude/:latitude').get(function (req, res) {
        const accountId = req.headers.authorization;
        const longitude = req.params.longitude;
        const latitude = req.params.latitude;

        Person.findOne().where('accountId').equals(accountId).exec().then(data => {
            const gender = data && data.gender === 'male' ? 'female' : 'male';
            const coords = {type: 'Point', coordinates: [longitude, latitude]};
            const userId = data && data._id;
            const listMatches = [];

            Favorite.find({'senderId': userId}).where('status').equals(0).exec().then(data => {
                data.map(item => {
                    listMatches.push(item.receiverId);
                });
                Favorite.find().or([{'senderId': userId},
                    {'receiverId': userId}]).where('status').equals(-1).exec().then(data => {
                    data.map(item => {
                        listMatches.push((userId.toString() === item.senderId.toString())
                            ? item.receiverId : item.senderId);
                    });
                    // select users matched
                    Favorite.find().or([{'senderId': userId},
                        {'receiverId': userId}]).where('status').equals(1).exec().then(data => {
                        data.map(item => {
                            listMatches.push((userId.toString() === item.senderId.toString())
                                ? item.receiverId : item.senderId);
                        });
                        // select and remove users matched
                        Person.find({
                            loc: {$near: coords, $maxDistance: 50000},
                            _id: {"$nin": listMatches}
                        }).where('gender').equals(gender).exec().then(data => {
                            res.send(data);
                        }).catch(error => console.log(error));
                    }).catch(error => console.log(error));
                }).catch(error => console.log(error));
            }).catch(error => console.log(error));
        }).catch(error => console.log(error));
    });

    // get user
    app.route('/me').get(function (req, res) {
        const accountId = req.headers.authorization;
        Person.findOne().where('accountId').equals(accountId).exec().then(data => {
            res.send(data);
        }).catch(error => console.log(error));
    });

    // check User
    app.route('/checkUser/:accountId').get(function (req, res) {
        const accountId = req.params.accountId;
        console.log(accountId);
        Person.findOne().where('accountId').equals(accountId).exec().then(data => {
            console.log(JSON.stringify(data));
            res.send(data);
        }).catch(error => console.log(error));
    });

    // add user
    app.route('/updateInforUser').post((function (req, res) {
        const user = {
            accountId: req.body.accountId,
            name: req.body.name,
            age: req.body.birthday,
            birthday: 20 - 4 - 1995,
            gender: req.body.gender ? "male" : 'female',
            loc: {
                type: 'Point',
                coordinates: [req.body.location.longitude, req.body.location.latitude],
                maxDistance: 50
            },
            avatar: req.body.avatar,
            images: [],
            introduce: null,
            company: null,
            job: null,
            hometown: null,
            address: null,
            is_display_age: true,
        };
        Person.create(user);
        res.send(JSON.stringify({avatar: 'ava.jpg'}))
    }));

    // send request
    app.route('/sendRequest').post(function (req, res) {
        const senderId = req.body.sender_id;
        const receiverId = req.body.receiver_id;
        const status = req.body.status;

        Favorite.findOne().or([{'senderId': senderId, 'receiverId': receiverId},
            {'senderId': receiverId, 'receiverId': senderId}]).exec().then(data => {
            if (data) {
                console.log("update: "+status);
                if (status === -1) {
                    let matches = {
                        senderId: senderId,
                        receiverId: receiverId,
                        status:  -1
                    };
                    Favorite.create(matches);
                } else {
                    Favorite.findOneAndUpdate({_id: data._id}, {$set: {status: 1}}, {new: true}, function (err, doc) {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                        console.log("matches: " + doc);
                    });
                }
            } else {
                let matches = {
                    senderId: senderId,
                    receiverId: receiverId,
                    status: status === -1 ? -1 : 0
                };
                Favorite.create(matches);
                console.log("create")
            }
            //res.send(data);
        }).catch(error => {
            console.log(error)
        });
    });

    // dislike
    app.route('/dislike').post(function (req, res) {
        const userId = req.body.userId;
        const dislikeId = req.body.dislikeId;
        let dislike = {
            userId: userId,
            dislikeId: dislikeId,
        };
        Dislike.create(dislike);
    });

    // get list matches
    app.route('/matches').post(function (req, res) {
        const userId = req.body.userId;
        Favorite.find().populate({path: 'senderId'}).populate({path: 'receiverId'}).or([{'senderId': userId},
            {'receiverId': userId}]).where('status').equals(1).exec().then(data => {
            res.send(data);
        }).catch(error => console.log(error));
    });

    // edit avatar
    app.route('/editAvatar').post(function (req, res) {
        const accountId = req.headers.authorization;
        const avatar = req.body.avatar;
        Person.findOneAndUpdate({accountId: accountId}, {$set: {avatar: avatar}}, {new: true}, function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            res.send(doc)
        }).catch(error => console.log(error));
    });

    // edit avatar
    app.route('/updateListImage').post(function (req, res) {
        const accountId = req.headers.authorization;
        const images = req.body.images;
        const introduce = req.body.introduce;
        const company = req.body.company;
        const job = req.body.office;
        const hometown = req.body.hometown;
        const address = req.body.address;
        Person.findOneAndUpdate({accountId: accountId},
            {
                $set: {
                    images: images, introduce: introduce, company: company, job: job,
                    hometown: hometown, address: address
                }
            },
            {new: true}, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                res.send(doc)
            }).catch(error => console.log(error));
    });

    app.route('/updatePreferences').post(function (req, res) {
        const accountId = req.headers.authorization;
        const is_display_age = req.body.is_display_age;
        const maxDistance = req.body.maxDistance;
        Person.findOneAndUpdate({accountId: accountId},
            {
                $set: {
                    is_display_age: is_display_age,
                    "loc.maxDistance": maxDistance
                },
            },
            {new: true}, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                res.send(doc)
            }).catch(error => console.log(error));
    });

    // Chat
    app.route('/getMessage/:id_room').get(function (req, res) {
        const id_room = req.params.id_room;
        Message.find().where('id_room').equals(id_room).exec().then(data => {
            res.send(data);
        }).catch(error => console.log(error));
    });

    // get list message
    app.route('/listMessage').post(function (req, res) {
        const userId = req.body.userId;
        Favorite.find().populate({path: 'senderId'}).populate({path: 'receiverId'}).or([{'senderId': userId},
            {'receiverId': userId}]).where('status').equals(1).exec().then(async data => {
            const listMessage = data.map(async item => {
                return await Message.findOne().where('id_room').equals(item._id);
            });
            Promise.all(listMessage).then(data => console.log(data));
        }).catch(error => console.log(error));
    });

    // get list send request
    app.route('/getRequest/:userId').get(function (req, res) {
        const userId = req.params.userId;
        Favorite.find({'senderId': userId}).populate({path: 'receiverId'}).where('status').equals(0).exec().then(data => {
            res.send(data);
        }).catch(error => console.log(error));
    });

    app.route('/getNotMatches/:userId').get(function (req, res) {
        const userId = req.params.userId;
        Favorite.find({'senderId': userId}).populate({path: 'receiverId'}).where('status').equals(-1).exec().then(data => {
            res.send(data);
        }).catch(error => console.log(error));
    });

};
