import {Person} from "../models/Person";
import {Favorite} from "../models/Favorite";

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
    app.route('/user').get(function (req, res) {
        const accountId = req.headers.authorization;
        Person.findOne().where('accountId').equals(accountId).exec().then().then(data => {
            const gender = data && data.gender === 'male' ? 'female' : 'male';
            Person.find().where('gender').equals(gender).exec().then(data => {
                res.send(data);
            }).catch(error => console.log(error));
        }).catch(error => console.log(error));
    });

    // get user
    app.route('/me').get(function (req, res) {
        const accountId = req.headers.authorization;
        Person.findOne().where('accountId').equals(accountId).exec().then().then(data => {
            res.send(data);
        }).catch(error => console.log(error));
    });

    // Person.find().select('name age').exec().then(data => {
    //     res.send(data);
    // }).catch(error => console.log(error));

    // add user
    app.route('/updateInforUser').post((function (req, res) {
        const user = {
            accountId: req.body.accountId,
            name: req.body.name,
            age: req.body.birthday,
            birthday: 20 - 4 - 1995,
            gender: req.body.gender ? "male" : 'female',
            loc: {type: 'Point', coordinates: [req.body.location.latitude, req.body.location.longitude]},
            image: listImage[Math.floor(Math.random() * listImage.length)]
        };
        Person.create(user);
        res.send({name: 'ad'})
    }));

    // send request
    app.route('/sendRequest').post(function (req, res) {
        console.log(req.body.sender_id + ":" + req.body.receiver_id);
        Favorite.create({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            is_active: false
        });
    });
};
