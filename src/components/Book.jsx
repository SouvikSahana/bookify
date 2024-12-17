import React, {useState,useEffect} from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import db from "../firebase"
import {doc,getDoc,collection,setDoc,where,query,getDocs} from "firebase/firestore"
import {useStateValue} from "../StateProvider"
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {capitalize} from "../reducer"

const Book = () => {
  const [book,setBook]= useState({})
  const [state,dispatch] = useStateValue()
  const [id,setId]= useState("")
  const [loading,setLoading]= useState(true)
  const [isLiked,setIsLiked]= useState(false)
  const [isBookmarked,setIsBookmarked]= useState(false)

  const [likes,setLikes]= useState(0)
  const [bookmarks,setBookmarks]= useState(0)

  const fetchData=async(docId)=>{
    try{
      setLoading(true)
      const docRef= doc(db,"books",docId)
      const docSnap= await getDoc(docRef)
      if(docSnap.exists()){
        setBook(docSnap.data())
        setLikes(docSnap.data()?.likesCount||0)
        setBookmarks(docSnap.data()?.bookmarksCount || 0)
      }
    }catch(error){
      console.log(error)
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    if(id){
      fetchData(id)
    }
  },[id])
  
  useEffect(()=>{
    const url= new URL(window.location.href)
    const arr=url.pathname.split("/")
    if(arr[arr.length-1]){
        setId(arr[arr.length-1])
    }
  },[window.location])

  //validation for likes
  useEffect(()=>{
    if(state?.likes && id){
      setIsLiked(state?.likes?.includes(id))
    }
    if(state?.bookmarks){
      setIsBookmarked(state?.bookmarks?.includes(id))
    }
  },[book])

  const handleLike=async()=>{
    try{
      const q=await query(collection(db,"users"),where("email","==",state?.user?.email))
      const snapShot= await getDocs(q)
      let  userData= await snapShot.docs.map((doc)=>({
        id: doc.id,
        ... doc.data()
      }))

      if(isLiked){
        const updatedArr= state?.likes.filter((like)=>like!==id)
        dispatch({TYPE:"SET_LIKES",payload:updatedArr})
        const docRef = doc(db, 'users', userData[0].id);
        await setDoc(docRef,{likes: updatedArr},{merge:true})
        
        const bookDocRef= doc(db,"books",id)
        await setDoc(bookDocRef,{likesCount:(likes-1)>0?(likes-1):0},{merge: true})
        setLikes((prev)=>(prev-1)>0?(prev-1):0)
      }else{
        const updatedArr= [...state?.likes,id]
        dispatch({TYPE:"SET_LIKES",payload:updatedArr})
        if(userData?.length>0){
          const docRef = doc(db, 'users', userData[0].id);
            await setDoc(docRef,{likes: updatedArr},{merge:true})
        }else{
          await addDoc(collection(db,"users"),{
            email: state?.user?.email,
            likes: updatedArr
          })
        }
        const bookDocRef= doc(db,"books",id)
        // console.log("Click")
        await setDoc(bookDocRef,{likesCount: likes+1},{merge: true})
        setLikes((prev)=>prev+1)
      }
      setIsLiked((prev)=>!prev)

    }catch(error){
      console.log(error)
    }
  }

  const handleBookmark=async()=>{
    try{
      const q=await query(collection(db,"users"),where("email","==",state?.user?.email))
      const snapShot= await getDocs(q)
      let  userData= await snapShot.docs.map((doc)=>({
        id: doc.id,
        ... doc.data()
      }))

      if(isBookmarked){
        const updatedArr= state?.bookmarks.filter((bookmark)=>bookmark!==id)
        dispatch({TYPE:"SET_BOOKMARKS",payload:updatedArr})
        const docRef = doc(db, 'users', userData[0].id);
        await setDoc(docRef,{bookmarks: updatedArr},{merge:true})
        
        const bookDocRef= doc(db,"books",id)
        await setDoc(bookDocRef,{bookmarksCount:(bookmarks-1)>0?(bookmarks-1):0},{merge: true})
        setBookmarks((prev)=>(prev-1)>0?(prev-1):0)
        // console.log("bookmarked")
      }else{
        const updatedArr= [...state?.bookmarks,id]
        // console.log(state)
        dispatch({TYPE:"SET_BOOKMARKS",payload:updatedArr})
        if(userData?.length>0){
          const docRef = doc(db, 'users', userData[0].id);
            await setDoc(docRef,{bookmarks: updatedArr},{merge:true})
        }else{
          await addDoc(collection(db,"users"),{
            email: state?.user?.email,
            bookmarks: updatedArr
          })
        }
        const bookDocRef= doc(db,"books",id)
        // console.log("Click")
        await setDoc(bookDocRef,{bookmarksCount: bookmarks+1},{merge: true})
        setBookmarks((prev)=>prev+1)
      }
      setIsBookmarked((prev)=>!prev)

    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className='p-2 bg-black'>
        {loading && <div className='pt-4 px-2 max-w-[1000px] mx-auto'>
        <Stack spacing={1} sx={{zIndex:10}} >
          {/* For variant="text", adjust the height via font-size */}
          <div className='flex gap-3 flex-col'>
          <Skeleton variant="rounded" width={310} height={400} sx={{backgroundColor:"gray",marginRight:"auto",marginLeft:"auto"}} />
          <Skeleton variant="rounded" width={210} height={40} sx={{ marginRight:"auto",marginLeft:"auto",backgroundColor:"gray" }} />
          <Skeleton variant="rounded" width={210} height={30} sx={{ marginRight:"auto",marginLeft:"auto",backgroundColor:"gray" }} />

          <Skeleton variant="rounded" width={"100%"} height={40} sx={{ marginRight:"auto",marginLeft:"auto",backgroundColor:"gray" }} />
          <Skeleton variant="rounded" width={"100%"} height={40} sx={{ marginRight:"auto",marginLeft:"auto",backgroundColor:"gray" }} />
          <Skeleton variant="rounded" width={"100%"} height={120} sx={{ marginRight:"auto",marginLeft:"auto",backgroundColor:"gray" }} />
          </div>
      </Stack>
      </div>}
      { !loading && <div>
          <div>
              <img src={book?.image} alt=""  className='max-h-auto max-w-[300px] mx-auto'/>
          </div>
          <div className='pt-4 px-2 max-w-[1000px] mx-auto'>
              <div className='text-2xl text-center'>{capitalize(book?.title)}</div>
              <div className='px-2 flex gap-4 justify-center rounded-md py-1 mx-2 mt-2 '>
                <span className=''><FavoriteIcon onClick={handleLike}  sx={{color:isLiked?"red":"white", cursor:"pointer"}}/> {likes} people</span>
               <span><BookmarkIcon onClick={handleBookmark} sx={{color:isBookmarked?"green":"white",cursor:'pointer'}}/> {bookmarks} people</span></div>

              <div className='px-2 bg-gray-600 rounded-md py-1 mx-2 mt-2 '><span className='text-xs text-blue-300'>Written By:</span> <span>{capitalize(book?.author?.join(", "))}</span></div>
              <div className='px-2 bg-gray-600 rounded-md py-1 mx-2 mt-2 '><span className='text-xs text-blue-300'>Category:</span> <span>{capitalize(book?.category?.join(", "))}</span></div>
              <div className='px-2 bg-gray-600 rounded-md py-1 mx-2 mt-2 '><span className='text-xs text-blue-300'>Description:</span> <span>{book?.description}</span></div>
          </div>
          <div className='text-xs text-start mt-2 px-4'>
              created by <span className='text-purple-600'>{book?.createdBy}{state?.user?.email==book?.createdBy && " (You)"}</span>
          </div>
        </div>}
    </div>
  )
}

export default Book