"use client";

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import CourseCard from '../courseCard'
import { KeyboardDoubleArrowRight } from '@mui/icons-material'

type Course = {
    id: number
    title: string
    description: string
    imageUrl: string
}

export default function Courses({ tag, limit = 6 }: { tag?: 'highlights' | 'new' | 'recommended', limit?: number }) {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const base = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000'
        const qs = new URLSearchParams()
        if (tag) qs.set('tag', tag)
        if (limit) qs.set('limit', String(limit))

        fetch(`${base}/api/courses${qs.size ? `?${qs.toString()}` : ''}`, { cache: 'no-store' })
            .then(async r => {
                if (!r.ok) throw new Error('Falha ao carregar cursos')
                return r.json()
            })
            .then((data: Course[]) => setCourses(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [tag, limit])

    if (loading) return <p>Carregando cursos…</p>
    if (error) return <p style={{ color: 'tomato' }}>Erro: {error}</p>
    if (courses.length === 0) return <p>Sem cursos para mostrar.</p>

    return (
        <section className="courses" aria-labelledby="cursos">
            <div className="course-wrapper">
                <div className="courses-carousel" role="listbox" aria-label="Carrossel de cursos">
                    {courses.map(c => (
                        <CourseCard
                            id={c.id}
                            key={c.id}
                            title={c.title}
                            description={c.description}
                            image={c.imageUrl}
                        />
                    ))}
                </div>
            </div>

            <Link href="cursos" className='link-curso'>
                <p className='button' style={{ color: '#343A40' }}>Mais cursos</p>
                <KeyboardDoubleArrowRight />
            </Link>
        </section>
    )
}
