// Global (module olmayan) CSS yan-etki import'ları için tip bildirimi.
// `moduleResolution: "bundler"` + TS2882 ("Cannot find module ... side-effect
// import of './globals.css'") düzeltmesi.
//
// Not: `*.module.css` daha spesifik olduğu için Next'in CSS Modules tipleri
// (styles objesi) geçerli kalmaya devam eder; bu yalnızca `import './x.css'`
// biçimindeki global import'ları kapsar.
declare module '*.css'
