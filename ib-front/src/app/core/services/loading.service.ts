import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = new BehaviorSubject(false);
  private _isLoadingMain = new BehaviorSubject(false);

  get isLoading() {
    return this._isLoading.asObservable();
  }

  get isLoadingMain() {
    return this._isLoadingMain.asObservable();
  }

  show() {
    this._isLoading.next(true);
  }

  showMain() {
    this._isLoadingMain.next(true);
  }

  hide() {
    this._isLoading.next(false);
  }

  hideMain() {
    this._isLoadingMain.next(false);
  }
}
