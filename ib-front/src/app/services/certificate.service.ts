import { Injectable } from '@angular/core';
import { environment } from './user.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private value$ = new BehaviorSubject<any>({});
  selectedValue$ = this.value$.asObservable(); 

  constructor(private http : HttpClient) {}
  setValue(test: any) {          
    this.value$.next(test);
  }

  getAll(): Observable<CertificateDTO[]>{
    return this.http.get<CertificateDTO[]>(environment.apiHost + `api/certificate`);
  }
}


export interface CertificateDTO{
  userEmail:string,
  type:CertificateType,
  validFrom:Date,
  validTo:Date,
  serialNumber:string

}

export enum CertificateType{
  ROOT,
  INTERMEDIATE,
  END
}