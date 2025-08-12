'use client'
// src/app/admin/settings/components/GeneralSettings.tsx

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { 
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  BellIcon,
  BellSlashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface GeneralSettingsProps {
  onSave: () => void
}

export default function GeneralSettings({ onSave }: GeneralSettingsProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setLoading(false)
    onSave()
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    // Tema değişikliğini kaydet
    onSave()
  }

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2 className="settings-section-title">
          Genel Ayarlar
        </h2>
        <p className="settings-section-description">
          Temel görünüm ve davranış ayarlarınızı yönetin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Theme Settings */}
        <div className="settings-group">
          <h3 className="settings-group-title">
            Görünüm
          </h3>
          
          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  Tema
                </h4>
                <p className="settings-option-description">
                  Arayüz temasını seçin
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <div className="theme-buttons">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`theme-button ${theme === 'light' ? 'theme-button-active' : 'theme-button-inactive'}`}
                >
                  <SunIcon className="theme-button-icon" />
                  <span>Açık</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`theme-button ${theme === 'dark' ? 'theme-button-active' : 'theme-button-inactive'}`}
                >
                  <MoonIcon className="theme-button-icon" />
                  <span>Koyu</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleThemeChange('system')}
                  className={`theme-button ${theme === 'system' ? 'theme-button-active' : 'theme-button-inactive'}`}
                >
                  <ComputerDesktopIcon className="theme-button-icon" />
                  <span>Sistem</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-group">
          <h3 className="settings-group-title">
            Bildirimler
          </h3>
          
          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  Bildirimler
                </h4>
                <p className="settings-option-description">
                  Sistem bildirimlerini etkinleştirin
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="settings-toggle-input"
                />
                <span className="settings-toggle-slider">
                  {notifications ? (
                    <BellIcon className="settings-toggle-icon" />
                  ) : (
                    <BellSlashIcon className="settings-toggle-icon" />
                  )}
                </span>
              </label>
            </div>
          </div>

          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  Email Bildirimleri
                </h4>
                <p className="settings-option-description">
                  Email ile bildirim alın
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="settings-toggle-input"
                />
                <span className="settings-toggle-slider">
                  {emailNotifications ? (
                    <CheckIcon className="settings-toggle-icon" />
                  ) : (
                    <XMarkIcon className="settings-toggle-icon" />
                  )}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Auto Save Settings */}
        <div className="settings-group">
          <h3 className="settings-group-title">
            Veri Yönetimi
          </h3>
          
          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  Otomatik Kaydetme
                </h4>
                <p className="settings-option-description">
                  Değişiklikleri otomatik olarak kaydet
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="settings-toggle-input"
                />
                <span className="settings-toggle-slider">
                  {autoSave ? (
                    <CheckIcon className="settings-toggle-icon" />
                  ) : (
                    <XMarkIcon className="settings-toggle-icon" />
                  )}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-actions">
          <button
            type="submit"
            disabled={loading}
            className="settings-save-button"
          >
            {loading ? (
              <div className="settings-loading-spinner"></div>
            ) : (
              <CheckIcon className="settings-save-icon" />
            )}
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
