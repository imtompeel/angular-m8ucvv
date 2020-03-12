import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable()
export class ServerInterceptor implements HttpInterceptor {

  constructor() { }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(2)
    );
  }

}
