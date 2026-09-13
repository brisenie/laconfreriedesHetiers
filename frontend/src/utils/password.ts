export const MASTER_PASSWORD = 'A.P. Fraser';

export function normalizePassword(value: string): string {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/é|è|ê/g, 'e')
    .replace(/à|â/g, 'a')
    .replace(/î|ï/g, 'i')
    .replace(/ô|ö/g, 'o')
    .replace(/ù|û/g, 'u')
    .replace(/ç/g, 'c');
}

export function isMasterPassword(value: string): boolean {
  return normalizePassword(value) === normalizePassword(MASTER_PASSWORD);
}

export function isAcceptedPassword(input: string, expectedPassword: string): boolean {
  const normalizedInput = normalizePassword(input);
  const normalizedExpected = normalizePassword(expectedPassword);

  return normalizedInput === normalizedExpected || isMasterPassword(input);
}
