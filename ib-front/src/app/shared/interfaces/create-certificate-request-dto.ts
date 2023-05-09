import {CertificateType} from "../enums/certificate-type.enum";

export interface CreateCertificateRequestDTO {
  issuerSN: string | undefined;
  certificateType: CertificateType;
  validTo: Date;
}
