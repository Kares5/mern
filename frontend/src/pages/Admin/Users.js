import React, { Fragment, useEffect, useState } from 'react'
import Layout from './../../components/Layout';
import AdminMunue from './AdminMunue';
import { toast } from 'react-toastify';
import axios from 'axios';
import styles from './admin.module.css'

const Users = () => {
    const [users , setUsers] = useState([])
    const [search , setSearch] = useState('')
    
    // get all users
    const getAllUsers =async () => {
        try {
          const {data} = await axios.get('http://localhost:5000/api/auth/all-user') 
        //   users from back end
          setUsers(data.users) 
        } catch (error) {
            console.log(error);
            toast.error("Someething Went Wrong"); 
        }
    }
    useEffect( () => {
        getAllUsers()
    } , [])
    const deleteHandler =async (userId) => {
        try {
            const {data} = await axios.delete(`http://localhost:5000/api/auth/${userId}`)
            if(data.success) {
                toast.success(data.message)
                window.location.reload()
            }else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong ");
        }
    }

  return (
    <Layout>
    <h2 className={styles.titleDashboardName}>All Users</h2>
        <AdminMunue />
        <div className={styles.cotainerTaple}>
        <span className={styles.noteResponsive}>Please rotate Your mopile or open your tap or laptop or pc to see this table perfectly</span>
        <input className={styles.search} value={search} onChange={e => setSearch (e.target.value)} placeholder='Search name...'/>
        <table >
        <thead>
          <tr>
            <th >NAME</th>
            <th >EMAIL</th>
            <th >Address</th>
            <th >Phone</th>
            <th >Role</th>
            <th >Delete</th>
          </tr>
        </thead>
        <tbody>
        {users.filter( (user) => user.name.toLowerCase().includes(search)).map((user) => 
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
                {user.role === 1 ? (
                    <td>Admin</td>
                ): (
                    <td>Client</td>
                )}
                <td>
                    <i onClick={() => {deleteHandler(user._id)}} class="bi bi-trash">
                    </i>
                </td>
            </tr>
            
        )}
        </tbody>
        </table> 
            <h4 className={styles.countUser}>we have {users.length} of user </h4>
        </div>
    </Layout>
  )
}

export default Users
