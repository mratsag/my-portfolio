'use client'
// src/app/admin/dashboard/components/StatsCard.tsx

import { 
  CodeBracketIcon, 
  BriefcaseIcon, 
  AcademicCapIcon, 
  ChatBubbleLeftRightIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface StatsCardProps {
  name: string
  value: number
  change: string
  changeType: 'increase' | 'decrease'
  icon: 'projects' | 'experiences' | 'skills' | 'messages'
}

const iconMap = {
  projects: CodeBracketIcon,
  experiences: BriefcaseIcon,
  skills: AcademicCapIcon,
  messages: ChatBubbleLeftRightIcon,
}

const colorMap = {
  projects: 'bg-blue-500',
  experiences: 'bg-green-500',
  skills: 'bg-purple-500',
  messages: 'bg-yellow-500',
}

export default function StatsCard({ name, value, change, changeType, icon }: StatsCardProps) {
  const Icon = iconMap[icon]

  return (
    <div className={`stat-card ${icon}`}>
      <div className="stat-header">
        <span className="stat-title">{name}</span>
        <div className={`stat-icon ${icon}`}>
          <Icon className="icon-md" />
        </div>
      </div>
      <div className="stat-value">{value.toLocaleString()}</div>
      <div className={`stat-change ${changeType === 'increase' ? 'positive' : 'negative'}`}>
        {changeType === 'increase' ? (
          <ArrowUpIcon className="stat-arrow" />
        ) : (
          <ArrowDownIcon className="stat-arrow" />
        )}
        <span>{change}</span>
        <span>bu ay</span>
      </div>
    </div>
  )
}