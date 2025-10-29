'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/app/apiClient'
import CourseDetail from '../course-detail';

type Course = { 
    id:number;
    title:string;
    description:string;
    category:string;
    imageUrl?:string|null
}

export default function CourseSearch({ source }:{ source:'aluno'|'professor'|'todos' }) {
  const [q,setQ] = useState('')
  const [list,setList] = useState<Course[]>([])
  const [selected,setSelected] = useState<Course|null>(null)

  useEffect(()=> {
    const ep = source==='aluno' ? '/api/me/enrollments'
            : source==='professor' ? '/api/me/teaching'
            : '/api/courses'
    api(ep).then(setList)
  }, [source])

  const filtered = useMemo(
    ()=> list.filter(c => c.title.toLowerCase().includes(q.toLowerCase())), [list,q]
  )

  return (
    <div className="course-search">
      <div className="row">
        <input placeholder="Buscar curso…" value={q} onChange={e=>setQ(e.target.value)} />
        <select onChange={e=>setSelected(filtered.find(c=>c.id===Number(e.target.value))||null)}>
          <option value="">Selecione um curso</option>
          {filtered.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {selected && <CourseDetail id={selected.id} />}
    </div>
  )
}
