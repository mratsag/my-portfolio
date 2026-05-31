import { Reveal } from '@/components/ui'

type Stat = { value: string; label: string }

/** Hairline grid içinde mono istatistik şeridi (teknik/editorial). */
export function HomeStats({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-[75rem] px-6">
        <Reveal>
          <div className="grid grid-cols-2 border-l border-line sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-b border-r border-line px-6 py-8">
                <div className="font-mono text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
