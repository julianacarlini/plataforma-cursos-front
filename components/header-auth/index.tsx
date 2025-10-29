//Para renderizar no navegador (desabilita ssr)
"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { useUser } from '../useUser/useUser'

interface Props {
    login?: boolean
    unfixed?: boolean
}

export default function HeaderAuth(props: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    const handleOpenMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const { user, logout } = useUser()

    return (
        <header className={`cabecalho ${props?.unfixed && "unfixed"}`} id="cabecalho">
            <nav className="nav" aria-label="Menu principal">
                <a href="/#topo">
                    <img src="/assets/images/logoNexus.png" alt="Logotipo da Nexus" className="logo" />
                </a>
                {!props.login && <>
                    <ul id="menu-list" className={`nav-list ${isMenuOpen && "active"}`}>
                        <li><Link href="/cursos" className="button">Cursos</Link></li>
                        <li><Link href="/conta" className="button">Conta</Link></li>
                        <li><button className="button" onClick={logout}>Sair</button></li>
                    </ul>
                    <div className={`hamburguer-menu ${isMenuOpen && "active"}`} onClick={handleOpenMenu} role="button" aria-expanded="false" aria-controls="menu-list"
                        aria-label="Ícone menu">
                        <span className="hamburguer-menu-top-line"></span>
                        <span className="hamburguer-menu-center-line"></span>
                        <span className="hamburguer-menu-bottom-line"></span>
                    </div>
                </>}
            </nav>
        </header>
    )
}
