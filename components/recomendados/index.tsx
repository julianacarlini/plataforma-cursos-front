import Courses from "@/components/courses"

export default function Recomendados() {
    return (
        <section className='courses' aria-labelledby="cursos-disponiveis">
            <h1 id='cursos-destaque'>Recomendados para você</h1>
            <Courses tag="recommended" />
        </section>


    )
}