import { renderToString } from 'react-dom/server'
import { App, metadata, paths } from './App'
import { site } from './content'

export function render(path: string) {
  return { html: renderToString(<App path={path} />), meta: metadata(path) }
}

export { paths, site }
