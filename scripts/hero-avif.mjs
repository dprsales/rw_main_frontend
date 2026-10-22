import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const dir = path.resolve('src/assets/site')
const jobs = [
  ['hero-slider-coaching.jpg', 'hero-slider-coaching'],
  ['hero-slider-consulting.jpg', 'hero-slider-consulting'],
  ['hero-slider-realty.jpg', 'hero-slider-realty'],
]

for (const [src, base] of jobs) {
  const input = path.join(dir, src)
  const raw = sharp(input).rotate()
  const pipeline = raw.resize({
    width: 2560,
    height: 1440,
    fit: 'cover',
    position: 'centre',
    kernel: sharp.kernel.lanczos3,
  }).sharpen({ sigma: 0.7, m1: 0.6, m2: 2.2 })

  const jpg = path.join(dir, `${base}.jpg`)
  const avif = path.join(dir, `${base}.avif`)
  const webp = path.join(dir, `${base}.webp`)
  const tmp = path.join(dir, `${base}.tmp.jpg`)

  await pipeline.clone().jpeg({ quality: 90, mozjpeg: true }).toFile(tmp)
  fs.renameSync(tmp, jpg)
  await pipeline.clone().avif({ quality: 82, effort: 6 }).toFile(avif)
  await pipeline.clone().webp({ quality: 86, effort: 5 }).toFile(webp)

  const meta = await sharp(avif).metadata()
  console.log(
    'wrote',
    base,
    `${meta.width}x${meta.height}`,
    `avif ${Math.round(fs.statSync(avif).size / 1024)}KB`,
    `webp ${Math.round(fs.statSync(webp).size / 1024)}KB`,
    `jpg ${Math.round(fs.statSync(jpg).size / 1024)}KB`,
  )
}
