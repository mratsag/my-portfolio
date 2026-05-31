import styles from '@/styles/home/Home.module.css'

/** codedgar-tarzı bölüm başlığı: `0X  // section.name` + büyük başlık. */
export function SectionHead({
  index,
  comment,
  title,
}: {
  index: string
  comment: string
  title: string
}) {
  return (
    <div className={styles.head}>
      <p className={styles.marker}>
        <span className={styles.markerIndex}>{index}</span>
        {'  '}
        <span className={styles.markerComment}>{comment}</span>
      </p>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  )
}
