// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation - basic check for non-empty
export function isValidPhone(phone: string): boolean {
  return phone.trim().length > 0;
}

// Name validation - check for non-empty
export function isValidName(name: string): boolean {
  return name.trim().length > 0;
}

// Address validation - check for non-empty
export function isValidAddress(address: string): boolean {
  return address.trim().length > 0;
}

// City validation - check for non-empty
export function isValidCity(city: string): boolean {
  return city.trim().length > 0;
}

// Country validation - check for non-empty
export function isValidCountry(country: string): boolean {
  return country.trim().length > 0;
}
