import { Injectable } from '@angular/core';
import {NgToastService} from "ng-angular-popup";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastService: NgToastService) { }

  showSuccess(title: string, message: string, position: 'tr' | 'tl') {
    this.toastService.success({
      detail: title,
      summary: message,
      position: position,
      duration: 5000
    });
  }

  showWarning(title: string, message: string, position: 'tr' | 'tl') {
    this.toastService.warning({
      detail: title,
      summary: message,
      position: position,
      duration: 5000
    });
  }

  showInfo(title: string, message: string, position: 'tr' | 'tl') {
    this.toastService.info({
      detail: title,
      summary: message,
      position: position,
      duration: 5000
    });
  }

  showError(message: string, position: 'tr' | 'tl') {
    this.toastService.error({
      detail: "Error",
      summary: message,
      position: position,
      duration: 5000
    });
  }

  showDefaultError(position: 'tr' | 'tl') {
    this.toastService.error({
      detail: "Error",
      summary: "Something went wrong",
      position: position,
      duration: 5000
    });
  }
}
