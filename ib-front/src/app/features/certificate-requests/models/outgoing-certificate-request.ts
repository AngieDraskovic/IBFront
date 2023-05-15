import {CertificateRequestStatus} from "../enums/certificate-request-status.enum";
import {CertificateType} from "../../certificates/enums/certificate-type.enum";

export interface OutgoingCertificateRequest {
  id: string;
  issuerSN: string;
  issuerUsername: string;
  subjectUsername: string;
  keyUsageFlags: string;
  validTo: Date;
  status: CertificateRequestStatus;
  certificateType: CertificateType;
  reason?: string;
}
