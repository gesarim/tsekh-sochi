import { createRoot, hydrateRoot } from 'react-dom/client'
import { App, paths } from './App'
import './styles.css'
import './editorial.css'

const root = document.getElementById('root')!
const base = import.meta.env.BASE_URL
const pathname = window.location.pathname
const relative = pathname.startsWith(base) ? '/' + pathname.slice(base.length) : pathname
const path = relative.replace(/\/+$/, '') || '/'
const app = <App path={paths.includes(path) ? path : '/404'} />
if (root.querySelector('main')) hydrateRoot(root, app)
else createRoot(root).render(app)
