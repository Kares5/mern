import { useEffect, useState } from "react";
import axios from "axios";

export default function useCategory () {
    const [categories , setCategories] = useState([])
    // get the category
    const getCategories = async () => {
        try {
            const {data} = await axios.get('https://react-test-0lkd.onrender.com/api/category/get-category')
            setCategories(data.category)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect( () => {
        getCategories()
    } , [])
    return categories
}