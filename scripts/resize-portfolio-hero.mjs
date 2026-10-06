import fs from 'fs'
import sharp from 'sharp'

const src = 'src/assets/site/rw-portfolio-hero.webp'
const out = 'src/assets/site/rw-portfolio-hero.tmp.webp'
const before = fs.statSync(src).size
const info = await sharp(src)
  .resize({ width: 1400, withoutEnlargement: true, kernel: 'lanczos3' })
  .webp({ quality: 82, effort: 5 })
  .toFile(out)
fs.renameSync(out, src)
const after = fs.statSync(src).size
console.log(JSON.stringify({
  width: info.width,
  height: info.height,
  beforeMB: +(before / 1048576).toFixed(2),
  afterMB: +(after / 1048576).toFixed(2),
}))
