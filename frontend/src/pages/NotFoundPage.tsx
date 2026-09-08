import { Link } from 'react-router-dom'

export function NotFoundPage() { return <div className="not-found"><span>404</span><h1>Página não encontrada</h1><p>O endereço acessado não existe nesta PoC.</p><Link className="button button-primary" to="/chamados">Voltar ao início</Link></div> }
