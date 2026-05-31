export type ClassValue = string | number | false | null | undefined

/**
 * Hafif className birleştirici (clsx/tailwind-merge yerine, sıfır bağımlılık).
 * Falsy değerleri atar, kalanları boşlukla birleştirir.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ')
}
