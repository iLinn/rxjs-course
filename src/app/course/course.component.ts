import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  concat,
  fromEvent,
  Observable,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import {
  debug,
  RxJsLoggingLevel,
  setRxJsLoggingLevel,
} from '../common/debug';
import { Store } from '../common/store.service';
import {
  createHttpObservable,
} from '../common/util';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';


@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit, AfterViewInit {

    private courseId: number;

    public course$: Observable<Course>;
    public lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(
      private route: ActivatedRoute,
      private store: Store,
    ) {

    }

    public ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = this.store.selectCourseById(this.courseId);

        setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);
    }

    public ngAfterViewInit() {

      const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event.target.value),
          startWith(''), // init start value with empty search
          debug( RxJsLoggingLevel.TRACE, 'SEARCH '),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(search => this.loadLessons(search)),
          debug( RxJsLoggingLevel.DEBUG, 'LESSONS VALUE '),
      );

      const initialLessons$ = this.loadLessons();

      this.lessons$ = concat(initialLessons$, searchLessons$);

    }

    public loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable(
          `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
          .pipe(
              map(res => res?.payload as Lesson[]),
          );
    }


}











