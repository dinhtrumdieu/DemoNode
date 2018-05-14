import {Person} from "../models/Person";
import {Favorite} from "../models/Favorite";
import {Message} from "../models/Message";
import {Dislike} from "../models/Dislike";

const listImage = [
    'https://anhchonloc.com/wp-content/uploads/2015/11/hinh-nen-sieu-de-thuong-cho-may-tinh-2.jpg',
    'http://file.vforum.vn/hinh/2014/4/hinh-de-thuong-ve-tinh-yeu-2.jpg',
    'https://znews-photo-td.zadn.vn/w1024/Uploaded/ofh_fdmzsofw/2016_10_28/13151599_' +
    '807990012635341_3384564945476612801_n_1.jpg',
    'http://share3s.com/wp-content/uploads/2018/01/H%C3%ACnh-%E1%BA%A3nh-g%C3%A1i-xinh-m%E1%BB%99c-m%E1%BA%A1c-' +
    'khi%E1%BA%BFn-d%C3%A2n-m%E1%BA%A1ng-chao-%C4%91%E1%BA%A3o-con-tim-16.jpg',
    'https://4.bp.blogspot.com/-wI2XI07FYL4/VvAZ4sWPeOI/AAAAAAAAAbk/338otoe9L0U' +
    'z7zBQ2JpOvB-k78lJ3VCEA/s1600/hinh-girl-xinh-gai-dep-hot-girl-viet-nam-01.jpg',
    'http://xemanhdep.com/wp-content/uploads/2016/04/hinh-anh-girl-xinh-diu-dang-cam-o-va-hoa-mua-xuan-2.jpg',
    'https://image2.tin247.com/pictures/2018/01/21/qcu1516515266.jpg'
];

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

            Dislike.find({'userId': userId}).exec().then(data => {
                data.map(item => {
                    listMatches.push(item.dislikeId);
                });
                Favorite.find({'senderId': userId}).where('is_active').equals(false).exec().then(data => {
                    data.map(item => {
                        listMatches.push(item.receiverId);
                    });
                    // select users matched
                    Favorite.find().or([{'senderId': userId},
                        {'receiverId': userId}]).where('is_active').equals(true).exec().then(data => {
                        data.map(item => {
                            listMatches.push((userId.toString() === item.senderId.toString())
                                ? item.receiverId : item.senderId);
                        });
                        // select and remove users matched
                        Person.find({
                            loc: {$near: coords},
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
            loc: {type: 'Point', coordinates: [req.body.location.longitude, req.body.location.latitude]},
            // image: listImage[Math.floor(Math.random() * listImage.length)]
            avatar: req.body.avatar,
            images: [],
            introduce: null,
            company: null,
            office: null,
        };
        Person.create(user);
        res.send(JSON.stringify({avatar: 'ava.jpg'}))
    }));

    // send request
    app.route('/sendRequest').post(function (req, res) {
        const senderId = req.body.sender_id;
        const receiverId = req.body.receiver_id;

        Favorite.findOne().or([{'senderId': senderId, 'receiverId': receiverId},
            {'senderId': receiverId, 'receiverId': senderId}]).exec().then(data => {
            if (data) {
                Favorite.findOneAndUpdate({_id: data._id}, {$set: {is_active: true}}, {new: true}, function (err, doc) {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                    console.log("matches: " + doc);
                });
            } else {
                let matches = {
                    senderId: senderId,
                    receiverId: receiverId,
                    is_active: false
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
            {'receiverId': userId}]).where('is_active').equals(true).exec().then(data => {
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
            console.log(doc);
            res.send(doc)
        }).catch(error => console.log(error));
    });

    // edit avatar
    app.route('/updateListImage').post(function (req, res) {
        const accountId = req.headers.authorization;
        const images = req.body.images;
        const introduce = req.body.introduce;
        const company = req.body.company;
        const office = req.body.office;
        Person.findOneAndUpdate({accountId: accountId},
            {$set: {images: images, introduce: introduce, company: company, office: office}},
            {new: true}, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                console.log(doc);
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

};
