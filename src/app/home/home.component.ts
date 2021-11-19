import {Component, OnInit} from '@angular/core';
import {
  Observable,
  throwError,
  timer,
} from 'rxjs';
import {
  catchError,
  delayWhen,
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

// TODO: ref: provide url as const for whole app
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
          // finalize(() => {
          //   console.log(`Finalize executed...`);
          // }),
          tap(res => console.log('HTTP request:', res)),
          map(res => Object.values(res?.payload)),
          shareReplay(), // required to replay http request
          retryWhen(errors => errors.pipe(
            delayWhen(() => timer(2000)),
          )),
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
