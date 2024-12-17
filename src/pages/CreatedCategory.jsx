import React,{useState,useEffect} from 'react'
import db from "../firebase"
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {getDocs, collection, query, where, doc,deleteDoc} from "firebase/firestore"
import {useStateValue} from "../StateProvider"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom"
import AlertPop from '../AlertPop'

const CategoryComponent=({id,category,count, handleDelete})=>{
    const navigate= useNavigate()
    return(
        <div className='rounded-md bg-slate-400'>
            <div className='hover:bg-blue-500 cursor-pointer p-2 bg-slate-700 rounded-t-md grow min-w-[200px] min-h-20 gap-1 justify-center flex flex-col'>
                <div className='text-sx font-medium text-center select-none  '>{category}</div>
                <div className='text-sm text-center flex justify-center items-center gap-2 select-none'><MenuBookIcon/><span className='text-red-500'>{count}</span> Books</div>    
            </div>

            <div className='justify-evenly mt-0 flex gap-2 bg-yellow-700 bg-opacity-50 p-1 rounded-b-md group-hover:bg-opacity-30 ease-in-out duration-300 ' >
                <DeleteForeverIcon onClick={()=>handleDelete(id)} sx={{color:'red', backgroundColor:'white',borderRadius:"50%",padding:"2px",cursor:'pointer',zIndex:'30'}}/>
                <EditIcon onClick={()=>navigate("/createcategory?isedit=true&id="+id)} sx={{color:'green', backgroundColor:'white',borderRadius:"50%",padding:"2px",cursor:'pointer',zIndex:'30'}}/>
            </div>
    </div>
    )
}

const CreatedCategory = () => {
    const [state,dispatch]= useStateValue()
    const [categories,setCategories]= useState([])
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
            const isSure= confirm("Do you wanna delete this category?")
            if(isSure){
                const docRef= doc(db,"categories",docId)
                await deleteDoc(docRef)
                setRefresh((prev)=> !prev)
                showAlertFunction("Successfully deleted the Category ","success")
            }
            
        }catch(error){
            console.log(error)
        }
    }

    const fetchData=async()=>{
        try{
            const q= query(collection(db,"categories"),where('createdBy','==',state?.user?.email))
            const querySnapshot= await getDocs(q);
            const fetchedData= await querySnapshot.docs.map((doc)=>({
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
        if(state?.user){
            fetchData()
        }
    },[refresh])
  return (
    <div>
        <div className='center flex justify-center'> {alertVisible && <AlertPop message={msg} type={type}/>} </div>
   
        <div className=' gap-2 p-2 max-w-[1300px] mx-auto flex flex-row flex-wrap justify-center pt-4 bg-black'>
        {categories?.map((category)=>(
            <CategoryComponent key={category.id} id={category.id} category={category.categoryName} count={category?.count || 0} handleDelete={handleDelete} />
        ))}
        {(!loading && categories?.length==0) && <div className='text-xl mt-10 text-red-600'>
                You don't create any category yet.
            </div>
        }
    </div>
</div>
  )
}

export default CreatedCategory