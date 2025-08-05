'use client'
// src/app/admin/settings/page.tsx

import { useState } from 'react'
import { 
  Cog6ToothIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import GeneralSettings from './components/GeneralSettings'
import SecuritySettings from './components/SecuritySettings'
import BackupSettings from './components/BackupSettings'

type SettingsTab = 'general' | 'security' | 'backup'

const tabs = [
  {
    id: 'general' as SettingsTab,
    name: 'Genel',
    icon: Cog6ToothIcon,
    description: 'Temel ayarlar ve görünüm'
  },
  {
    id: 'security' as SettingsTab,
    name: 'Güvenlik',
    icon: ShieldCheckIcon,
    description: 'Şifre ve güvenlik ayarları'
  },
  {
    id: 'backup' as SettingsTab,
    name: 'Yedekleme',
    icon: CloudArrowUpIcon,
    description: 'Veri yedekleme ve geri yükleme'
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings onSave={handleSave} />
      case 'security':
        return <SecuritySettings onSave={handleSave} />
      case 'backup':
        return <BackupSettings onSave={handleSave} />
      default:
        return <GeneralSettings onSave={handleSave} />
    }
  }

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div>
          <h1 className="settings-title">
            Ayarlar
          </h1>
          <p className="settings-subtitle">
            Sistem ayarlarınızı yönetin ve özelleştirin
          </p>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="settings-success-message">
          <div className="settings-success-content">
            <CheckIcon className="settings-success-icon" />
            <span>Ayarlar başarıyla kaydedildi!</span>
          </div>
          <button
            onClick={() => setSaved(false)}
            className="settings-success-close"
          >
            <XMarkIcon className="settings-close-icon" />
          </button>
        </div>
      )}

      <div className="settings-container">
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-tab-button ${
                  activeTab === tab.id ? 'settings-tab-active' : 'settings-tab-inactive'
                }`}
              >
                <Icon className="settings-tab-icon" />
                <div className="settings-tab-content">
                  <span className="settings-tab-name">{tab.name}</span>
                  <span className="settings-tab-description">{tab.description}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="settings-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
