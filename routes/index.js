import {User} from "../models/User";
import {Location} from "../models/Location";

export const api = (app) => {

    // get list
    app.route('/')
        .get(function (req, res) {
            let coords = {type: 'Point', coordinates: [6, 9]};
            Location.find({loc: {$near: coords}}).exec().then(data => {
                res.send(data);
            }).catch(error => {
                res.send(JSON.stringify(error))
            });
        });

    // add user
    app.route('/user').get(function (req, res) {
        User.find().exec().then(data => {
            res.send(data);
        }).catch(error => console.log(error));
    });

};
