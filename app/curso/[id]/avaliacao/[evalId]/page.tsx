'use client'

import { api } from '@/app/apiClient'
import { useEffect, useState } from 'react'

type Params = { id: string; evalId: string }

export default function Avaliacao({ params }: { params: Params }) {
  const [schema, setSchema] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api(`/api/evaluations/${params.evalId}`)
      .then(setSchema)
      .catch((e) => setError(e.message))
  }, [params.evalId])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries())
    await api(`/api/evaluations/${params.evalId}/submissions`, {
      method: 'POST',
      body: JSON.stringify({ answersJson: data }),
    } as any)
    alert('Avaliação enviada!')
  }

  if (error) return <p style={{ color: 'tomato' }}>Erro: {error}</p>
  if (!schema) return <p>Carregando…</p>

  return (
    <main className="container">
      <h1>{schema.title}</h1>
      <form onSubmit={onSubmit}>
        {schema.schemaJson?.fields?.map((f: any) => (
          <div key={f.name}>
            <label>{f.label}</label>
            <input
              name={f.name}
              required={!!f.required}
              // você pode usar f.type para decidir entre text/number/select/etc.
            />
          </div>
        ))}
        <button type="submit">Enviar</button>
      </form>
    </main>
  )
}
