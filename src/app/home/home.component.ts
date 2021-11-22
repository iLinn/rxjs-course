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
import { Store } from '../common/store.service';
import {createHttpObservable} from '../common/util';
import {Course} from '../model/course';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;
    intermedietCourses$: Observable<Course[]>;

    constructor(private store: Store) {

    }

    ngOnInit() {
      const courses$ = this.store.courses$;

      this.beginnerCourses$ = this.store.selectBeginnerCourses();

      this.advancedCourses$ = this.store.selectAdvancedCourses();

      this.intermedietCourses$ = this.store.selectIntermediateCourses();
    }

}
