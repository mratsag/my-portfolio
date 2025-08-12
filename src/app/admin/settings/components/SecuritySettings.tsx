'use client'
// src/app/admin/settings/components/SecuritySettings.tsx

import { useState } from 'react'
import { 
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface SecuritySettingsProps {
  onSave: () => void
}

export default function SecuritySettings({ onSave }: SecuritySettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Check if user wants to change password
    if (!newPassword && !currentPassword && !confirmPassword) {
      return true // No password change requested
    }

    if (!currentPassword) {
      newErrors.currentPassword = 'Mevcut şifre gereklidir'
    }

    if (!newPassword) {
      newErrors.newPassword = 'Yeni şifre gereklidir'
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Şifre en az 8 karakter olmalıdır'
    }

    if (newPassword && !confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir'
    } else if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Check if password change is requested
    if (!currentPassword && !newPassword && !confirmPassword) {
      // No password change requested, just save other settings
      onSave()
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Şifre güncellenirken hata oluştu')
      }

      // Success
      onSave()
      
      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setErrors({})
      
    } catch (error) {
      console.error('Password change error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Şifre güncellenirken hata oluştu'
      
      // Show error to user
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2 className="settings-section-title">
          Güvenlik Ayarları
        </h2>
        <p className="settings-section-description">
          Hesap güvenliğinizi yönetin ve koruyun
        </p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Password Change */}
        <div className="settings-group">
          <h3 className="settings-group-title">
            Şifre Değiştirme
          </h3>
          
          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  Mevcut Şifre
                </h4>
                <p className="settings-option-description">
                  Şifrenizi değiştirmek için mevcut şifrenizi girin
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <div className="settings-password-input">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`settings-input ${errors.currentPassword ? 'settings-input-error' : ''}`}
                  placeholder="Mevcut şifrenizi girin"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="settings-password-toggle"
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="settings-password-icon" />
                  ) : (
                    <EyeIcon className="settings-password-icon" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="settings-error-text">{errors.currentPassword}</p>
              )}
            </div>
          </div>

          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  Yeni Şifre
                </h4>
                <p className="settings-option-description">
                  En az 8 karakter uzunluğunda güçlü bir şifre seçin
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <div className="settings-password-input">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`settings-input ${errors.newPassword ? 'settings-input-error' : ''}`}
                  placeholder="Yeni şifrenizi girin"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="settings-password-toggle"
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="settings-password-icon" />
                  ) : (
                    <EyeIcon className="settings-password-icon" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="settings-error-text">{errors.newPassword}</p>
              )}
            </div>
          </div>

          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  Şifre Tekrarı
                </h4>
                <p className="settings-option-description">
                  Yeni şifrenizi tekrar girin
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <div className="settings-password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`settings-input ${errors.confirmPassword ? 'settings-input-error' : ''}`}
                  placeholder="Şifrenizi tekrar girin"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="settings-password-toggle"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="settings-password-icon" />
                  ) : (
                    <EyeIcon className="settings-password-icon" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="settings-error-text">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Two Factor Authentication */}
        <div className="settings-group">
          <h3 className="settings-group-title">
            İki Faktörlü Doğrulama
          </h3>
          
          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  2FA Etkinleştir
                </h4>
                <p className="settings-option-description">
                  Hesabınızı ekstra güvenlik katmanı ile koruyun
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="settings-toggle-input"
                />
                <span className="settings-toggle-slider">
                  {twoFactorEnabled ? (
                    <CheckIcon className="settings-toggle-icon" />
                  ) : (
                    <XMarkIcon className="settings-toggle-icon" />
                  )}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="settings-group">
          <h3 className="settings-group-title">
            Oturum Ayarları
          </h3>
          
          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  Oturum Zaman Aşımı
                </h4>
                <p className="settings-option-description">
                  Otomatik çıkış yapılacak süreyi belirleyin
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                className="settings-select"
              >
                <option value={15}>15 dakika</option>
                <option value={30}>30 dakika</option>
                <option value={60}>1 saat</option>
                <option value={120}>2 saat</option>
                <option value={0}>Asla</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="settings-security-info">
          <div className="settings-security-info-content">
            <ExclamationTriangleIcon className="settings-security-info-icon" />
            <div>
              <h4 className="settings-security-info-title">
                Güvenlik İpuçları
              </h4>
              <ul className="settings-security-info-list">
                <li>Güçlü ve benzersiz şifreler kullanın</li>
                <li>İki faktörlü doğrulamayı etkinleştirin</li>
                <li>Düzenli olarak şifrenizi değiştirin</li>
                <li>Güvenli olmayan ağlarda giriş yapmayın</li>
              </ul>
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
