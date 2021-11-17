import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {CourseComponent} from './course/course.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,

    },
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: 'courses/:id',
        component: CourseComponent,
    },
    {
        path: '**',
        redirectTo: '/',
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
