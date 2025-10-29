"use client"
import Header from '@/components/header'
import { useState, FormEvent } from 'react'
import { api } from '@/app/apiClient'

const hasSpecial = (s: string)=> /[^A-Za-z0-9]/.test(s)
const onlyDigits = (s: string)=> s.replace(/\D/g, '')
function isValidCPF(cpf: string) {
  // validação rápida; para produção, use uma lib confiável
  cpf = onlyDigits(cpf)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  let soma=0; for (let i=0;i<9;i++) soma+=parseInt(cpf.charAt(i))*(10-i)
  let d1=11-(soma%11); if (d1>9) d1=0; if (d1!==parseInt(cpf.charAt(9))) return false
  soma=0; for (let i=0;i<10;i++) soma+=parseInt(cpf.charAt(i))*(11-i)
  let d2=11-(soma%11); if (d2>9) d2=0; return d2===parseInt(cpf.charAt(10))
}

export default function Cadastro() {
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function maskCPF(v: string) {
    const d = onlyDigits(v).slice(0,11)
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, '$1.$2.$3-$4')
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null); setSuccess(null)

    // validação client-side
    if (!isValidCPF(cpf)) { setError('CPF inválido'); return }
    if (password.length < 8 || !hasSpecial(password)) {
      setError('A senha deve ter 8+ caracteres e ao menos 1 caractere especial.')
      return
    }

    setSubmitting(true)
    try {
      // envia cpf sem máscara
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          cpf: onlyDigits(cpf),
          email: email.trim(),
          password
        }),
      } as any)

      setSuccess('Cadastro realizado! Você já pode fazer login.')
      ;(document.getElementById('cadastroForm') as HTMLFormElement)?.reset()
      setName(''); setCpf(''); setEmail(''); setPassword('')
    } catch (err: any) {
      setError(err.message || 'Erro no cadastro')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="body-login-cadastro">
      <Header login unfixed/>

      <div className="card-login-cadastro" role="form" aria-labelledby="cadastro-heading">
        <h2 id="cadastro-heading">Faça seu Cadastro</h2>

        {error && <p role="alert" style={{color:'tomato'}}>{error}</p>}
        {success && <p role="status" style={{color:'green'}}>{success}</p>}

        <form id="cadastroForm" onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input id="nome" value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome completo" required />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf" value={cpf}
              onChange={e=>setCpf(maskCPF(e.target.value))}
              placeholder="000.000.000-00" required maxLength={14}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cadEmail">E-mail</label>
            <input id="cadEmail" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="cadSenha">Senha</label>
            <input id="cadSenha" type="password" value={password} onChange={e=>setPassword(e.target.value)}
                   placeholder="Crie uma senha" minLength={8} required />
            <div id="senha-tips">
              <small className="password-tip">A senha deve conter 8+ caracteres</small>
              <small className="password-tip">Inclua pelo menos um caractere especial</small>
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={submitting}>
            {submitting ? 'Cadastrando…' : 'Cadastrar'}
          </button>
        </form>

        <p className="link-text">Já tem conta? <a href="/login">Entrar</a></p>
      </div>
    </div>
  )
}
