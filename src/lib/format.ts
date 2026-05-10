// Formatting & display helpers — pure functions, test edilebilir.

import type { Skill, Experience } from './types'

export const LEVEL_LABELS: Record<Skill['level'], string> = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
  expert: 'Uzman',
}

export const LEVEL_ORDER: Record<Skill['level'], number> = {
  expert: 0,
  advanced: 1,
  intermediate: 2,
  beginner: 3,
}

/**
 * Bir deneyimin yıllarını "Title - Company (year_range)" formatında döner.
 * - Devam ediyorsa: "(2025 - Devam ediyor)"
 * - Bitmişse ve farklı yıllarda: "(2024-2025)"
 * - Aynı yıl başlayıp bittiyse: "(2025)"
 * - Tarih yoksa: ""
 */
export function formatExperienceYears(exp: Experience): string {
  const startYear = exp.start_date ? new Date(exp.start_date).getFullYear() : null
  const endYear = exp.end_date ? new Date(exp.end_date).getFullYear() : null

  if (!startYear) return ''
  if (exp.current) return `(${startYear} - Devam ediyor)`
  if (endYear && endYear !== startYear) return `(${startYear}-${endYear})`
  return `(${startYear})`
}

/**
 * Bir kategori için skill listesinden kısa bir açıklama üretir.
 * En yüksek seviyeli ilk 4 yetenekten doğal Türkçe cümle oluşturur.
 */
export function buildCategoryDescription(category: string, skills: Skill[]): string {
  const topNames = skills
    .slice()
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level])
    .slice(0, 4)
    .map(s => s.name)
    .join(', ')

  return `${category} alanında ${skills.length} farklı teknolojide deneyim. ${topNames ? `Öne çıkanlar: ${topNames}.` : ''}`
}
