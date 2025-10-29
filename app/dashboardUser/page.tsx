'use client'

import Protected from '@/components/protected'
import HeaderAuth from '@/components/header-auth'
import CourseSearch from '@/components/course-search'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@/components/useUser/useUser'

export default function DashboardUser() {
  return (
    <Protected roles={['ALUNO','PROFESSOR']}>
      <DashboardInner />
    </Protected>
  )
}

function DashboardInner() {
  const router = useRouter()
  const { user } = useUser()

  const isAluno = user?.role === 'ALUNO'
  const isProfessor = user?.role === 'PROFESSOR'

  useEffect(() => {
    if (!user?.role) {
      router.push('/login')
    }
  },[user])

  return (
    <div className="background">
      <HeaderAuth />
      <main className="main">
        <h1>{isAluno ? 'Dashboard do Aluno' : 'Dashboard do Professor'}</h1>

        <CourseSearch source={isAluno ? 'aluno' : 'professor'} />

        {isAluno && (
          <section style={{ marginTop: 24 }}>
            {/* Ex.: atalhos do aluno */}
            {/* <AlunoQuickActions /> */}
          </section>
        )}

        {isProfessor && (
          <section style={{ marginTop: 24 }}>
            {/* Ex.: atalhos do professor (criar curso, gerenciar avaliações) */}
            {/* <ProfessorQuickActions /> */}
          </section>
        )}

      </main>
    </div>
  )
}
