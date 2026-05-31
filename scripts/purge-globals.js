/* globals.css içindeki ÖLÜ (hiçbir yerde kullanılmayan) sınıf kurallarını siler.
 *
 * Güvenlik ilkesi: Bir kural yalnızca, selektörün SUBJECT'i (en sağdaki bileşik
 * selektör) tamamen "ölü" sınıflardan oluşuyorsa silinir. Element/id/pseudo
 * içeren veya kullanılan bir sınıf barındıran subject'ler korunur. Böylece
 * kullanılan hiçbir sınıfın stili kaybolmaz.
 *
 * Kullanım:
 *   node scripts/purge-globals.js          (kuru çalıştırma — rapor)
 *   node scripts/purge-globals.js --write  (globals.css'i yeniden yaz)
 */
const fs = require('fs')
const path = require('path')
const postcss = require('postcss')

const CSS_PATH = path.join('src', 'app', 'globals.css')
const WRITE = process.argv.includes('--write')

// 1) Kaynak kodda geçen tüm kelimeleri topla (kullanım tespiti için)
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!/node_modules|\.next/.test(p)) walk(p, acc)
    } else if (/\.(tsx|ts|jsx|js|mdx|md)$/.test(e.name)) {
      acc.push(p)
    }
  }
  return acc
}
const srcBlob = walk('src')
  .map((f) => fs.readFileSync(f, 'utf8'))
  .join('\n')

const usedCache = new Map()
function isUsed(cls) {
  if (usedCache.has(cls)) return usedCache.get(cls)
  // kelime sınırıyla ara: önünde/arkasında sınıf-karakteri olmasın
  const re = new RegExp('(?<![\\w-])' + cls.replace(/[-]/g, '\\-') + '(?![\\w-])')
  const r = re.test(srcBlob)
  usedCache.set(cls, r)
  return r
}

// 2) Bir selektör parçasının SUBJECT'ini al (son kombinatörden sonrası)
function subjectOf(sel) {
  // descendant ( ), >, +, ~ kombinatörlerine göre böl, son parçayı al
  const parts = sel.trim().split(/\s*[>+~]\s*|\s+/).filter(Boolean)
  return parts[parts.length - 1] || ''
}
// Subject yalnızca sınıflardan mı oluşuyor ve hepsi ölü mü?
function subjectIsAllDead(sel) {
  const subj = subjectOf(sel)
  if (!subj) return false
  // sınıf dışında bir şey içeriyorsa (element, #id, [attr], ::pseudo) → koru
  // izin verilenler: .class ve :pseudo-class (örn. :hover) — pseudo'lar subject'i değiştirmez
  const stripped = subj.replace(/:[a-zA-Z-]+(\([^)]*\))?/g, '') // pseudo'ları at
  if (stripped === '') return false
  if (!/^(\.[a-zA-Z0-9_-]+)+$/.test(stripped)) return false // sadece .class zinciri değilse koru
  const classes = stripped.split('.').filter(Boolean)
  return classes.length > 0 && classes.every((c) => !isUsed(c))
}

const css = fs.readFileSync(CSS_PATH, 'utf8')
const root = postcss.parse(css)

let removedRules = 0
let trimmedSelectors = 0
const removedSamples = []

root.walkRules((rule) => {
  // @theme / @keyframes içindekilere dokunma (parent at-rule kontrolü)
  const parent = rule.parent
  if (parent && parent.type === 'atrule' && /theme|keyframes/.test(parent.name)) return

  const selectors = rule.selectors // virgülle ayrılmışları diziye böler
  const survivors = selectors.filter((s) => !subjectIsAllDead(s))

  if (survivors.length === 0) {
    if (removedSamples.length < 60) removedSamples.push(rule.selector.replace(/\s+/g, ' ').slice(0, 70))
    removedRules++
    rule.remove()
  } else if (survivors.length !== selectors.length) {
    trimmedSelectors++
    rule.selectors = survivors
  }
})

// Boşalan @media / @supports bloklarını temizle
let removedAtRules = 0
root.walkAtRules((at) => {
  if (/media|supports/.test(at.name) && at.nodes && at.nodes.length === 0) {
    removedAtRules++
    at.remove()
  }
})

const out = root.toString()
const before = css.split('\n').length
const after = out.split('\n').length

console.log('=== globals.css purge ===')
console.log('Silinen kural (tamamen ölü):', removedRules)
console.log('Kırpılan grup selektör:', trimmedSelectors)
console.log('Silinen boş @media/@supports:', removedAtRules)
console.log('Satır:', before, '→', after, `(${before - after} satır azaldı)`)
console.log('\n--- Silinen kurallardan örnekler ---')
console.log(removedSamples.join('\n'))

if (WRITE) {
  fs.writeFileSync(CSS_PATH, out)
  console.log('\n✅ globals.css yeniden yazıldı.')
} else {
  console.log('\n(Kuru çalıştırma — yazmak için: node scripts/purge-globals.js --write)')
}
