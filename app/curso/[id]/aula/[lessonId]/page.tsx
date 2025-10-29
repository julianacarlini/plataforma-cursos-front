'use client'

import { api } from '@/app/apiClient'
import { useAuth } from '@/app/hooks/useAuth'
import { useEffect, useState } from 'react'

type Params = { id: string; lessonId: string }

export default function Aula({ params }: { params: Params }) {
  const { user } = useAuth()
  const [lesson, setLesson] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api(`/api/courses/${params.id}/lessons/${params.lessonId}`)
      .then(setLesson)
      .catch((e) => setError(e.message))
  }, [params.id, params.lessonId])

  if (error) return <p style={{ color: 'tomato' }}>Erro: {error}</p>
  if (!lesson) return <p>Carregando…</p>

  return (
    <main className="container">
      <h1>{lesson.title}</h1>

      {lesson.videoUrl && (
        <video src={lesson.videoUrl} controls style={{ width: '100%' }} />
      )}

      <h2>Material</h2>
      {lesson.materials?.length ? (
        <ul>
          {lesson.materials.map((m: any) => (
            <li key={m.id}>
              <a href={m.path} download>{m.filename}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum material.</p>
      )}

      {lesson.evaluationId && (
        <a className="btn" href={`/curso/${params.id}/avaliacao/${lesson.evaluationId}`}>
          Fazer avaliação
        </a>
      )}

      {user?.role === 'PROFESSOR' && <UploadArea lessonId={Number(params.lessonId)} />}
    </main>
  )
}

function UploadArea({ lessonId }: { lessonId: number }) {
  const [file, setFile] = useState<File | undefined>()
  const [type, setType] = useState<'video' | 'material'>('material')
  const [loading, setLoading] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  async function send() {
    if (!file) return
    setLoading(true)
    const fd = new FormData()
    fd.append('file', file)

    const path =
      type === 'video'
        ? `/api/lessons/${lessonId}/video`
        : `/api/lessons/${lessonId}/materials`

    await fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + path, {
      method: 'POST',
      body: fd,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })

    location.reload()
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h3>Enviar conteúdo</h3>
      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="material">Material</option>
        <option value="video">Vídeo</option>
      </select>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      <button disabled={loading} onClick={send}>Enviar</button>
    </section>
  )
}
