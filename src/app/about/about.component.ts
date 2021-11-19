import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  noop,
  Observable,
  Subscription,
} from 'rxjs';
import {
  map,
} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { Course } from '../model/course';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {
  courses$: Observable<Course[]>;
  private subscription: Subscription;

  constructor() {}

  ngOnInit() {

    const http$ = createHttpObservable('/api/courses');

    this.courses$ = http$
      .pipe(
        map(res => Object.values(res['payload'])),
      );


    this.subscription = this.courses$.subscribe(
      courses => console.log(`LOGGED_TEXT:`, courses),
      noop,
      () => console.log(`COMPLETED`),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}






