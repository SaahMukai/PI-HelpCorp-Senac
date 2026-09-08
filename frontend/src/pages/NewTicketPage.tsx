import { ArrowLeft, CheckCircle2, FileText, Paperclip, Send, Sparkles, UploadCloud } from 'lucide-react'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { ticketsApi } from '../services/ticketsApi'
import type { Category, Priority, TicketAttachment } from '../types'

export function NewTicketPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState<TicketAttachment[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { ticketsApi.listCategories().then(setCategories).catch(() => setError('Não foi possível carregar as categorias.')) }, [])

  const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    setAttachments(files.map((file, index) => ({ id: `${file.name}-${index}`, name: file.name, size: file.size, type: file.type || 'application/octet-stream' })))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!title.trim()) nextErrors.title = 'Informe um título para o chamado.'
    if (!categoryId) nextErrors.category = 'Selecione uma categoria.'
    if (description.trim().length < 15) nextErrors.description = 'Descreva o problema com pelo menos 15 caracteres.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    setError('')
    try {
      const ticket = await ticketsApi.create({ title, categoryId, priority, description, attachments })
      navigate(`/chamados/${ticket.id}`, { state: { created: true } })
    } catch {
      setError('Não foi possível abrir o chamado. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Link className="back-link" to="/chamados"><ArrowLeft size={16} /> Voltar para meus chamados</Link>
      <PageHeader eyebrow="Nova solicitação" title="Como podemos ajudar?" description="Conte o que aconteceu. A equipe certa receberá sua solicitação com todas as informações necessárias." />
      <form className="form-layout" onSubmit={submit} noValidate>
        <section className="panel form-panel">
          <div className="form-section-heading"><span className="form-number">01</span><div><h2>Detalhes do chamado</h2><p>Comece identificando o assunto da sua solicitação.</p></div></div>
          <label className="field-label" htmlFor="title">Título do chamado <span>*</span></label>
          <input id="title" className={`text-input ${errors.title ? 'input-error' : ''}`} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Notebook travando durante o uso" />
          {errors.title && <span className="field-error">{errors.title}</span>}
          <div className="field-grid">
            <div><label className="field-label" htmlFor="category">Categoria <span>*</span></label><select id="category" className={`text-input ${errors.category ? 'input-error' : ''}`} value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">Selecione uma categoria</option>{Array.from(new Set(categories.map((category) => category.sector))).map((sector) => <optgroup key={sector} label={sector}>{categories.filter((category) => category.sector === sector).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</optgroup>)}</select>{errors.category && <span className="field-error">{errors.category}</span>}</div>
            <div><label className="field-label" htmlFor="priority">Nível de urgência <span>*</span></label><select id="priority" className="text-input" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option value="low">Baixa · Posso aguardar</option><option value="medium">Média · Preciso em breve</option><option value="high">Alta · Impacta meu trabalho</option><option value="critical">Crítica · Operação parada</option></select></div>
          </div>
          <label className="field-label" htmlFor="description">Descrição <span>*</span></label>
          <div className={`textarea-wrap ${errors.description ? 'input-error' : ''}`}><textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descreva o problema, quando começou e o que você já tentou fazer..." rows={7} /><div className="textarea-footer"><span><Sparkles size={14} /> Seja específico para agilizar a triagem</span><span>{description.length}/1000</span></div></div>
          {errors.description && <span className="field-error">{errors.description}</span>}
        </section>

        <section className="panel form-panel">
          <div className="form-section-heading"><span className="form-number">02</span><div><h2>Arquivos de apoio</h2><p>Adicione prints, fotos ou documentos que ajudem na análise.</p></div></div>
          <label className="upload-zone"><input type="file" multiple onChange={onFilesSelected} /><UploadCloud size={23} /><strong>Arraste arquivos ou clique para selecionar</strong><span>PNG, JPG, PDF ou DOCX até 20 MB por arquivo</span></label>
          {attachments.length > 0 && <div className="attachment-list">{attachments.map((attachment) => <div className="attachment-item" key={attachment.id}><FileText size={17} /><span>{attachment.name}<small>{formatBytes(attachment.size)}</small></span><Paperclip size={15} /></div>)}</div>}
          <div className="form-tip"><Sparkles size={17} /><span><strong>Uma dica:</strong> prints com mensagens de erro ajudam a equipe a encontrar a causa mais rapidamente.</span></div>
        </section>

        {error && <div className="error-state form-error">{error}</div>}
        <div className="form-actions"><Link className="button button-ghost" to="/chamados">Cancelar</Link><button className="button button-primary" type="submit" disabled={saving}>{saving ? <><span className="spinner spinner-light" /> Enviando...</> : <><Send size={16} /> Abrir chamado</>}</button></div>
      </form>
    </>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
