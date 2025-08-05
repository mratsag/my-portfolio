'use client'
// src/app/admin/profile/page.tsx

import { useState, useEffect } from 'react'
import { 
  UserIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  KeyIcon
} from '@heroicons/react/24/outline'
import ProfileForm from './components/ProfileForm'
import { Profile } from '@/lib/types'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/profile')
      
      if (!response.ok) {
        throw new Error('Profil bilgileri yüklenemedi')
      }

      const data = await response.json()
      setProfile(data.profile)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleProfileUpdate = () => {
    // Profil güncellendiğinde sayfayı yenile
    fetchProfile()
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="profile-error-icon">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="profile-error-title">
          Hata Oluştu
        </h3>
        <p className="profile-error-message">
          {error}
        </p>
        <button
          onClick={fetchProfile}
          className="profile-error-button"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  const tabs = [
    {
      id: 'profile' as const,
      name: 'Profil Bilgileri',
      icon: UserIcon,
      description: 'Kişisel bilgilerinizi güncelleyin'
    },
    {
      id: 'security' as const,
      name: 'Güvenlik',
      icon: ShieldCheckIcon,
      description: 'Şifre ve güvenlik ayarları'
    }
  ]

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-left">
          <h1 className="profile-title">
            Profil Ayarları
          </h1>
          <p className="profile-subtitle">
            Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin
          </p>
        </div>
        
        {/* Profile Summary */}
        {profile && (
          <div className="profile-summary">
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  className="profile-avatar"
                  src={profile.avatar_url}
                  alt={profile.full_name}
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  <span>
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
              )}
            </div>
            <div className="profile-info">
              <p className="profile-name">
                {profile.full_name}
              </p>
              <p className="profile-email">
                {profile.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <nav className="profile-tab-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`profile-tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="tab-icon" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="profile-tab-content">
        {activeTab === 'profile' && profile && (
          <ProfileForm 
            initialData={profile} 
            onSuccess={handleProfileUpdate}
          />
        )}

        {activeTab === 'security' && (
          <div className="security-container">
            <div className="security-card">
              <div className="security-header">
                <h2 className="security-title">
                  Güvenlik Ayarları
                </h2>
                <p className="security-subtitle">
                  Hesabınızın güvenliğini yönetin
                </p>
              </div>

              <div className="security-content">
                {/* Password Section */}
                <div className="security-section">
                  <div className="security-section-header">
                    <KeyIcon className="security-icon" />
                    <div className="security-section-content">
                      <h3 className="security-section-title">
                        Şifre Değiştir
                      </h3>
                      <p className="security-section-description">
                        Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin
                      </p>
                      <button
                        onClick={() => alert('Şifre değiştirme özelliği yakında eklenecek')}
                        className="security-button"
                      >
                        Şifre Değiştir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Session Management */}
                <div className="security-section">
                  <div className="security-section-header">
                    <Cog6ToothIcon className="security-icon" />
                    <div className="security-section-content">
                      <h3 className="security-section-title">
                        Oturum Yönetimi
                      </h3>
                      <p className="security-section-description">
                        Aktif oturumlarınızı görüntüleyin ve yönetin
                      </p>
                      <button
                        onClick={() => alert('Oturum yönetimi özelliği yakında eklenecek')}
                        className="security-button"
                      >
                        Oturumları Görüntüle
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="security-info">
                  <div className="flex">
                    <svg className="security-info-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="security-info-title">
                        Hesap Bilgileri
                      </h3>
                      <div className="security-info-content">
                        <div className="security-info-item">
                          <strong>Email:</strong> {profile?.email}
                        </div>
                        <div className="security-info-item">
                          <strong>Hesap Oluşturma:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR') : '-'}
                        </div>
                        <div className="security-info-item">
                          <strong>Son Güncelleme:</strong> {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('tr-TR') : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}