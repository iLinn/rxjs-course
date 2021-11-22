import { COURSES_CATEGORY } from '../common/constants';


export interface Course {
    id: number;
    description: string;
    iconUrl: string;
    courseListIcon: string;
    longDescription: string;
    category: COURSES_CATEGORY;
    lessonsCount: number;
}
