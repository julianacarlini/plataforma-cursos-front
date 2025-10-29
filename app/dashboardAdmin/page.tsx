'use client'

import Protected from '@/components/protected'
import HeaderAuth from '@/components/header-auth'
import { useEffect, useState } from 'react'
import { api } from '@/app/apiClient'
import Link from 'next/link'

export default function DashboardAdmin() {
  const [pending, setPending] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    const [p, all] = await Promise.all([
      api('/api/admin/courses?status=PENDING'),
      api('/api/courses?status=APPROVED')
    ])
    setPending(p); setCourses(all)
  }

  useEffect(() => {
    load()
    getUsers()
  }, [])

  async function approve(id: number) { await api(`/api/admin/courses/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'APPROVED' }) } as any); load() }
  async function archive(id: number) { await api(`/api/admin/courses/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'ARCHIVED' }) } as any); load() }
  async function remove(id: number) { await api(`/api/courses/${id}`, { method: 'DELETE' } as any); load() }

  const getUsers = async () => {
    try {
      const res = await api('/api/users')
      setUsers(res?.data)
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar usuários')
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await api(`/api/users/${id}`, {
        method: 'DELETE'
      })
      getUsers()
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar usuários')
    }

  }


  return (
    <Protected roles={['ADMIN']}>
      <div className="background">
        <HeaderAuth />
        <main className="main">
          <h1>Dashboard Admin</h1>

          <section>
            <h1>Usuários</h1>
            <Link href={'/cadastro'} className="cta-btn">
              <div>Adicionar usuário</div>
            </Link>

            <table>
              <thead>
                <tr>
                  <th>E-mail</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Tipo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) =>
                  <tr>
                    <td>{user?.email}</td>
                    <td>{user?.name}</td>
                    <td>{user?.cpf}</td>
                    <td>{user?.role}</td>
                    <td onClick={() => handleDeleteUser(user?.id)}>Excluir</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

        </main>
      </div>
    </Protected>
  )
}
