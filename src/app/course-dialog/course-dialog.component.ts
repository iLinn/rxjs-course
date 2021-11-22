import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as moment from 'moment';

import { Store } from '../common/store.service';
import { Course } from '../model/course';

@Component({
    selector: 'app-course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
})
export class CourseDialogComponent implements AfterViewInit {
    form: FormGroup;
    course: Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;
    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course,
        private store: Store,
    ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required],
        });

    }

    // ngOnInit() {
        // this.form.valueChanges
        //     .pipe(
        //         filter(() => this.form.valid),
        //         concatMap(changes => this.saveCourse(changes)),
        //     )
        //     .subscribe();
    // }


    public ngAfterViewInit() {
        // fromEvent(this.saveButton.nativeElement, 'click')
        //     .pipe(
        //       exhaustMap(() => this.saveCourse(this.form.value)),
        //     )
        //     .subscribe();
    }

    public save(): void {
      this.store.saveCourse(this.course.id, this.form.value)
        .subscribe(
          () => this.close(),
          err => console.log(`Error saving course:`, err),
        );
    }

    public close(): void {
      console.log(`CLOSED:`);
      this.dialogRef.close();
    }


}
