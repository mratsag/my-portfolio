'use client'

import { useRouter } from 'next/navigation'
import ProjectForm from '../components/ProjectForm'

export default function NewProjectPage() {
  const router = useRouter()

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/admin/projects')
    }, 2000)
  }
  return (
    <div className="new-project-page">
      <div className="new-project-header">
        <h1 className="new-project-title">
          Yeni Proje
        </h1>
        <p className="new-project-subtitle">
          Portfolio&apos;nüze yeni bir proje ekleyin
        </p>
      </div>

      <div className="new-project-content">
        <ProjectForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}