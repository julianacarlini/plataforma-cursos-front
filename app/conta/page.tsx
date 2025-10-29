'use client'

import HeaderAuth from '@/components/header-auth'
import Protected from '@/components/protected'
import { useAuth } from '@/app/hooks/useAuth'
import { api } from '@/app/apiClient'
import { useState } from 'react'

export default function Conta() {
  const { user, logout } = useAuth()
  const [name,setName] = useState(user?.name || '')
  const [cpf,setCpf] = useState('') // adapte se existir no modelo

  async function salvar(e:React.FormEvent){
    e.preventDefault()
    await api('/api/me', { method:'PATCH', body: JSON.stringify({ name, cpf }) } as any)
    alert('Dados atualizados')
  }

  async function trocarSenha(e:React.FormEvent){
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const password = (new FormData(form).get('password') as string)
    await api('/api/me/password', { method:'PATCH', body: JSON.stringify({ password }) } as any)
    alert('Senha alterada')
    form.reset()
  }

  async function excluir(){
    if(!confirm('Tem certeza?')) return
    await api('/api/me', { method:'DELETE' } as any)
    logout()
  }

  return (
    <Protected>
      <div className="background">
        <HeaderAuth />
        <main className="main">
          <h1>Minha conta</h1>

          <form onSubmit={salvar}>
            <label>Nome</label>
            <input value={name} onChange={e=>setName(e.target.value)} required />
            <label>CPF</label>
            <input value={cpf} onChange={e=>setCpf(e.target.value)} />
            <button type="submit">Salvar</button>
          </form>

          <form onSubmit={trocarSenha} style={{marginTop:16}}>
            <label>Nova senha</label>
            <input name="password" type="password" required />
            <button type="submit">Alterar senha</button>
          </form>

          <button onClick={excluir} style={{marginTop:16, color:'tomato'}}>Excluir conta</button>
        </main>
      </div>
    </Protected>
  )
}
