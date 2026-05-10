import { describe, it, expect } from 'vitest'
import {
  LEVEL_LABELS,
  LEVEL_ORDER,
  formatExperienceYears,
  buildCategoryDescription,
} from './format'
import type { Experience, Skill } from './types'

const baseExperience: Experience = {
  id: '1',
  title: 'Software Developer',
  company: 'Acme',
  description: '',
  start_date: '2024-03-01',
  current: false,
  order_index: 0,
  created_at: '',
  updated_at: '',
  user_id: 'u1',
}

const makeSkill = (name: string, level: Skill['level'], order = 0): Skill => ({
  id: name,
  name,
  category: 'Backend',
  level,
  order_index: order,
  created_at: '',
  updated_at: '',
  user_id: 'u1',
})

describe('formatExperienceYears', () => {
  it('current bir deneyim için "Devam ediyor" döner', () => {
    const exp: Experience = { ...baseExperience, current: true, end_date: undefined }
    expect(formatExperienceYears(exp)).toBe('(2024 - Devam ediyor)')
  })

  it('aynı yıl başlayıp biten deneyim için tek yıl döner', () => {
    const exp: Experience = { ...baseExperience, end_date: '2024-09-01' }
    expect(formatExperienceYears(exp)).toBe('(2024)')
  })

  it('farklı yıllarda başlayıp biten deneyim için aralık döner', () => {
    const exp: Experience = { ...baseExperience, end_date: '2025-06-01' }
    expect(formatExperienceYears(exp)).toBe('(2024-2025)')
  })

  it('start_date yoksa boş string döner', () => {
    const exp: Experience = { ...baseExperience, start_date: '' }
    expect(formatExperienceYears(exp)).toBe('')
  })
})

describe('buildCategoryDescription', () => {
  it('skill listesinden seviye sırasına göre öne çıkanları derler', () => {
    const skills = [
      makeSkill('Java', 'expert'),
      makeSkill('Python', 'advanced'),
      makeSkill('Go', 'beginner'),
      makeSkill('Rust', 'intermediate'),
      makeSkill('C', 'expert'),
    ]
    const result = buildCategoryDescription('Backend', skills)
    expect(result).toContain('Backend alanında 5 farklı teknolojide deneyim')
    // Expert/advanced ilk sırada olmalı, beginner sonda
    expect(result).toContain('Java')
    expect(result).toContain('C')
    // İlk 4'e giriyor mu?
    expect(result).toMatch(/Öne çıkanlar:.*Java.*Python|Java.*C/)
  })

  it('boş skill listesi için sadece sayım metnini döner', () => {
    const result = buildCategoryDescription('Empty', [])
    expect(result).toContain('Empty alanında 0 farklı teknolojide deneyim')
    expect(result).not.toContain('Öne çıkanlar')
  })
})

describe('LEVEL_LABELS / LEVEL_ORDER tutarlılığı', () => {
  it('her seviye Türkçe etikete sahip', () => {
    expect(LEVEL_LABELS.beginner).toBe('Başlangıç')
    expect(LEVEL_LABELS.intermediate).toBe('Orta')
    expect(LEVEL_LABELS.advanced).toBe('İleri')
    expect(LEVEL_LABELS.expert).toBe('Uzman')
  })

  it('LEVEL_ORDER doğru sıralama veriyor (expert en başta)', () => {
    expect(LEVEL_ORDER.expert).toBeLessThan(LEVEL_ORDER.advanced)
    expect(LEVEL_ORDER.advanced).toBeLessThan(LEVEL_ORDER.intermediate)
    expect(LEVEL_ORDER.intermediate).toBeLessThan(LEVEL_ORDER.beginner)
  })
})
