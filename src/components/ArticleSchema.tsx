interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  author: string
  publishedDate: string
  modifiedDate?: string
  image?: string
}

export default function ArticleSchema({ 
  title, 
  description, 
  url, 
  author, 
  publishedDate, 
  modifiedDate, 
  image 
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Murat Sağ Portfolio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.muratsag.com/og-image.svg'
      }
    },
    datePublished: publishedDate,
    ...(modifiedDate && { dateModified: modifiedDate }),
    ...(image && { image: image }),
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
