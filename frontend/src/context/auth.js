import { useEffect , useContext , useState , createContext } from 'react';
import axios from 'axios';
const AuthContext = createContext()

const AuthProvider = ({children} ) => {
    const [auth , setAuth] = useState({existingUser : null , token : ''})

    axios.defaults.headers.common["Authorization" ] = auth?.token
    useEffect ( () => {
        const data = localStorage.getItem('auth')
        if(data) {
            const parseData = JSON.parse(data)
            setAuth({...auth , existingUser : parseData.existingUser , token : parseData.token})
        }
    } , [])
    return (
        <AuthContext.Provider value={[auth , setAuth]}>
            {children}
        </AuthContext.Provider>
    )

}

// hooks
const useAuth = () => useContext(AuthContext)

export { useAuth , AuthProvider } 