import React,{useState,useEffect} from 'react'
import BookComponent from '../components/BookComponent'
import {getDocs, collection,query,doc,where,documentId} from "firebase/firestore"
import db from "../firebase"
import {useStateValue} from "../StateProvider"

const Library = () => {
    const [books,setBooks]= useState([])
    const [state,dispatch]= useStateValue()

    const fetchData = async () => {
        try {
            const q= query(collection(db,"books"),where(documentId(),"in",state?.bookmarks))
            const querySnapshot= await getDocs(q)
            const fetchedData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBooks(fetchedData);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        } 
    };
   
    useEffect(()=>{
        if(state?.bookmarks.length>0){
            fetchData()
        }else{
            setBooks([])
        }
    },[state?.bookmarks])
  return (
    <div className=' gap-2 p-2 max-w-[1300px] mx-auto flex flex-row flex-wrap justify-center pt-4 bg-black'>
        {books?.map((book)=>(
            <BookComponent key={book?.id} id={book?.id} image={book?.image} name={book?.title} author={book?.author?.join(", ")} likesCount={book?.likesCount} bookmarksCount={book?.bookmarksCount} />
        ))}

        <div>
            {state?.bookmarks?.length==0 && <div className='text-xl'>No books present at your Library</div>}
        </div>
    </div>
  )
}

export default Library