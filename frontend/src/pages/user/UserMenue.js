import React, { useState } from 'react'
import { useAuth } from '../../context/auth'
import styles from './user.module.css'
import { Link } from 'react-router-dom';

const UserMenue = () => {
    const [auth] = useAuth()
    const [toggel , setToggel] = useState(false)
  return (
    <div className={styles.containeruserMenu}>
      <h3 className={styles.titleDashboard} onClick={() => setToggel(!toggel)} >
      Dashboard
        <i className='bi bi-arrow-down-short'></i>
      </h3>
      <div className={styles.menue} style={{ display : toggel && 'block'}}>
        <Link  to='/dashboard/user/profile'>Profile</Link>
        <Link to='/dashboard/user/orders'>Orders</Link>
        <Link  to='/dashboard/user/categories'>  All Categories</Link>
      </div>
    </div>
  )
}

export default UserMenue
