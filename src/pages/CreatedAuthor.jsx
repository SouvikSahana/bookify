import React,{useState,useEffect} from 'react'
import db from "../firebase"
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {getDocs, collection, query, where, doc,deleteDoc} from "firebase/firestore"
import {useStateValue} from "../StateProvider"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom"
import AlertPop from '../AlertPop'

const AuthorComponent=({id,name,image,bookCount,handleDelete})=>{
    const navigate=useNavigate()
    
    return(
        <div className='py-4 cursor-pointer p-2 bg-gray-900 rounded-md grow min-w-[200px] min-h-20 gap-1 justify-center flex flex-col'>
            <div>
                <img src={image} alt="author image" className='rounded-full w-[150px] h-[150px] mx-auto select-none object-cover' />
            </div>
            <div className='select-none'>
                <div className='text-sx font-medium text-center select-none  '>{name}</div>
                <div className='text-sm text-center flex justify-center items-center gap-2 select-none'><MenuBookIcon/><span className='text-red-500'>{bookCount}</span> Books</div>
            </div>
            <div className='justify-evenly mt-2 flex gap-2 bg-yellow-700 bg-opacity-50 p-2 rounded-md group-hover:bg-opacity-30 ease-in-out duration-300 ' >
            <DeleteForeverIcon onClick={()=>handleDelete(id)} sx={{color:'red', backgroundColor:'white',borderRadius:"50%",padding:"2px",cursor:'pointer',zIndex:'30'}}/>
            <EditIcon onClick={()=>navigate("/createauthor?isedit=true&id="+id)} sx={{color:'green', backgroundColor:'white',borderRadius:"50%",padding:"2px",cursor:'pointer',zIndex:'30'}}/>
            </div>
    </div>
    )
}

const CreatedAuthor = () => {
    const [state,dispatch]= useStateValue()
    const [authors,setAuthors]= useState([])
    const [loading,setLoading]= useState(true)
    const [refresh,setRefresh]= useState(false)

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

    const handleDelete= async(docId)=>{
        try{
            const isSure= confirm("Do you wanna delete this author?")
            if(isSure){
                const docRef= doc(db,"authors",docId)
                await deleteDoc(docRef)
                setRefresh((prev)=> !prev)
                showAlertFunction("Successfully deleted the author ","success")
            }
            
        }catch(error){
            console.log(error)
        }
    }

    const fetchData=async()=>{
        try{
            const q= query(collection(db,"authors"),where('createdBy','==',state?.user?.email))
            const querySnapshot= await getDocs(q);
            const fetchedData= await querySnapshot.docs.map((doc)=>({
                id: doc.id,
                ... doc.data()
            }))
            setAuthors(fetchedData)
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
    <div>
        <div className='center flex justify-center'> {alertVisible && <AlertPop message={msg} type={type}/>} </div>
   
        <div className=' gap-2 p-2 max-w-[1300px] mx-auto flex flex-row flex-wrap justify-center pt-4 bg-black'>
        {authors?.map((author)=>(
            <AuthorComponent key={author.id} id={author.id} name={author?.name} image={author?.image || "https://media.istockphoto.com/id/1288129985/vector/missing-image-of-a-person-placeholder.jpg?s=612x612&w=0&k=20&c=9kE777krx5mrFHsxx02v60ideRWvIgI1RWzR1X4MG2Y="} bookCount={author?.bookCount || 0} handleDelete={handleDelete} />
        ))}
        {(!loading && authors?.length==0) && <div className='text-xl mt-10 text-red-600'>
                You don't create any book yet.
            </div>
        }
    </div>
</div>
  )
}

export default CreatedAuthor