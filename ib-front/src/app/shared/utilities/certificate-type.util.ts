import {CertificateType} from "../../features/certificates/enums/certificate-type.enum";

export function getCertificateTypeLabel(certificateType: CertificateType | undefined): string {
  switch (certificateType) {
    case CertificateType.ROOT:
      return 'Root';
    case CertificateType.INTERMEDIATE:
      return 'Intermediate';
    case CertificateType.END:
      return 'End';
    default:
      return 'Unknown type';
  }
}
