'use client'

import { useEffect, useState } from 'react'
import { api } from '@/app/apiClient'
import { useUser } from '../useUser/useUser';
import Link from 'next/link';

type Lesson = { 
    id:number;
    title:string;
    videoUrl?:string|null;
    materials?:Array<{id:number;filename:string;path:string}>;
    evaluationId?:number|null
}

type Data = {
    id:number;
    title:string;
    description:string;
    lessons:Lesson[];
    evaluations:Array<{id:number;title:string}>
}

export default function CourseDetail({ id }:{ id:number }) {
  const [data,setData] = useState<Data|null>(null)
  const { user } = useUser()

  useEffect(()=>{ api(`/api/courses/${id}`).then(setData) },[id])
  if(!data) return <p>Carregando curso…</p>

  return (
    <section className="course-detail">
      <h2>{data.title}</h2>
      <p>{data.description}</p>

      <h3>Aulas</h3>
      <div className="grid">
        {data.lessons.map(l=>(
          <article key={l.id} className="card">
            <h4>{l.title}</h4>
            <Link className="btn" href={`/curso/${id}/aula/${l.id}`}>Abrir aula</Link>
          </article>
        ))}
      </div>

      <h3>Avaliações</h3>
      <ul>
        {data.evaluations.map(ev=>(
          <li key={ev.id}>
            {ev.title} <Link href={`/curso/${id}/avaliacao/${ev.id}`}>Fazer</Link>
          </li>
        ))}
      </ul>

      {user?.role==='PROFESSOR' && (
        <div className="row" style={{marginTop:12}}>
          <Link className="btn" href={`/professor/curso/${id}/aulas`}>Gerenciar aulas</Link>
          <Link className="btn" href={`/professor/curso/${id}/avaliacoes`}>Gerenciar avaliações</Link>
        </div>
      )}
    </section>
  )
}
