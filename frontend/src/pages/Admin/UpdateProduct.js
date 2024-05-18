
import React, { useEffect, useState } from 'react'
import Layout from './../../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './admin.module.css'

const UpdateProduct = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [categories, setCategories] = useState([])
    const [name , setName] = useState('')
    const [description , setDescription] = useState('')
    const [price , setPrice] = useState('')
    const [category , setCategory] = useState('')
    const [quantity , setQuantity] = useState('')
    const [shipping , setShipping] = useState('')
    const [photo , setPhoto] = useState('')
    const [id , setId] = useState('')

    // get single product
    const getSingleProduct = async () => {

        try {
          const {data} = await axios.get(`https://react-test-0lkd.onrender.com/api/product/get-product/${params.slug}`)

            setName(data.product.name)
            setId(data.product._id)
            setDescription(data.product.description)
            setPrice(data.product.price)
            setQuantity(data.product.quantity)
            setShipping(data.product.shipping)
            setCategory(data.product.category._id)

            
        } catch (error) {
            console.log(error)
        }
    }
    useEffect ( () => {
        getSingleProduct()
    }, [])

    const getCategories = async () => {
        try {
          const {data} = await axios.get('https://react-test-0lkd.onrender.com/api/category/get-category')
            setCategories(data.category)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while getting categories");
        }
    }
    useEffect( () => {
        getCategories()
    })
    // update
    const handleUpdate = async(e) => {
        e.preventDefault()
        try {
            const productData = new FormData()
            productData.append('name' , name)
            productData.append('description' , description)
            productData.append('price' , price)
            productData.append('quantity' , quantity)
            productData.append('photo' , photo)
            productData.append('category' , category)
            productData.append('shipping' , shipping)

            const {data} = axios.put(`https://react-test-0lkd.onrender.com/api/product/update-product/${id}` , productData)
            if(data?.success) {
                toast.error(data?.message)
              }else{
                toast.success("Product Updated Successfully")  
                navigate('/dashboard/admin/products')
              }
            
        } catch (error) {
            console.log(error)
            toast.error('something went wrong')
        }
    }
    const deleteProduct = async() => {
        try {
            let answer = window.prompt('Are You sure You want to delete')
            if(!answer) return
        const {data} = await axios.delete(`https://react-test-0lkd.onrender.com/api/product/delete-product/${id}`)
            toast.success("Product Deleted Successfully") 
            navigate('/dashboard/admin/products')            
        } catch (error) {
            console.log(error)
            toast.error('something went wrong')
        }
    }
    

  return (
    <Layout>
    <div className={styles.createProductForm}>
    <label >
      {photo ? photo.name : "Upload Photo"}  
     <input type='file' name='photo' accept='image/*' onChange={ (e) =>setPhoto(e.target.files[0])} />
    </label>
    {photo ? (
      <img src={URL.createObjectURL(photo)} alt='product' height={'200px'}  />
      ) : (
        <img alt='product' height={'200px'} src={`https://react-test-0lkd.onrender.com/api/product/product-photo/${id}`}/>
      )}
      
     <div className={styles.productFormBody}>
        <div className={styles.fieldProduct}>
          <input type='text' value={name} onChange={ (e) => setName(e.target.value)} placeholder='name'/>
        </div>
        <div className={styles.fieldProduct}>
          <textarea type='text' value={description} placeholder=' description' onChange={(e) =>setDescription(e.target.value) }/>
        </div>

        <div className={styles.fieldProduct}>
          <input type='number' value={price} placeholder='Price' onChange={(e) =>setPrice(e.target.value) }/>
        </div>

        <div className={styles.fieldProduct}>
          <input type='number' value={quantity} placeholder='Quantity' onChange={(e) =>setQuantity(e.target.value) }/>
        </div>

        
        <div  className={styles.fieldProduct}>
          <select className={styles.fieldProduct}  onChange={(e) => setCategory(e.target.value)} value={category}>
          {categories.map( (c) => (
            <option  key={c._id} value={c._id}>
            {c.name}
            </option>
          ))}

        </select>
        </div>
        
        <div className={styles.fieldProduct} >
          <input placeholder='Is Shipping' type='text' value={shipping} onChange={(e) => setShipping(e.target.value)}/>
        </div>
        
        <div className={styles.fieldProduct} >
          <button onClick={handleUpdate}> Update Product</button>
          <button onClick={deleteProduct}>Delete Product</button>
        </div>
       
     </div>
    </div>
    </Layout>
  )
}

export default UpdateProduct
