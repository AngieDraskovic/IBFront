import {CertificateRequestStatus} from "../enums/certificate-request-status.enum";

export interface CertificateRequest {
  id: string;
  issuerSN: string;
  subjectUsername: string;
  keyUsageFlags: string;
  validTo: Date;
  status: CertificateRequestStatus;
  reason?: string;
}
