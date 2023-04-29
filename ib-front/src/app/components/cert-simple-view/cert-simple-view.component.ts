import { Component, OnInit } from '@angular/core';
import { CertificateDTO, CertificateService, CertificateType } from 'src/app/services/certificate.service';

@Component({
  selector: 'app-cert-simple-view',
  templateUrl: './cert-simple-view.component.html',
  styleUrls: ['./cert-simple-view.component.css']
})
export class CertSimpleViewComponent implements OnInit {
  certificates:CertificateDTO[] = [];
  constructor(private certService:CertificateService){}


  ngOnInit(): void {
   this.certService.getAll().subscribe((res)=>
      this.certificates = res
   );
  }


  getClassForCertificateType(type: CertificateType) {
    console.log(type.toString());
    switch(type.toString()) {
      case 'ROOT':
        return 'root-type';
      case 'INTERMEDIATE':
        return 'intermediate-type';
      case 'END':
        return 'end-type';
      default:
        return 'intermediate-type';
    }
  }

}
