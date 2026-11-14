import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gallery, landing, services, site } from './content'
import { LeadForm, Modal } from './lead'
import { AudiencePage, ContactsPage, Home, MissingPage, PricePage, PrivacyPage, ProductionPage, ProjectPage, ServicePage, ServicesPage, WorksPage } from './pages'
import { Footer, Header } from './ui'

export const paths = ['/', '/services', '/business', '/brands', '/individual', '/works', '/production', '/contacts', '/price', '/privacy', ...services.map(s => '/services/'+s.id), ...gallery.map(p => '/works/'+p.id)]

const info: Record<string, [string, string]> = {
  '/': ['Производство одежды и индивидуальный пошив в Сочи', site.description],
  '/services': ['Услуги швейного производства в Сочи', 'Разработка моделей, лекала, пошив образцов, контрактное производство одежды, униформа и индивидуальный пошив.'],
  '/brands': [landing.brands.title, landing.brands.description],
  '/business': [landing.business.title, landing.business.description],
  '/individual': [landing.individual.title, landing.individual.description],
  '/works': ['Наши работы', 'Демонстрационные примеры изделий для брендов, бизнеса и частных заказчиков.'],
  '/production': ['О швейном производстве в Сочи', 'Собственное швейное производство ЦЕХЪ и более 30 лет опыта специалистов.'],
  '/contacts': ['Контакты', 'Контактная информация швейного производства ЦЕХЪ в Сочи.'],
  '/price': ['Стоимость пошива и расчёт заказа', 'Узнайте, как рассчитывается стоимость пошива, и опишите ваш проект в пошаговой форме.'],
  '/privacy': ['Обработка персональных данных', 'Информация об обработке персональных данных в прототипе сайта ЦЕХЪ.'],
}

export function metadata(path: string) {
  const service = services.find(s => '/services/'+s.id === path)
  const project = gallery.find(p => '/works/'+p.id === path)
  const item = info[path] || (service ? [service.title+' в Сочи', service.description] : project ? [project.title+' — демонстрационный пример', project.task] : ['Страница не найдена', site.description])
  const parts = path.split('/').filter(Boolean)
  return {
    title: 'ЦЕХЪ — '+item[0],
    description: item[1],
    canonical: site.url+path,
    image: site.url+'/images/'+(service?.image || project?.image || 'cover-atelier')+'.webp',
    breadcrumbs: path === '/' ? [] : [{ name: 'Главная', pathname: '/' }, ...(parts.length > 1 ? [{ name: parts[0] === 'services' ? 'Услуги' : 'Наши работы', pathname: '/'+parts[0] }] : []), { name: service?.title || project?.title || item[0], pathname: path }],
  }
}

export function App({ path }: { path: string }) {
  const [showQuote, setShowQuote] = useState(false)
  const [lead, setLead] = useState<{ type?: number } | null>(null)
  const onLead = (type?: number) => setLead({ type })
  const service = services.find(s => '/services/'+s.id === path)
  const project = gallery.find(p => '/works/'+p.id === path)
  const pageType = service?.type ?? project?.type ?? (path === '/brands' ? 0 : path === '/business' ? 1 : path === '/individual' ? 2 : undefined)
  let page
  switch (path) {
    case '/': page = <Home onLead={onLead} />; break
    case '/services': page = <ServicesPage onLead={onLead} />; break
    case '/brands': case '/business': case '/individual': page = <AudiencePage keyName={path.slice(1) as keyof typeof landing} onLead={onLead} />; break
    case '/works': page = <WorksPage onLead={onLead} />; break
    case '/production': page = <ProductionPage onLead={onLead} />; break
    case '/contacts': page = <ContactsPage />; break
    case '/price': page = <PricePage />; break
    case '/privacy': page = <PrivacyPage />; break
    default: page = service ? <ServicePage service={service} onLead={onLead} /> : project ? <ProjectPage project={project} onLead={onLead} /> : <MissingPage />
  }

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('revealed')
      observer.unobserve(entry.target)
    }), { threshold: .06 })
    document.querySelectorAll('.section-heading, .detail-strip, .audience-card, .service-card, .workshop-wide').forEach(el => {
      if (el.getBoundingClientRect().top >= innerHeight) {
        el.classList.add('reveal-ready')
        observer.observe(el)
      }
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const intro = document.querySelector('.hero-stage, .page-hero')
    if (!intro) return
    const observer = new IntersectionObserver(([entry]) => {
      setShowQuote(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0)
    })
    observer.observe(intro)
    return () => observer.disconnect()
  }, [path])

  return <><a className="skip" href="#main">К содержанию</a>
    <Header path={path} pastIntro={showQuote} onLead={() => onLead(pageType)} />
    <main id="main">{page}</main>
    <Footer />
    {showQuote && !lead && <aside className="quote-dock" aria-label="Расчёт заказа"><button type="button" onClick={() => onLead(pageType)}>Рассчитать стоимость <ArrowUpRight size={18} aria-hidden="true" /></button></aside>}
    {lead && <Modal onClose={() => setLead(null)}><LeadForm type={lead.type} /></Modal>}
  </>
}
