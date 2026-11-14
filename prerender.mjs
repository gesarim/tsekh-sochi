import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { paths, render, site } from './.ssr/entry-server.js'

const source = await readFile('dist/index.html', 'utf8')
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c')

for (const path of [...paths, '/404']) {
  const { html, meta } = render(path)
  const schemas = [{ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'ЦЕХЪ', url: site.url, description: site.description, address: { '@type':'PostalAddress', addressLocality:site.contacts.city } }]
  if (meta.breadcrumbs.length) schemas.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: meta.breadcrumbs.map(({ name, pathname }, index) => ({ '@type': 'ListItem', position: index+1, name, item: site.url+pathname })) })
  const seo = `
  <title>${escape(meta.title)}</title>
  <meta name="description" content="${escape(meta.description)}">
  <link rel="canonical" href="${escape(meta.canonical)}">
  <meta property="og:type" content="website"><meta property="og:locale" content="ru_RU">
  <meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}">
  <meta property="og:image" content="${escape(meta.image)}"><meta property="og:url" content="${escape(meta.canonical)}">
  ${path === '/404' || path === '/privacy' || path.startsWith('/works/') ? '<meta name="robots" content="noindex">' : ''}
  <script type="application/ld+json">${json(schemas)}</script>`
  const file = path === '/' ? 'dist/index.html' : path === '/404' ? 'dist/404.html' : 'dist'+path+'/index.html'
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, source.replace('<!--seo-->', () => seo).replace('<!--app-->', () => html))
}
const indexable = paths.filter(path => path !== '/privacy' && !path.startsWith('/works/'))
await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+indexable.map(path => '<url><loc>'+site.url+path+'</loc></url>').join('')+'</urlset>\n')
await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\nSitemap: '+site.url+'/sitemap.xml\n')
console.log('Prerendered '+paths.length+' routes.')
