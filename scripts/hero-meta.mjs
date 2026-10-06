import sharp from 'sharp'
const meta = await sharp('src/assets/site/rw-portfolio-hero.webp').metadata()
console.log(JSON.stringify({
  width: meta.width,
  height: meta.height,
  orientation: meta.orientation,
  format: meta.format,
  size: meta.size,
}, null, 2))
