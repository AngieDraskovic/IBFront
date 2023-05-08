import {CertificateStatus} from "../enums/certificate-status.enum";
import {CertificateType} from "../enums/certificate-type.enum";

export interface SslCertificate {
  userEmail: string;
  serialNumber: string;
  validFrom: Date;
  validTo: Date;
  status: CertificateStatus;
  type: CertificateType;
}
