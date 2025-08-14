interface PersonSchemaProps {
  name: string
  jobTitle: string
  description: string
  url: string
  image?: string
  email?: string
  github?: string
  linkedin?: string
  twitter?: string
}

export default function PersonSchema({ 
  name, 
  jobTitle, 
  description, 
  url, 
  image, 
  email, 
  github, 
  linkedin, 
  twitter 
}: PersonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: jobTitle,
    description: description,
    url: url,
    ...(image && { image: image }),
    ...(email && { email: email }),
    sameAs: [
      ...(github ? [github] : []),
      ...(linkedin ? [linkedin] : []),
      ...(twitter ? [twitter] : [])
    ].filter(Boolean),
    knowsAbout: [
      'Software Development',
      'Web Development',
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Database Design',
      'API Development'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
