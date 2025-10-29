import router from "next/router"


export const useUser = () => {
    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        window.location.href='/login'
    }
    const data = localStorage.getItem('user')
    let user
    if(data) {
        user = JSON.parse(data)
    }
    return {user, logout}
}