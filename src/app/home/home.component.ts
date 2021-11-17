import {Component, OnInit} from '@angular/core';
import {
  interval,
  noop,
  Observable,
  of,
  throwError,
  timer,
} from 'rxjs';
import {
  catchError,
  delay,
  delayWhen,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {Course} from '../model/course';

export enum COURSES_CATEGORY {
  BEGINNER = 'BEGINNER',
  ADVANCED = 'ADVANCED',
}

export enum API_URL {
  COURSES = '/api/courses',
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    ngOnInit() {

      const http$ = createHttpObservable(API_URL.COURSES);

      const courses$ = http$
        .pipe(
          catchError(err => {
            console.log(`ERROR OCCURED:`, err);

            return throwError(err);
          }), // move catchError as close as possible to avoid logic execution
          finalize(() => {
            console.log(`Finalize executed...`);
          }),
          tap(res => console.log('HTTP request:', res)),
          map(res => Object.values(res?.payload)),
          shareReplay(), // required to replay http request
        );

      this.beginnerCourses$ = courses$
        .pipe(
          map(courses => courses.filter(course => course.category === COURSES_CATEGORY.BEGINNER)),
        );

      this.advancedCourses$ = courses$
        .pipe(
          map(courses => courses.filter(course => course.category === COURSES_CATEGORY.ADVANCED)),
        );
    }

}
