import {CertificateRequestStatus} from "../enums/certificate-request-status.enum";

export interface OutgoingCertificateRequest {
  id: string;
  issuerSN: string;
  issuerUsername: string;
  subjectUsername: string;
  keyUsageFlags: string;
  validTo: Date;
  status: CertificateRequestStatus;
  reason?: string;
}
