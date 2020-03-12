
import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private injector: Injector,
  ) { }

  /**
   * Handle error
   *
   * @param {(Error | HttpErrorResponse)} error
   * @memberof ErrorsHandler
   * @summary ErrorHandler is created before the provider, hence the Injector is needed.
   */
  handleError(error: Error | HttpErrorResponse) {
    const router = this.injector.get(Router);
    // const toastr = this.injector.get(ToastrService);

    if (error instanceof HttpErrorResponse) {
      // Error from the API / Server
      console.log('Server: ', error.status);
    } else {
      // Error from client
      console.log('Client: ', error);
    }
  }

}

