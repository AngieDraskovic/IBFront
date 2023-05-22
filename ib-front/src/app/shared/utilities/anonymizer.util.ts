export function anonymizeEmail(email: string): string {
  let [user, domain] = email.split('@');
  if (user.length > 2) {
    user = user.substring(0, 2) + user.substring(2).replace(/./g, 'x');
  }
  return `${user}@${domain}`;
}

export function anonymizePhoneNumber(phone: string): string {
  return phone.replace(/\d(?=\d{4})/g, 'x');
}
