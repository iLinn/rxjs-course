import * as express from 'express';
import { Application } from 'express';
import { SERVER_API_URL } from '../src/app/common/constants';
import {
  getAllCourses,
  getCourseById,
} from './get-courses.route';
import {saveCourse} from './save-course.route';
import { searchLessons} from './search-lessons.route';

const bodyParser = require('body-parser');

const app: Application = express();

app.use(bodyParser.json());

app.route(SERVER_API_URL.COURSES).get(getAllCourses);

app.route(SERVER_API_URL.COURSES_ID).get(getCourseById);

app.route(SERVER_API_URL.LESSONS).get(searchLessons);

app.route(SERVER_API_URL.COURSES_ID).put(saveCourse);



const httpServer: any = app.listen(9000, () => {
    console.log('HTTP REST API Server running at http://localhost:' + httpServer.address().port);
});



