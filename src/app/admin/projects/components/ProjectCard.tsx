'use client'
// src/app/admin/projects/components/ProjectCard.tsx

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

interface ProjectCardProps {
  project: Project
  onDelete: () => void
  onToggleFeatured: () => void
  isDeleting: boolean
}

export default function ProjectCard({ 
  project, 
  onDelete, 
  onToggleFeatured, 
  isDeleting 
}: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            project.status === 'published'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {project.status === 'published' ? 'Yayında' : 'Taslak'}
          </span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-2 right-2">
            <StarIconSolid className="w-5 h-5 text-yellow-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
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
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 mb-4">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <LinkIcon className="w-3 h-3 mr-1" />
              Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <CodeBracketIcon className="w-3 h-3 mr-1" />
              GitHub
            </a>
          )}
        </div>

        {/* Meta */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {formatDistanceToNow(new Date(project.created_at), { 
            addSuffix: true, 
            locale: tr 
          })}
        </div>

        {/* Actions */}
        <div className="project-actions-container">
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
            onClick={onToggleFeatured}
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
            onClick={onDelete}
            disabled={isDeleting}
            className="project-action-btn delete"
            title="Sil"
          >
            {isDeleting ? (
              <div className="icon animate-spin border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <TrashIcon className="icon" />
            )}
            Sil
          </button>
        </div>
      </div>
    </div>
  )
}