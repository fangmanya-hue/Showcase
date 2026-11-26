const googleClientIdPattern =
  /^\d{6,}-[a-z0-9_-]{10,}\.apps\.googleusercontent\.com$/i;

export function isValidGoogleClientId(value: string | undefined) {
  return Boolean(value?.trim() && googleClientIdPattern.test(value.trim()));
}
