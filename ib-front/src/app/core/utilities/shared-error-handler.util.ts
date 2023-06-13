import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import {CustomError} from "../models/custom-error";

export function handleSharedError(error: HttpErrorResponse): Observable<never> {
  console.log("EVE GA1")
  console.log(error)

  let customError: CustomError = {
    status: error.status,
    message: error.error.message || 'Something went wrong. Please try again later.',
    timeStamp: Date.now(),
  };

  return throwError(customError);
}
