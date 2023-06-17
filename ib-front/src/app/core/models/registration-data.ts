export interface RegistrationData {
  name: string;
  surname: string;
  email: string;
  telephoneNumber: string;
  password: string;
  recaptchaToken: string;
  confirmationMethod: 'Email' | 'SMS';
}
