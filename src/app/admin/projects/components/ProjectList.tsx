'use client'
// src/app/admin/projects/components/ProjectList.tsx

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  LinkIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { Project } from '@/lib/types'

interface ProjectListProps {
  projects: Project[]
  onDelete: (projectId: string) => void
  onToggleFeatured: (project: Project) => void
  deleteLoading: string | null
}

export default function ProjectList({ 
  projects, 
  onDelete, 
  onToggleFeatured, 
  deleteLoading 
}: ProjectListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Proje
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Teknolojiler
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Linkler
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {project.image_url ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={project.image_url}
                          alt={project.title}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {project.title}
                        </div>
                        {project.featured && (
                          <StarIconSolid className="ml-2 w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'published'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {project.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {project.technologies && project.technologies.length > 0 ? (
                      <>
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Belirtilmemiş</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Demo"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        title="GitHub"
                      >
                        <CodeBracketIcon className="w-4 h-4" />
                      </a>
                    )}
                    {!project.demo_url && !project.github_url && (
                      <span className="text-sm text-gray-400 italic">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(project.created_at), { 
                    addSuffix: true, 
                    locale: tr 
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="project-action-btn view"
                      title="Görüntüle"
                    >
                      <EyeIcon className="icon" />
                      Görüntüle
                    </Link>
                    
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="project-action-btn edit"
                      title="Düzenle"
                    >
                      <PencilIcon className="icon" />
                      Düzenle
                    </Link>
                    
                    <button
                      onClick={() => onToggleFeatured(project)}
                      className={`project-action-btn featured ${!project.featured ? 'inactive' : ''}`}
                      title={project.featured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                    >
                      {project.featured ? (
                        <StarIconSolid className="icon" />
                      ) : (
                        <StarIcon className="icon" />
                      )}
                      {project.featured ? 'Öne Çıkarıldı' : 'Öne Çıkar'}
                    </button>
                    
                    <button
                      onClick={() => onDelete(project.id)}
                      disabled={deleteLoading === project.id}
                      className="project-action-btn delete"
                      title="Sil"
                    >
                      {deleteLoading === project.id ? (
                        <div className="icon animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <TrashIcon className="icon" />
                      )}
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}