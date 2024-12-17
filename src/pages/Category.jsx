import React,{useState, useEffect} from 'react'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import db from "../firebase"
import {getDocs, collection} from "firebase/firestore"
import {useNavigate} from "react-router-dom"

const CategoryComponent=({type,count})=>{
    const navigate= useNavigate()
    const handleNavigate=()=>{
        try{
            if(count>0){
                navigate("/?isFilter=true&category="+type)
            }
        }catch(error){
            console.log(error)
        }
    }
    return(
        <div onClick={handleNavigate}  className={count>0?'hover:bg-blue-500 cursor-pointer p-2 bg-slate-700 rounded-md grow min-w-[200px] min-h-20 gap-1 justify-center flex flex-col':"cursor-not-allowed bg-slate-700 rounded-md grow min-w-[200px] min-h-20 gap-1 justify-center flex flex-col"}>
            <div className='text-sx font-medium text-center select-none  '>{type}</div>
            <div className='text-sm text-center flex justify-center items-center gap-2 select-none'><MenuBookIcon/><span className='text-red-500'>{count}</span> Books</div>
    </div>
    )
}
const Category = () => {
    const [ categories,setCategories]= useState([])
    const [loading,setLoading]= useState(true)

    const fetchData=async()=>{
        try{
            const docRef= getDocs(collection(db,"categories"))
            const fetchedData= (await docRef)?.docs?.map((doc)=>({
                id: doc.id,
                ... doc.data()
            }))
            setCategories(fetchedData)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
  return (
    <div>
        <div className='text-center font-bold text-xl p-2 select-none'>Categories</div>
        <div className=' gap-2 p-2 max-w-[1300px] mx-auto flex flex-row flex-wrap justify-center  bg-black'>
            {categories?.map((category)=>{
                return  <CategoryComponent key={category.id} id={category.id} type={category.categoryName} count={category?.count || 0}/>
            })}
        </div>

        {(!loading && categories?.length==0) && <div className='text-xl mt-10 text-red-600'>
                No Categories Present.
            </div>
        }
    </div>
  )
}

export default Category