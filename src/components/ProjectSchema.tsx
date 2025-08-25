interface ProjectSchemaProps {
  title: string
  description: string
  url: string
  technologies: string[]
  image?: string
  githubUrl?: string
  demoUrl?: string
  createdDate: string
  updatedDate?: string
}

export default function ProjectSchema({ 
  title, 
  description, 
  url, 
  technologies,
  image,
  githubUrl,
  demoUrl,
  createdDate,
  updatedDate
}: ProjectSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    description: description,
    url: url,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web Browser',
    author: {
      '@type': 'Person',
      name: 'Murat Sağ'
    },
    creator: {
      '@type': 'Person',
      name: 'Murat Sağ'
    },
    dateCreated: createdDate,
    ...(updatedDate && { dateModified: updatedDate }),
    ...(image && { image: image }),
    ...(githubUrl && { 
      codeRepository: githubUrl,
      downloadUrl: githubUrl 
    }),
    ...(demoUrl && { 
      softwareVersion: '1.0',
      offers: {
        '@type': 'Offer',
        url: demoUrl,
        availability: 'https://schema.org/InStock'
      }
    }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
