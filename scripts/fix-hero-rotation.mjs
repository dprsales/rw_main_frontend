import sharp from 'sharp'

const src = 'src/assets/site/rw-portfolio-hero.webp'
const out = 'src/assets/site/rw-portfolio-hero.tmp.webp'
const info = await sharp(src).rotate(-90).webp({ quality: 82, effort: 5 }).toFile(out)
const fs = await import('fs')
fs.renameSync(out, src)
console.log(JSON.stringify({ width: info.width, height: info.height }))
