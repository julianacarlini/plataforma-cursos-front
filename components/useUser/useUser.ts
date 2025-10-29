'use client'

import { api } from "@/app/apiClient"

export const useUser = () => {
    const logout = () => {
        localStorage?.removeItem('user')
        localStorage?.removeItem('access_token')
        window.location.href = '/login'
    }

    const data = localStorage?.getItem('user')
    let user
    if (data) {
        user = JSON.parse(data)
    }

    const refresh = async () => {
        try {
            const me = await api('/api/auth/me')
            localStorage?.setItem('user', JSON.stringify(me))
            return me
        } catch {
            localStorage?.removeItem('user')
            return null
        }
    }

    const login = async (token: string) => {
        localStorage?.setItem('access_token', token)
        const me = await refresh()
        return me
    }

    const loading = false

    return { user, logout, refresh, login, loading }
}