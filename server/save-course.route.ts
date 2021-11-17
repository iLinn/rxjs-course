import {Request, Response} from 'express';
import {setTimeout} from 'timers';
import {COURSES} from './db-data';


export function saveCourse(req: Request, res: Response) {

    const id = req.params['id'];
    const changes = req.body;

    console.log('Saving course', id, JSON.stringify(changes));


    COURSES[id] = {
        ...COURSES[id],
        ...changes,
    };

    setTimeout(() => {

        res.status(200).json(COURSES[id]);

    }, 2000);



}
