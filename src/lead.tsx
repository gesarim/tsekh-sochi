import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, Paperclip, X } from 'lucide-react'
import { projectTypes, site, sitePath } from './content'

const options = [
  projectTypes,
  ['Есть готовые лекала', 'Есть образец', 'Есть эскиз или фотография', 'Есть только идея'],
  ['Одно изделие', '2–10 изделий', '11–50 изделий', '51–100 изделий', 'Более 100 изделий', 'Пока не знаю'],
]
const titles = ['Что необходимо изготовить?', 'На какой стадии проект?', 'Какой объём?', 'Расскажите подробнее', 'Как с вами связаться?']
const keys = ['type', 'stage', 'volume', 'description', 'deadline'] as const
const empty = { type: '', stage: '', volume: '', description: '', deadline: '', name: '', phone: '', messenger: '' }
const draftKey = 'tsekh-brief-v1'

export function LeadForm({ type }: { type?: number }) {
  const [values, setValues] = useState({ ...empty, type: type === undefined ? '' : projectTypes[type] })
  const [ready, setReady] = useState(false)
  const [step, setStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(draftKey) || '{}')
      setValues(previous => {
        const next = { ...previous }
        for (const key of keys) if (typeof saved[key] === 'string' && (key !== 'type' || type === undefined)) next[key] = saved[key]
        return next
      })
    } catch { /* Browsers can disable local storage. */ }
    setReady(true)
  }, [type])
  useEffect(() => {
    if (!ready || status === 'success') return
    try {
      const draft = Object.fromEntries(keys.map(key => [key, values[key]]))
      localStorage.setItem(draftKey, JSON.stringify(draft))
    } catch { /* Form answers remain available in memory. */ }
  }, [ready, status, values])

  function update(key: keyof typeof empty, value: string) {
    setValues(previous => ({ ...previous, [key]: value }))
    setMessage('')
  }

  function go(next: number) {
    setMessage('')
    setStep(next)
    requestAnimationFrame(() => heading.current?.focus())
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return
    if (step < 4) {
      if (step < 3 && !values[keys[step]]) { setMessage('Выберите один вариант.'); return }
      go(step+1)
      return
    }
    const digits = values.phone.replace(/\D/g, '')
    if (!values.name.trim() || !/^\+?[0-9 ()–.-]+$/.test(values.phone.trim()) || digits.length < 7 || digits.length > 15) {
      setMessage('Укажите имя и номер телефона с 7–15 цифрами.')
      return
    }
    if (!site.leadEndpoint) {
      setMessage('Это прототип. Приём заявок пока не подключён. Ответы о проекте сохранены на этом устройстве.')
      return
    }
    setMessage('')
    setStatus('loading')
    const payload = new FormData(event.currentTarget)
    for (const [key, value] of Object.entries(values)) payload.set(key, value.trim())
    for (const file of files) payload.append('attachments', file)
    try {
      const response = await fetch(site.leadEndpoint, { method: 'POST', body: payload })
      if (!response.ok) throw new Error('Lead submission failed')
      const result = await response.json()
      if (result?.accepted !== true) throw new Error('Lead acceptance was not confirmed')
      setStatus('success')
      try { localStorage.removeItem(draftKey) } catch { /* Storage may be disabled. */ }
    } catch {
      setStatus('idle')
      setMessage('Отправка не удалась. Проверьте соединение и попробуйте ещё раз.')
    }
  }

  if (status === 'success') return <div className="lead-panel" role="status"><Check size={30} /><h3>Заявка получена</h3><p>Мы изучим описание и свяжемся с вами, чтобы уточнить детали проекта.</p></div>
  return <form className="lead-panel" onSubmit={handleSubmit}>
    <div className="lead-meta"><span>Шаг {step+1} из 5</span><progress value={step+1} max={5} aria-label="Шаги заявки" /></div>
    <h3 ref={heading} tabIndex={-1}>{titles[step]}</h3>
    {step < 3 && <div className="lead-options" role="group" aria-label={titles[step]}>{options[step].map(option => <button type="button" key={option} aria-pressed={values[keys[step]] === option} onClick={() => update(keys[step], option)}>{option}{values[keys[step]] === option && <Check size={16} />}</button>)}</div>}
    {step === 3 && <div className="lead-fields">
      <label>Описание проекта<textarea rows={3} value={values.description} onChange={event => update('description', event.target.value)} placeholder="Например, 30 фартуков для ресторана…" maxLength={2500} /></label>
      <label>Желаемые сроки<input value={values.deadline} onChange={event => update('deadline', event.target.value)} placeholder="Например, к открытию в сентябре" maxLength={150} /></label>
      <label className="upload-control"><Paperclip size={16} /> Прикрепить файлы<input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={event => {
        const next = Array.from(event.target.files ?? [])
        if (next.length > 5 || next.some(file => file.size > 10*1024*1024)) {
          event.target.value = ''; setMessage('Можно добавить до пяти файлов размером до 10 МБ каждый.'); return
        }
        setFiles(next); setMessage('')
      }} /></label>
      {files.length > 0 && <ul className="file-list">{files.map((file, index) => <li key={file.name+index}><span>{file.name}</span><button type="button" aria-label={'Удалить '+file.name} onClick={() => setFiles(files.filter((_, i) => i !== index))}><X size={16} /></button></li>)}</ul>}
    </div>}
    {step === 4 && <div className="lead-fields">
      <label>Имя<input value={values.name} onChange={event => update('name', event.target.value)} autoComplete="name" required maxLength={120} /></label>
      <label>Телефон<input type="tel" value={values.phone} onChange={event => update('phone', event.target.value)} autoComplete="tel" required maxLength={32} /></label>
      <label>Telegram или другой способ связи<input value={values.messenger} onChange={event => update('messenger', event.target.value)} maxLength={160} /></label>
      {site.leadEndpoint ? <label className="consent"><input type="checkbox" name="consent" value="accepted" required /><span>Согласен с <a href={sitePath('/privacy')} target="_blank" rel="noreferrer">условиями обработки персональных данных</a>.</span></label> : <p className="helper">Приём заявок пока не подключён. Для проверки формы можно ввести тестовые данные.</p>}
    </div>}
    {message && <p className="form-message" role="alert">{message}</p>}
    <div className="lead-actions">
      {step > 0 && <button type="button" className="back-button" onClick={() => go(step-1)} disabled={status === 'loading'}><ArrowLeft size={16} /> Назад</button>}
      <button type="submit" className="button primary" disabled={status === 'loading'}><span>{status === 'loading' ? 'Отправляем…' : step === 4 ? 'Отправить на расчёт' : 'Продолжить'}</span><ArrowRight size={17} /></button>
    </div>
  </form>
}

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previousFocus = document.activeElement
    dialog.current?.showModal()
    return () => { if (previousFocus instanceof HTMLElement) previousFocus.focus() }
  }, [])
  return <dialog className="modal" ref={dialog} aria-label="Рассчитать заказ" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="modal-body"><button className="menu-button modal-close" type="button" autoFocus onClick={onClose} aria-label="Закрыть форму"><X size={22} /></button>{children}</div>
  </dialog>
}
