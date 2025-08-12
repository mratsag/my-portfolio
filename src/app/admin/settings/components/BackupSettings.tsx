'use client'
// src/app/admin/settings/components/BackupSettings.tsx

import { useState } from 'react'
import { 
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface BackupSettingsProps {
  onSave: () => void
}

export default function BackupSettings({ onSave }: BackupSettingsProps) {
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState('daily')
  const [backupRetention, setBackupRetention] = useState(30)
  const [loading, setLoading] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackingUp, setIsBackingUp] = useState(false)

  const handleCreateBackup = async () => {
    setIsBackingUp(true)
    setBackupProgress(0)
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          onSave()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleRestoreBackup = async () => {
    setLoading(true)
    
    // Simulate restore
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    onSave()
  }

  const handleDeleteBackup = async () => {
    if (!confirm('Bu yedeği silmek istediğinizden emin misiniz?')) return
    
    setLoading(true)
    
    // Simulate delete
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setLoading(false)
    onSave()
  }

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2 className="settings-section-title">
          Yedekleme Ayarları
        </h2>
        <p className="settings-section-description">
          Verilerinizi yedekleyin ve geri yükleyin
        </p>
      </div>

      <div className="settings-form">
        {/* Auto Backup Settings */}
        <div className="settings-group">
          <h3 className="settings-group-title">
            Otomatik Yedekleme
          </h3>
          
          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-info">
                <h4 className="settings-option-title">
                  Otomatik Yedekleme
                </h4>
                <p className="settings-option-description">
                  Verilerinizi otomatik olarak yedekleyin
                </p>
              </div>
            </div>
            
            <div className="settings-option-control">
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="settings-toggle-input"
                />
                <span className="settings-toggle-slider">
                  {autoBackup ? (
                    <CheckIcon className="settings-toggle-icon" />
                  ) : (
                    <XMarkIcon className="settings-toggle-icon" />
                  )}
                </span>
              </label>
            </div>
          </div>

          {autoBackup && (
            <>
              <div className="settings-option">
                <div className="settings-option-content">
                  <div className="settings-option-info">
                    <h4 className="settings-option-title">
                      Yedekleme Sıklığı
                    </h4>
                    <p className="settings-option-description">
                      Yedekleme ne sıklıkla yapılsın?
                    </p>
                  </div>
                </div>
                
                <div className="settings-option-control">
                  <select
                    value={backupFrequency}
                    onChange={(e) => setBackupFrequency(e.target.value)}
                    className="settings-select"
                  >
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="monthly">Aylık</option>
                  </select>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-content">
                  <div className="settings-option-info">
                    <h4 className="settings-option-title">
                      Yedek Saklama Süresi
                    </h4>
                    <p className="settings-option-description">
                      Yedekler kaç gün saklansın?
                    </p>
                  </div>
                </div>
                
                <div className="settings-option-control">
                  <select
                    value={backupRetention}
                    onChange={(e) => setBackupRetention(Number(e.target.value))}
                    className="settings-select"
                  >
                    <option value={7}>7 gün</option>
                    <option value={30}>30 gün</option>
                    <option value={90}>90 gün</option>
                    <option value={365}>1 yıl</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Manual Backup Actions */}
        <div className="settings-group">
          <h3 className="settings-group-title">
            Manuel İşlemler
          </h3>
          
          <div className="settings-backup-actions">
            <div className="settings-backup-action">
              <div className="settings-backup-action-content">
                <CloudArrowUpIcon className="settings-backup-action-icon" />
                <div>
                  <h4 className="settings-backup-action-title">
                    Yedek Oluştur
                  </h4>
                  <p className="settings-backup-action-description">
                    Şimdi manuel yedek oluşturun
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleCreateBackup}
                disabled={isBackingUp}
                className="settings-backup-button"
              >
                {isBackingUp ? (
                  <div className="settings-backup-progress">
                    <div 
                      className="settings-backup-progress-bar"
                      style={{ width: `${backupProgress}%` }}
                    ></div>
                    <span className="settings-backup-progress-text">
                      %{backupProgress}
                    </span>
                  </div>
                ) : (
                  <>
                    <CloudArrowUpIcon className="settings-backup-button-icon" />
                    Yedek Oluştur
                  </>
                )}
              </button>
            </div>

            <div className="settings-backup-action">
              <div className="settings-backup-action-content">
                <CloudArrowDownIcon className="settings-backup-action-icon" />
                <div>
                  <h4 className="settings-backup-action-title">
                    Yedek Geri Yükle
                  </h4>
                  <p className="settings-backup-action-description">
                    Önceki bir yedeği geri yükleyin
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleRestoreBackup}
                disabled={loading}
                className="settings-backup-button settings-backup-button-secondary"
              >
                {loading ? (
                  <div className="settings-loading-spinner"></div>
                ) : (
                  <>
                    <CloudArrowDownIcon className="settings-backup-button-icon" />
                    Geri Yükle
                  </>
                )}
              </button>
            </div>

            <div className="settings-backup-action">
              <div className="settings-backup-action-content">
                <DocumentArrowDownIcon className="settings-backup-action-icon" />
                <div>
                  <h4 className="settings-backup-action-title">
                    Yedek İndir
                  </h4>
                  <p className="settings-backup-action-description">
                    Yedeği bilgisayarınıza indirin
                  </p>
                </div>
              </div>
              
              <button className="settings-backup-button settings-backup-button-secondary">
                <DocumentArrowDownIcon className="settings-backup-button-icon" />
                İndir
              </button>
            </div>

            <div className="settings-backup-action">
              <div className="settings-backup-action-content">
                <TrashIcon className="settings-backup-action-icon settings-backup-action-icon-danger" />
                <div>
                  <h4 className="settings-backup-action-title">
                    Yedek Sil
                  </h4>
                  <p className="settings-backup-action-description">
                    Eski yedekleri silin
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleDeleteBackup}
                disabled={loading}
                className="settings-backup-button settings-backup-button-danger"
              >
                {loading ? (
                  <div className="settings-loading-spinner"></div>
                ) : (
                  <>
                    <TrashIcon className="settings-backup-button-icon" />
                    Sil
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Backup Info */}
        <div className="settings-backup-info">
          <div className="settings-backup-info-content">
            <ExclamationTriangleIcon className="settings-backup-info-icon" />
            <div>
              <h4 className="settings-backup-info-title">
                Yedekleme İpuçları
              </h4>
              <ul className="settings-backup-info-list">
                <li>Düzenli olarak yedek alın</li>
                <li>Yedekleri güvenli bir yerde saklayın</li>
                <li>Önemli değişikliklerden önce yedek alın</li>
                <li>Yedekleri test edin ve doğrulayın</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-actions">
          <button
            onClick={onSave}
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
      </div>
    </div>
  )
}
