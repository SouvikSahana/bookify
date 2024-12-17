import React,{useState,useEffect,useMemo} from 'react'
import BookComponent from '../components/BookComponent'
import {getDocs, collection,query,doc,where} from "firebase/firestore"
import db from "../firebase"
import SearchIcon from '@mui/icons-material/Search';

const BookList = () => {
    const [books,setBooks]= useState([])
    const [backUpBooks,setBackUpBooks]= useState([])
    const [search,setSearch]= useState("")

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'books'));
            const fetchedData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBooks(fetchedData);
            setBackUpBooks(fetchedData);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        } 
    };
    const fetchFilterData=async(attr,value)=>{
        try{
            const q= query(collection(db,"books"),where(attr,"array-contains",value))
            const querySnapshot= await getDocs(q)
            const fetchedData= await querySnapshot.docs.map((doc)=>({
                id: doc.id,
                ... doc.data()
            }))
            // console.log(fetchedData)
            setBooks(fetchedData)
            setBackUpBooks(fetchedData);
        }catch(error){
            console.log("Error in fetching documents: ",error)
        }
    }
    useEffect(()=>{
        if(search.length>0){
            const filteredData= backUpBooks.filter((book)=>{
                const total= book.title.toLowerCase()+ book.author.join(", ").toLowerCase()+ book.category.join(", ").toLowerCase()
                console.log(total.search(search.toLowerCase()))
                return(
                    total.search(search.toLowerCase())>=0
                )
            })
            setBooks([...filteredData])
        }else{
            setBooks([...backUpBooks])
        }
    },[search])

    useEffect(()=>{
        const url= new URL(window.location.href)
        if(url.searchParams.get("isFilter")){
            if(url.searchParams.get("category")){
                fetchFilterData("category",url.searchParams.get("category"))
            }else if(url.searchParams.get("author")){
                fetchFilterData("author",url.searchParams.get("author"))
            }
        }else{
            fetchData()
        }
    },[window.location.href])


  return (
    <div className='p-2'>
        <div className='bg-gray-700 my-2  p-2 rounded-xl flex items-center max-w-[500px] mx-auto'>
            <label htmlFor='search'><SearchIcon sx={{opacity:0.8}} /></label>
            <input value={search} onChange={(e)=> setSearch(e.target.value)} type='text' id='search' name='search' className='border-none outline-none px-1 bg-inherit w-full' />
        </div>
    <div className=' gap-2  max-w-[1300px] mx-auto flex flex-row flex-wrap justify-center pt-2 bg-black'>
        {/* have to configure for better re-rendering , otherwise it will load all data when likes & bookmarks operation perform */}
        {books?.map((book)=>(
            <BookComponent key={book?.id} id={book?.id} image={book?.image} name={book?.title} author={book?.author?.join(", ")} likesCount={book?.likesCount} bookmarksCount={book?.bookmarksCount} />
        ))}
    </div>
    </div>
  )
}

export default BookList