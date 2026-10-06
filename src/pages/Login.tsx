import { FormEvent, useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@nexusops.com')
  const [password, setPassword] = useState('Demo123!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(email, password)
      localStorage.setItem('nexusops-token', result.token)
      localStorage.setItem('nexusops-user', JSON.stringify(result.user))
      window.dispatchEvent(new Event('nexusops-auth'))
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Unable to sign in. Check your credentials or make sure the API is running.')
    } finally {
      setLoading(false)
    }
  }
  return <main className="login-page"><section className="login-brand"><div className="brand-mark"><Zap size={17} fill="white" /></div><span>Nexus<span>Ops</span></span></section><section className="login-card"><div className="login-heading"><span className="login-icon"><LockKeyhole size={18} /></span><p className="eyebrow">Welcome back</p><h1>Sign in to NexusOps</h1><p>Bring your business operations into focus.</p></div><form onSubmit={submit}><label>Email address<div className="login-input"><Mail size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></label><label>Password<div className="login-input"><LockKeyhole size={16} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button primary login-submit" disabled={loading}>{loading ? 'Signing in...' : <>Sign in <ArrowRight size={16} /></>}</button></form><p className="demo-hint">Demo: demo@nexusops.com / Demo123!</p></section><p className="login-footer">NexusOps workspace · Built for clearer decisions</p></main>
}
