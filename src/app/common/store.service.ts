import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  throwError,
  // timer,
} from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import {
  catchError,
  // delayWhen,
  filter,
  map,
  // retryWhen,
  // shareReplay,
  tap,
} from 'rxjs/operators';
import { Course } from '../model/course';
import { COURSES_CATEGORY, SERVER_API_URL } from './constants';
import { createHttpObservable } from './util';

@Injectable({
  providedIn: 'root',
})

export class Store {

  private storeSubject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.storeSubject.asObservable();


  public initStore() {

    const http$ = createHttpObservable(SERVER_API_URL.COURSES);

    http$
      .pipe(
        catchError(err => {
          console.log(`ERROR OCCURED:`, err);

          return throwError(err);
        }), // move catchError as close as possible to avoid logic execution
        // finalize(() => {
        //   console.log(`Finalize executed...`);
        // }),
        tap(res => console.log('HTTP request:', res)),
        map(res => Object.values(res?.payload)),
        // shareReplay(), // required to replay http request
        // retryWhen(errors => errors.pipe(
        //   delayWhen(() => timer(2000)),
        // )),
      )
      .subscribe(
        courses => this.storeSubject.next(courses),
      );
  }

  public selectCourseById(courseId: number) {
    return this.courses$
      .pipe(
        map(courses => courses.find(course => course.id === Number(courseId))),
        filter(course => !!course),
    );
  }

  public selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory(COURSES_CATEGORY.BEGINNER);
  }

  public selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory(COURSES_CATEGORY.ADVANCED);
  }

  public selectIntermediateCourses(): Observable<Course[]> {
    return this.filterByCategory(COURSES_CATEGORY.INTERMEDIATE);
  }

  public filterByCategory(category: COURSES_CATEGORY) {
    return this.courses$
        .pipe(
          map(courses => courses.filter(course => course.category === category)),
        );
  }

  public saveCourse(courseId: number, changes: Course): Observable<Response> {
    console.log('SAVE COURSE');
    const courses = this.storeSubject.getValue();
    const courseIndex = courses.findIndex(course => course.id === courseId);

    const newCoursesList = courses.slice(0);

    newCoursesList[courseIndex] = {
      ...courses[courseIndex],
      ...changes,
    };

    this.storeSubject.next(newCoursesList);

    return this.fetchCourseSave(courseId, changes);
  }

  private fetchCourseSave(courseId: number, changes: Course) {
    return fromPromise(
      fetch(`${SERVER_API_URL.COURSES}/${courseId}`,
      {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
          'conten-type': 'application/json',
        },
      },
    ));
  }
}
