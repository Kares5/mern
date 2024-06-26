import  { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import {Outlet} from 'react-router-dom'


export default function PrivateRoute () {
    const [ok , setOk] = useState(false)
    const [auth , setAuth] = useAuth()
    useEffect(() => {
        const authCheck = async() => {
            const res = await axios.get('https://react-test-0lkd.onrender.com/api/auth/user-auth')
            if(res.data.ok) {
                setOk(true)
            }else{
                setOk(false)
            }
        }
        if(auth?.token) authCheck() 
    } , [auth?.token])
  return ok ? <Outlet /> : 'You Should Login First'}


