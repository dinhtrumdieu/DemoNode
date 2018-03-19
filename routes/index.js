import {MyModel} from "../models/Location";
import {User} from "../models/User";

export const api = (app) => {

    // get list
    app.route('/')
        .get(function (req, res) {
            MyModel.find({
                location:
                    { $near:
                            {
                                $geometry: { type: "Point",  coordinates: [ -73.9667, 40.78 ] },
                                $minDistance: 1000,
                                $maxDistance: 5000
                            }
                    }
            }).exec().then(data => {
                res.send(data);
            }).catch(error => console.log(error));
        });

    // add user
    app.route('/user').get(function (req, res) {
        User.find().exec().then(data => {
            res.send(data);
        }).catch(error => console.log(error));
    });

    // add location
    /*MyModel.create([{
        name: "Polo ",
        location: {
            formType:'Point',
            coordinates: [-73.9375, 40.323],
        }
    },
        {
            name: "Grounds",
            location: {
                formType:'Point',
                coordinates: [-73.9375, 42.323],
            }
        },
        {
            name: "Polo Grounds",
            location: {
                formType:'Point',
                coordinates: [-73.9375, 43.323],
            }
        }]);*/

};
