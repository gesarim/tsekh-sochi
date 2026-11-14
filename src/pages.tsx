import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { advantages, audiences, gallery, landing, services, sitePath } from './content'
import { LeadForm } from './lead'
import { Breadcrumbs, Button, ContactSection, FAQAccordion, FinalCTA, Photo, Portfolio, Process, SectionHeading, ServiceCard, type OpenLead } from './ui'

export function CostForm({ type }: { type?: number }) {
  return <section id="calculation" className="section calculation"><div className="container split-grid">
    <div><p className="eyebrow">Индивидуальный расчёт</p><h2>Расскажите, что нужно сшить. Мы подготовим расчёт.</h2><p>Не обязательно иметь готовое техническое задание. Достаточно описать идею, приложить фотографию или эскиз.</p></div><LeadForm type={type} />
  </div></section>
}

function ServicesList() {
  return <div className="services-list">{services.map(service => <a href={sitePath('/services/'+service.id)} key={service.id}><h3>{service.title}</h3><p>{service.description}</p><ArrowUpRight size={20} aria-hidden="true" /></a>)}</div>
}

function Experience() {
  return <section className="section experience"><div className="container split-grid">
    <div><p className="eyebrow">Опыт команды</p><h2>За каждым изделием — десятилетия мастерства</h2></div>
    <div className="body-copy"><p>Команда ЦЕХЪ объединяет специалистов с более чем 30-летним профессиональным опытом. За эти годы наши мастера участвовали в реализации проектов для крупных российских и международных заказчиков — от сложной сценической одежды до изделий с высокими требованиями к конструкции и исполнению.</p><p>Сегодня мы применяем накопленные знания на собственном производстве в Сочи, сочетая традиции профессионального пошива с современными технологиями.</p><Button href="/production" style="outline">О производстве</Button></div>
  </div></section>
}

function Quality() {
  return <section className="section dark"><div className="container">
    <SectionHeading eyebrow="Качество исполнения" title="Мастерство, которое видно в деталях" description="Качество начинается задолго до первой строчки — с понимания задачи, правильной конструкции и точной работы на каждом этапе." />
    <div className="stitch-stage"><Photo name="stitch" className="stitch-photo" /></div>
    <div className="advantages">{advantages.map(([title, description]) => <div key={title}><h3>{title}</h3><p>{description}</p></div>)}</div>
  </div></section>
}

export function Home({ onLead }: { onLead: OpenLead }) {
  return <>
    <section className="hero">
      <div className="hero-stage">
        <div className="hero-frame">
          <Photo name="textile" className="hero-photo" priority />
          <div className="container hero-copy">
            <p className="eyebrow hero-eyebrow">Швейное производство · Сочи</p>
            <h1><span>Сложные идеи.</span><span>Точное исполнение.</span></h1>
            <p className="hero-description">Разрабатываем и создаём одежду — от первых эскизов до готовых изделий. Собственное производство, профессиональное оборудование и более 30 лет опыта наших специалистов.</p>
            <div className="hero-buttons"><Button onClick={() => onLead()}>Рассчитать стоимость</Button><Button href="/works" style="outline">Посмотреть работы</Button></div>
          </div>
          <a className="hero-scroll" href="#audiences" aria-label="Перейти к направлениям"><ArrowDown size={20} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="container">
        <div className="facts">
          <div><strong>30+</strong><span>лет опыта<br />специалистов</span></div>
          <div><strong>Своё производство</strong><span>Сочи</span></div>
          <div><strong>Сложные изделия</strong><span>от лекал до пошива</span></div>
        </div>
      </div>
    </section>
    <section id="audiences" className="section audiences"><div className="container">
      <SectionHeading eyebrow="Направления" title="У каждой задачи — своё решение" description="Создаём изделия для бизнеса, брендов и частных клиентов. Вникаем в задачу, предлагаем конструктивное решение и доводим проект до результата." />
      <div className="audience-grid">{audiences.map(item => <a className="audience-card group" href={sitePath(item.path)} key={item.path}>
        <Photo name={item.image} /><div className="audience-copy"><h3>{item.title}</h3><p>{item.description}</p><span className="text-link">{item.label} <ArrowUpRight size={17} aria-hidden="true" /></span></div>
      </a>)}</div>
    </div></section>
    <section className="section tone-soft"><div className="container"><SectionHeading eyebrow="Услуги" title="От идеи до последнего шва" description="Берём на себя техническую и производственную часть проекта, чтобы замысел превратился в готовое изделие." /><ServicesList /></div></section>
    <Quality />
    <Experience />
    <section className="section portfolio-section"><div className="container">
      <SectionHeading eyebrow="Портфолио" title="Лучше слов — результат" description="Каждое изделие — отдельная задача, в которой важны конструкция, материал, посадка и детали." /><p className="demo-note">Демонстрационные примеры со сгенерированными изображениями</p><Portfolio preview /><Button href="/works" style="outline">Смотреть все работы</Button>
    </div></section>
    <Process />
    <section className="section dark workshop-section"><div className="container">
      <SectionHeading eyebrow="Производство" title="Настоящее производство. Настоящие мастера." description="За качественным изделием стоят опыт, точность и десятки профессиональных решений. Показываем, как устроена наша работа и что происходит за дверями ЦЕХЪ." />
      <div className="workshop-stage"><Photo name="studio" className="workshop-wide" /></div><div className="section-action"><Button href="/production" style="light">О производстве</Button></div>
    </div></section>
    <section className="section"><div className="container fit-grid"><Photo name="individual" /><div><p className="eyebrow">Индивидуальная посадка</p><h2>Одежда должна подходить человеку. Не наоборот.</h2><p>Правильная посадка — это баланс конструкции, пропорций, материала и особенностей фигуры. Мы уделяем внимание этим деталям, чтобы изделие не только выглядело красиво, но и было комфортным.</p><ul className="fit-list"><li>Учитываем индивидуальные пропорции.</li><li>Работаем со сложными силуэтами.</li><li>Корректируем конструкцию под задачу.</li></ul><Button onClick={() => onLead(2)}>Обсудить индивидуальный пошив</Button></div></div></section>
    <CostForm /><FAQAccordion /><FinalCTA onLead={onLead} /><ContactSection onLead={onLead} />
  </>
}

export function PageHero({ title, description, image, crumbs, children }: { title: string; description?: string; image?: string; crumbs: { href?: string; label: string }[]; children?: React.ReactNode }) {
  return <section className={'page-hero'+(image ? ' has-image' : '')}><div className="container"><Breadcrumbs items={crumbs} /><div className="page-hero-grid">
    <div><h1>{title}</h1>{description && <p>{description}</p>}{children}</div>{image && <Photo name={image} priority />}
  </div></div></section>
}

function Points({ title, points }: { title: string; points: string[][] }) {
  return <section className="section tone-soft"><div className="container split-grid"><h2>{title}</h2><dl className="point-list">{points.map(([name, text]) => <div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}</dl></div></section>
}

export function AudiencePage({ keyName, onLead }: { keyName: keyof typeof landing; onLead: OpenLead }) {
  const item = landing[keyName]
  const label = keyName === 'brands' ? 'Для брендов' : keyName === 'business' ? 'Для бизнеса' : 'Индивидуальный пошив'
  return <>
    <PageHero title={item.title} description={item.description} image={item.image} crumbs={[{ label }]}><Button onClick={() => onLead(item.type)}>{item.cta}</Button></PageHero>
    <Points title={item.heading} points={item.points} />
    <section className="section"><div className="container"><SectionHeading title="Пример проекта" description="Демонстрационный пример со сгенерированным изображением." /><Portfolio type={item.type} /></div></section>
    <Process title="Как проходит заказ" /><FAQAccordion /><CostForm type={item.type} />
  </>
}

export function ServicesPage({ onLead }: { onLead: OpenLead }) {
  return <><PageHero title="Услуги швейного производства" description="От разработки модели и лекал до образца, индивидуального изделия или партии." image="pattern" crumbs={[{ label: 'Услуги' }]}><Button onClick={() => onLead()}>Рассчитать заказ</Button></PageHero>
  <section className="section"><div className="container"><SectionHeading title="От идеи до последнего шва" /><div className="service-grid">{services.map(service => <ServiceCard key={service.id} title={service.title} description={service.description} image={service.image} path={'/services/'+service.id} />)}</div></div></section>
  <FinalCTA onLead={onLead} /></>
}

export function ServicePage({ service, onLead }: { service: typeof services[number]; onLead: OpenLead }) {
  return <><PageHero title={service.title} description={service.description} image={service.image} crumbs={[{ href: '/services', label: 'Услуги' }, { label: service.title }]}><Button onClick={() => onLead(service.type)}>Рассчитать заказ</Button></PageHero>
    <Points title="Что входит в работу" points={[[ 'Для кого', service.audience ],[ 'Что подготовить', service.input ],[ 'Как проходит работа', service.process ]]} />
    <section className="section"><div className="container"><SectionHeading title="Пример задачи" description="Демонстрация возможного проекта." /><Portfolio type={service.type} /></div></section>
    <CostForm type={service.type} />
  </>
}

export function WorksPage({ onLead }: { onLead: OpenLead }) {
  return <><PageHero title="Лучше слов — результат" description="Каждое изделие — отдельная задача, в которой важны конструкция, материал, посадка и детали." crumbs={[{ label: 'Наши работы' }]} />
    <section className="section works-page"><div className="container"><p className="demo-note">Демонстрационные примеры со сгенерированными изображениями. Реальные проекты появятся после добавления материалов.</p><Portfolio /></div></section><FinalCTA onLead={onLead} /></>
}

export function ProjectPage({ project, onLead }: { project: typeof gallery[number]; onLead: OpenLead }) {
  return <><PageHero title={project.title} description="Демонстрационный пример проекта. Изображения сгенерированы." image={project.image} crumbs={[{ label: 'Наши работы', href: '/works' }, { label: project.title }]}><Button onClick={() => onLead(project.type)}>Рассчитать похожий проект</Button></PageHero>
    <Points title="От задачи к изделию" points={[[ 'Задача', project.task ],[ 'Исходные материалы', project.source ],[ 'Конструкция', project.feature ],[ 'Этапы работы', 'Уточнение параметров, разработка конструкции, подготовка образца и проверка изделия.' ],[ 'Визуализация', project.result ]]} />
    <section className="section"><div className="container"><SectionHeading title="Детали изделия" /><div className="detail-strip"><Photo name={project.image} /><Photo name="seams" /><Photo name="needle" /></div></div></section>
    <FinalCTA onLead={onLead} type={project.type} label="Рассчитать похожий проект" />
  </>
}

export function ProductionPage({ onLead }: { onLead: OpenLead }) {
  return <><PageHero title="Мастерство — в основе каждого изделия" description="Собственное швейное производство и специалисты с более чем 30-летним профессиональным опытом." image="workshop" crumbs={[{ label: 'О производстве' }]}><Button onClick={() => onLead()}>Обсудить проект</Button></PageHero>
    <Experience /><Quality />
    <section className="section"><div className="container"><SectionHeading title="Производство изнутри" description="Визуализации производственных процессов." /><div className="production-grid">{[['pattern','Конструирование'],['cut','Раскрой'],['hero','Пошив'],['seams','Проверка швов']].map(([name, label]) => <div key={name}><Photo name={name} /><h3>{label}</h3></div>)}</div></div></section>
    <Process /><FinalCTA onLead={onLead} />
  </>
}

export function PricePage() {
  return <><PageHero title="Стоимость пошива" description="Подготавливаем индивидуальный расчёт с учётом конструкции, материалов и объёма заказа." crumbs={[{ label: 'Стоимость' }]}><Button href="#calculation" down>Перейти к расчёту</Button></PageHero>
    <Points title="Из чего складывается цена" points={[[ 'Конструкция', 'Сложность модели, количество деталей и технология обработки.' ],[ 'Материалы', 'Тип ткани, фурнитура и требования к пошиву.' ],[ 'Объём партии', 'Количество изделий и размерный ряд.' ],[ 'Лекала и образцы', 'Необходимость разработки конструкции, образцов и их корректировок.' ],[ 'Сроки', 'Желаемая дата готовности и загрузка производства.' ]]} />
    <CostForm /><FAQAccordion />
  </>
}

export function ContactsPage({ onLead }: { onLead: OpenLead }) {
  return <><PageHero title="Контакты" description="ЦЕХЪ · Швейное производство в Сочи" crumbs={[{ label: 'Контакты' }]} /><ContactSection onLead={onLead} /></>
}

export function PrivacyPage() {
  return <><PageHero title="Обработка персональных данных" crumbs={[{ label: 'Обработка персональных данных' }]} /><section className="section"><div className="container body-copy"><p>В прототипе ответы о проекте сохраняются в браузере. Приём заявок и политика обработки персональных данных будут доступны после настройки формы и добавления реквизитов оператора.</p></div></section></>
}

export function MissingPage() {
  return <PageHero title="Страница не найдена" description="Вернитесь на главную или откройте каталог услуг." crumbs={[{ label: '404' }]}><a href={sitePath('/services')} className="text-link">Открыть услуги <ArrowRight size={17} /></a></PageHero>
}
