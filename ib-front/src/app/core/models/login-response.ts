export interface LoginResponse {
  message: string,
  passwordExpired: boolean,
  temporaryToken: string
}
