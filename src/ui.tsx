import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, Plus, X, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { gallery, imageAlt, nav, site, sitePath, steps, faq } from './content'

export type OpenLead = (type?: number) => void

export function Button({ children, href, onClick, style = 'primary', down = false }: { children: ReactNode; href?: string; onClick?: () => void; style?: string; down?: boolean }) {
  const Icon = down ? ArrowDown : ArrowUpRight
  const content = <><span>{children}</span><Icon size={17} strokeWidth={1.7} aria-hidden="true" /></>
  return href ? <a href={sitePath(href)} className={'button '+style}>{content}</a> : <button type="button" onClick={onClick} className={'button '+style}>{content}</button>
}

export function Logo() {
  return <a className="wordmark" href={sitePath('/')} aria-label="ЦЕХЪ — главная">ЦЕХЪ</a>
}

export function Header({ path, pastIntro, onLead }: { path: string; pastIntro: boolean; onLead: OpenLead }) {
  const [menu, setMenu] = useState(false)
  const mobileMenu = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!menu) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenu(false); mobileMenu.current?.focus() }
    }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [menu])
  return <header className={path === '/' ? (pastIntro ? 'header header-over-hero header-glass' : 'header header-over-hero') : 'header'}>
    <div className="container nav-shell">
      <Logo />
      <nav id="site-nav" aria-label="Основная навигация" className={menu ? 'nav open' : 'nav'}>
        {nav.map(([href, label]) => <a key={href} aria-current={path === href || (href !== '/' && path.startsWith(href+'/')) ? 'page' : undefined} href={sitePath(href)}>{label}</a>)}
        <button className="mobile-nav-cta" onClick={() => { setMenu(false); onLead() }}>Рассчитать стоимость <ArrowUpRight size={17} /></button>
      </nav>
      <div className="nav-cta"><Button style="nav-button" onClick={() => onLead()}>Рассчитать стоимость</Button></div>
      <button ref={mobileMenu} type="button" className="menu-button" aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menu} aria-controls="site-nav" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
    </div>
  </header>
}

export function Photo({ name, className = '', priority = false, children }: { name: string; className?: string; priority?: boolean; children?: ReactNode }) {
  return <figure className={'photo '+className}>
    <img src={sitePath('/images/'+name+'.webp')} alt={imageAlt[name]} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding={priority ? 'auto' : 'async'} />
    <figcaption className={children ? undefined : 'sr-only'}>{children ?? 'Визуализация, созданная ИИ'}</figcaption>
  </figure>
}

export function SectionHeading({ title }: { title: ReactNode }) {
  return <div className="section-heading">
    <h2>{title}</h2>
  </div>
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Хлебные крошки"><a href={sitePath('/')}>Главная</a>{items.map(({ href, label }) => <span key={label}> / {href ? <a href={sitePath(href)}>{label}</a> : <span aria-current="page">{label}</span>}</span>)}</nav>
}

export function ServiceCard({ path, title, description, image, onCalculate }: { path: string; title: string; description: string; image: string; onCalculate: () => void }) {
  return <article className="service-card"><a href={sitePath(path)} className="service-card-link group">
    <Photo name={image} />
    <div className="service-caption"><div><h3>{title}</h3><p>{description}</p></div></div>
  </a><Button onClick={onCalculate}>Рассчитать стоимость</Button></article>
}

export function PortfolioCard({ project }: { project: typeof gallery[number] }) {
  return <a className="work-card group" href={sitePath('/works/'+project.id)}>
    <Photo name={project.image}>ИИ-иллюстрация · демонстрация</Photo>
    <div className="work-card-copy"><div><p className="eyebrow">{project.category}</p><h3>{project.title}</h3><p>{project.task}</p></div><span className="round-icon"><ArrowUpRight size={18} aria-hidden="true" /></span></div>
  </a>
}

export function Portfolio({ type }: { type?: number }) {
  const [filter, setFilter] = useState('Все работы')
  const categories = ['Все работы', ...new Set(gallery.map(item => item.category))]
  const projects = type === undefined ? gallery.filter(item => filter === 'Все работы' || item.category === filter) : gallery.filter(item => item.type === type)
  return <>
    {type === undefined && <div className="filters" aria-label="Категории работ">{categories.map(category => <button type="button" key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>}
    <div className={'portfolio-grid'+(type === undefined ? '' : ' portfolio-single')} aria-live="polite">{projects.map(project => <PortfolioCard key={project.id} project={project} />)}</div>
  </>
}

export function ProcessStep({ value, index }: { value: string[]; index: number }) {
  return <li className="process-step"><span>{String(index+1).padStart(2, '0')}</span><div><h3>{value[0]}</h3><p>{value[1]}</p></div></li>
}

export function Process({ title = 'Понятный процесс. Продуманный результат.' }: { title?: string }) {
  return <section className="section process-section"><div className="container"><SectionHeading title={title} /><ol className="process-grid">{steps.map((value, index) => <ProcessStep key={value[0]} value={value} index={index} />)}</ol><Button href="/price">Обсудить свой проект</Button></div></section>
}

export function FAQAccordion() {
  return <section className="section"><div className="container faq-grid"><SectionHeading title="Частые вопросы" /><div className="faq-list">{faq.map(([question, answer]) => <details name="faq" key={question}><summary>{question}<Plus size={20} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>
}

export function ContactSection() {
  const c = site.contacts
  const contacts = [
    { label: 'WhatsApp', value: c.whatsapp ? 'Написать' : '', href: c.whatsapp, Icon: MessageCircle },
    { label: 'Telegram', value: c.telegram ? 'Написать' : '', href: c.telegram, Icon: Send },
    { label: 'Телефон', value: c.phone, href: c.phone ? 'tel:' + c.phone : '', Icon: Phone },
    { label: 'Email', value: c.email, href: c.email ? 'mailto:' + c.email : '', Icon: Mail },
  ]
  const location = c.address ? c.city + ', ' + c.address : c.city
  const mapQuery = c.address ? 'text=' + encodeURIComponent(location) : 'll=39.7257%2C43.5855&z=11'
  const mapEmbed = c.mapEmbed || 'https://yandex.ru/map-widget/v1/?' + mapQuery
  const mapLink = c.map || 'https://yandex.ru/maps/?' + mapQuery
  return <section className="section contact-section contact-directory"><div className="container">
    <h2>Свяжитесь с нами</h2>
    <ul role="list" className="contact-cards">{contacts.map(({ label, value, href, Icon }) => {
      const contents = <><Icon size={22} aria-hidden="true" /><div><h3>{label}</h3><p>{value || 'Скоро добавим'}</p></div>{href && <ArrowUpRight size={18} aria-hidden="true" />}</>
      return <li key={label}>{href ? <a className="contact-tile" href={href}>{contents}</a> : <div className="contact-tile">{contents}</div>}</li>
    })}</ul>
    <div className="contact-map">
      <div className="contact-map-heading">
        <div className="contact-address"><MapPin size={22} aria-hidden="true" /><div><h3>Как нас найти</h3><p>{location}</p>{!c.address && <p>Точный адрес уточняйте перед визитом.</p>}</div></div>
        <Button href={mapLink} style="outline">Открыть в Яндекс Картах</Button>
      </div>
      <iframe src={mapEmbed} title={c.address ? 'Ателье ЦЕХЪ на Яндекс Картах' : 'Сочи на Яндекс Картах'} loading="lazy" allowFullScreen />
    </div>
  </div></section>
}

export function FinalCTA({ onLead, type, label = 'Рассчитать стоимость' }: { onLead: OpenLead; type?: number; label?: string }) {
  return <section className="section proposal"><div className="container proposal-grid">
    <div className="proposal-copy"><h2>Обсудим ваш заказ</h2><p>По эскизу или фотографии подскажем, с чего начать пошив и что понадобится для расчёта.</p><Button onClick={() => onLead(type)}>{label}</Button></div>
    <Photo name="jacket" />
  </div></section>
}

export function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-grid"><div><Logo /><p>Собственное швейное производство<br />в Сочи.</p></div><nav aria-label="Навигация в подвале">{nav.slice(1).map(([href, label]) => <a key={href} href={sitePath(href)}>{label}</a>)}<a href={sitePath('/price')}>Стоимость</a><a href={sitePath('/individual')}>Индивидуальный пошив</a></nav></div>
    <div className="footer-bottom"><span>© ЦЕХЪ</span><a href={sitePath('/privacy')}>Обработка персональных данных</a><span>Фото изделий и производства — визуализации</span>{site.contacts.legal && <span>{site.contacts.legal}</span>}</div>
  </div></footer>
}
