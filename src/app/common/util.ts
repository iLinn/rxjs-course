import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';

export interface HttpResponse {
  payload: Course[] | Lesson[];
}

export function createHttpObservable(url: string): Observable<HttpResponse> {
  return new Observable(observer => {

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then(response => {

        if (response.ok) {
          return response.json();
        } else {
          observer.error(`Request failed with status code: ${response.status}`);
        }
      })
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(err => observer.error(err));

    return () => controller.abort();
  });
}

