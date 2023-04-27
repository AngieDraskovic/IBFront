import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  currentRole: BehaviorSubject<string> = new BehaviorSubject<string>("unregistered");
  constructor() {}

}
