import React from 'react'
import Layout from './../../components/Layout';
import useCategory from '../../hooks/useCategory';
import { Link } from 'react-router-dom';
import styles from './user.module.css'
import UserMenue from './UserMenue';

const CategoriesUser = () => {
  const categories = useCategory()
  
  return (
    <Layout>
    <h2 className={styles.titleDashboardName}>Categories </h2>
       <UserMenue /> 
      {categories.map( c => (
        <Link to={c.slug} className={styles.category} key={c._id}>{c.name}</Link>
      ))}
    </Layout>
  )
}

export default CategoriesUser

