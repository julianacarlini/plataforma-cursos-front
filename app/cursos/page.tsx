"use client";

import Courses from "@/components/courses"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Recomendados from "@/components/recomendados"
import { useUser } from "@/components/useUser/useUser";
import { useEffect, useState } from "react"

export default function Cursos() {
    const { user } = useUser()
    const [isClient, setIsClient] = useState(false)

    useEffect(()=>{setIsClient(true)}, []) // O array vazio [] garante que isso só rode uma vez

    return (
        <div className='background'>
            <Header />

            <div className='main'>

                <div>
                    <h1>filtro/pesquisa</h1>
                </div>

                <section className='courses' aria-labelledby="cursos-disponiveis">
                    <h1 id='cursos-destaque'>Destaques</h1>
                    <Courses tag="highlights" />
                </section>

                <section className='courses' aria-labelledby="cursos-disponiveis">
                    <h1 id='cursos-recomendados'>Novidades</h1>
                    <Courses tag="new" />
                </section>

                {isClient && user && <section><Recomendados /></section>}

            </div>

            <Footer />
        </div>
    )
}