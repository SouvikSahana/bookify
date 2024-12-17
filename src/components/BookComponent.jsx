import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom"
import AlertPop from '../AlertPop'
import db from "../firebase"
import {doc, deleteDoc,getDocs,setDoc,collection, query, where, addDoc} from "firebase/firestore"
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useStateValue} from "../StateProvider"
import {capitalize} from "../reducer"

const BookComponent = ({id,name,image,author,isEdit,setRefresh,category,likesCount, bookmarksCount}) => {
  const navigate= useNavigate()
  const [state,dispatch]= useStateValue()

  const [authors,setAuthors] = useState([])
  const [categories,setCategories]= useState([])
  const [isLiked,setIsLiked]= useState(false)
  
  //validation for likes
useEffect(()=>{
  if(state?.likes){
    setIsLiked(state?.likes?.includes(id))
  }
},[])

  const [msg,setMsg]=useState("")
    const [type,setType]=useState("success")
    const [alertVisible, setAlertVisible] = useState(false);
    const showAlertFunction = (msg,type) => {
        setAlertVisible(true);
        setType(type)
        setMsg(msg)
        setTimeout(() => {
          setAlertVisible(false);
        }, 2000);
      };

      const loadDataArray=async()=>{
        try{
            const authorDocSnap=await getDocs(collection(db,"authors"))
            const fetchedAuthor=  authorDocSnap?.docs?.map((doc)=>({
                id: doc.id,
                ... doc.data()
            }))
            setAuthors(fetchedAuthor)
            const categoryDocSnap= await getDocs(collection(db,"categories"))
            const fetchedCategory= categoryDocSnap?.docs?.map((doc)=>({
                id: doc.id,
                ... doc.data()
            }))
            setCategories(fetchedCategory)
        }catch(error){
            console.log(error)
        }
      }
      useEffect(()=>{
        loadDataArray()
      },[])

  const handleDelete= async()=>{
    try{
      const isSure= confirm("Do you really wanna delete this Book?")
      if(isSure){
        const arrAuthor= author.split(",").map((item)=>item.trim())
        //remove count from authors & categories
        for(let i=0;i<arrAuthor.length;i++){
          const isPresent= authors.filter((item)=>item.name ==arrAuthor[i])
          if(isPresent.length>0){
              const docRef= doc(db,"authors",isPresent[0].id)
              try{
                  const count= (isPresent[0].bookCount-1)>=0? (isPresent[0].bookCount-1):0
                  await setDoc(docRef,{bookCount: count},{merge: true})
              }catch(error){
                  console.log(error)
              }
          }
      }
      for(let i=0;i<category.length;i++){
          const isPresent= categories.filter((item)=>item.categoryName ==category[i])
          if(isPresent.length>0){
              const docRef= doc(db,"categories",isPresent[0].id)
              try{
                  const count= (isPresent[0].count-1)>=0? (isPresent[0].count-1):0
                  await setDoc(docRef,{count: count},{merge: true})
              }catch(error){
                  console.log(error)
              }
          }
      }

        const docRef= doc(db,"books",id)
        await deleteDoc(docRef)
        showAlertFunction("Item deleted","success")
        setRefresh((prev)=>!prev)
      }
      
    }catch(error){
      console.log(error)
    }
  }

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
        await setDoc(bookDocRef,{likesCount:likesCount?(likesCount-1>0?(likesCount-1):0):0},{merge: true})
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
        await setDoc(bookDocRef,{likesCount:likesCount?likesCount+1:1},{merge: true})
      }
      setIsLiked((prev)=>!prev)

    }catch(error){
      console.log(error)
    }
  }

  // console.log("hi")
  return (
    <div className='relative overflow-hidden group'>
      <div className='center flex justify-center'> {alertVisible && <AlertPop message={msg} type={type}/>} </div>
    <Link to={"/book/"+id+"?name="+name+"&author="+author} className=''>
    <div className=' cursor-pointer flex-1  p-2 bg-slate-800 rounded-md grow max-w-[200px] min-w-[190px] flex flex-col justify-between h-full'>
        <img src={image} alt=""  className='max-h-40 max-w-30 mx-auto pt-2'/>
        <div className='flex-1 flex justify-evenly flex-col'>
            <div className='text-sx font-medium text-center'>{capitalize(name)}</div>
            <div className='text-sm text-center'><span className='italic'>by</span> <span className='text-blue-500'>{capitalize(author)} </span></div>
        </div>
    </div>
    </Link>

    {
      (state?.user && !isEdit) && <div className=' absolute top-2 right-2 cursor-pointer z-50'><FavoriteIcon onClick={handleLike} sx={{color:state?.likes?.includes(id)?"red":"white"}} /> </div>
    }
    
    {isEdit && <div className='absolute top-0 w-full px-2'>
          {isEdit && <div className='justify-evenly mt-2 flex gap-2 bg-yellow-700 bg-opacity-50 p-2 rounded-md group-hover:bg-opacity-30 ease-in-out duration-300 ' >
            <DeleteForeverIcon onClick={handleDelete} sx={{color:'red', backgroundColor:'white',borderRadius:"50%",padding:"2px",cursor:'pointer',zIndex:'30'}}/>
            <EditIcon onClick={()=>navigate("/createbook?isedit=true&id="+id)} sx={{color:'green', backgroundColor:'white',borderRadius:"50%",padding:"2px",cursor:'pointer',zIndex:'30'}}/>
            </div>}
        </div>}
    </div>
  )
}

export default BookComponent