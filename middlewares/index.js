import bodyParser from 'body-parser'
import morgan from 'morgan'

export default function(app){

    // Log request to console
    app.use(morgan('dev'));

    // Parse post body
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

}
