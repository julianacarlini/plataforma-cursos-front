'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Protected({ children, roles }:{
  children: React.ReactNode, roles?: Array<'ADMIN'|'PROFESSOR'|'ALUNO'>
}) {
    
  const router = useRouter()

  useEffect(()=> {
    const user = localStorage.getItem('user')
    if (!user){
      router.push('/login')
      return
    }
    const userData = JSON.parse(user)
    if (!roles?.includes(userData.role)){
      router.push('/login')
      return
    }
  }, [roles,router])

  return <>{children}</>
}
