

import {
  Request,
  Response,
} from 'express';
import { Course } from '../src/app/model/course';
import { COURSES } from './db-data';



export function getAllCourses(req: Request, res: Response) {


    // const error = (Math.random() >= 0.9);

    // if (error) {
    //   console.log('ERROR loading courses!');
    //   res.status(500).json({message: 'random error occurred.'});
    // } else {
      setTimeout(() => {
        res.status(200).json({payload: Object.values(COURSES)});
      }, 200);
  //  }
}


export function getCourseById(req: Request, res: Response) {

    const courseId = req.params['id'];

    const courses: Course[] = Object.values(COURSES);

    const course = courses.find(item => item.id === courseId);

    res.status(200).json(course);
}
