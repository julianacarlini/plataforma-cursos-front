import router from "next/router"

const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'

export async function api(path: string, init: RequestInit = {}) {
  // pega token salvo no login
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  const headers = new Headers(init.headers)
  // só define se não foi enviado (para uploads multipart, não defina aqui)
  if (!(init.body instanceof FormData)) {
    headers.set('Content-Type', headers.get('Content-Type') || 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers,
    cache: 'no-store', // não cachear respostas protegidas
    credentials: 'omit',
  })

  // tratamento simples de erro
  if (!res.ok) {
    if (res.status === 401){
      router.push('/login')
    }
    let msg = `HTTP ${res.status}`
    try { const j = await res.json();
      if (j?.error) msg = j.error 
    } catch {}
    throw new Error(msg)
  }

  // tenta JSON; se falhar (204), retorna null
  try { return await res.json() } catch { return null }
}
