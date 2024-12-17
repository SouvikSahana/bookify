import React,{useState,useEffect} from 'react'
import db from "../firebase"
import {getDocs, collection, query, where} from "firebase/firestore"
import {useStateValue} from "../StateProvider"
import BookComponent from '../components/BookComponent'

const CreatedList = () => {
    const [state,dispatch]= useStateValue()
    const [books,setBooks]= useState([])
    const [loading,setLoading]= useState(true)
    const [refresh,setRefresh]= useState(false)

    const fetchData=async()=>{
        try{
            const q= query(collection(db,"books"),where('createdBy','==',state?.user?.email))
            const querySnapshot= await getDocs(q);
            const fetchedData= await querySnapshot.docs.map((doc)=>({
                id: doc.id,
                ... doc.data()
            }))
            setBooks(fetchedData)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        if(state?.user){
            fetchData()
        }
    },[refresh])
  return (
    <div className=' gap-2 p-2 max-w-[1300px] mx-auto flex flex-row flex-wrap justify-center pt-4 bg-black'>
    {books?.map((book)=>(
        <BookComponent key={book.id} id={book.id} image={book.image} name={book.title} author={book.author.join(", ")} isEdit={true} setRefresh={setRefresh} category={book?.category} />
    ))}
    {(!loading && books?.length==0) && <div className='text-xl mt-10 text-red-600'>
            You don't create any book yet.
        </div>
    }
</div>
  )
}

export default CreatedList