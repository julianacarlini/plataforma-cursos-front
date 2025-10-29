"use client"

import Header from '@/components/header'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/app/apiClient'

export default function Login() {
    const router = useRouter()
    const search = useSearchParams()
    const callback = search.get('callback') || '/dashboardUser'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            // chama sua API de login
            const res = await api('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email: email.trim(), password }),
            } as any)

            const token = res?.accessToken || res?.access_token || res?.token
            if (!token) throw new Error('Token não recebido')

            localStorage.setItem('access_token', token)

            const me = await api('/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            })
            localStorage.setItem('user', JSON.stringify(me))
            if(me.role === 'ADMIN') {
                router.push('/dashboardAdmin')
            } else {
                router.push('dashboardUser')
            }
            
        } catch (err: any) {
            setError(err.message || 'Falha no login')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='body-login-cadastro'>
            <Header login unfixed />

            <div className="card-login-cadastro" role="form" aria-labelledby="login-heading">
                <h2 id="login-heading">Faça seu Login</h2>

                {/* Aviso de erro acessível */}
                {error && <p role="alert" style={{ color: 'tomato', marginBottom: 8 }}>{error}</p>}

                <form id="loginForm" onSubmit={onSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="loginEmail">E-mail</label>
                        <input
                            type="email" id="loginEmail" placeholder="Insira seu e-mail"
                            value={email} onChange={e => setEmail(e.target.value)}
                            required aria-describedby="login-email-error"
                        />
                        <small id="login-email-error" className="error-message" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="loginSenha">Senha</label>
                        <input
                            type="password" id="loginSenha" placeholder="Insira sua senha"
                            value={password} onChange={e => setPassword(e.target.value)}
                            required minLength={8} aria-describedby="login-senha-error"
                        />
                        <small id="login-senha-error" className="error-message" />
                    </div>

                    <button type="submit" className="btn-login" disabled={submitting}>
                        {submitting ? 'Entrando…' : 'Entrar'}
                    </button>
                </form>

                <p className="link-text">Ainda não tem conta? <a href="/cadastro">Cadastre-se</a></p>
            </div>
        </div>
    )
}
