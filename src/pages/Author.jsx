import React, {useEffect, useState} from 'react'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import db from "../firebase"
import {getDocs,collection} from "firebase/firestore"
import {useNavigate} from "react-router-dom"

const AuthorComponent=({name,image,bookCount})=>{
    const navigate= useNavigate()
    const handleNavigate=()=>{
        try{
            if(bookCount>0){
                navigate("/?isFilter=true&author="+name)
            }
        }catch(error){
            console.log(error)
        }
    }
    return(
        <div  onClick={handleNavigate} className={bookCount>0?'py-4 hover:bg-blue-500 cursor-pointer p-2 bg-gray-900 rounded-md grow min-w-[200px] min-h-20 gap-1 justify-center flex flex-col':'py-4 cursor-not-allowed p-2 bg-gray-900 rounded-md grow min-w-[200px] min-h-20 gap-1 justify-center flex flex-col'}>
            <div>
                <img src={image} alt="author image" className='rounded-full w-[150px] h-[150px] mx-auto select-none object-cover' />
            </div>
            <div className='select-none'>
                <div className='text-sx font-medium text-center select-none  '>{name}</div>
                <div className='text-sm text-center flex justify-center items-center gap-2 select-none'><MenuBookIcon/><span className='text-red-500'>{bookCount}</span> Books</div>
            </div>
    </div>
    )
}
const Author = () => {
    const [authors,setAuthors]= useState([])

    const fetchData=async()=>{
        try{
            const docSnap= getDocs(collection(db,"authors"))
            const fetchedData= (await docSnap).docs.map((doc)=>({
                id: doc.id,
                ... doc.data()
            }))
            setAuthors(fetchedData)
        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
  return (
    <div>
        <div className='text-center font-bold text-xl p-2 select-none'>Authors</div>
        <div className=' gap-2 p-2 max-w-[1300px] mx-auto flex flex-row flex-wrap justify-center  bg-black'>
            {authors?.map((author)=>{
                return <AuthorComponent key={author.id} id={author.id} name={author?.name} image={author?.image ||"https://media.istockphoto.com/id/1288129985/vector/missing-image-of-a-person-placeholder.jpg?s=612x612&w=0&k=20&c=9kE777krx5mrFHsxx02v60ideRWvIgI1RWzR1X4MG2Y="} bookCount={author?.bookCount|| 0} />
            })}
        </div>
    </div>
  )
}

export default Author