import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
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

    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {

    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
            .pipe(
                debug( RxJsLoggingLevel.INFO, 'COURSE VALUE '),
            );

        setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);

    }

    ngAfterViewInit() {

        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                startWith(''), // init start value with empty search
                debug( RxJsLoggingLevel.TRACE, 'SEARCH '),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
                debug( RxJsLoggingLevel.DEBUG, 'LESSONS VALUE '),
            );

    }

    loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable(
          `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
          .pipe(
              map(res => res?.payload as Lesson[]),
          );
    }


}











