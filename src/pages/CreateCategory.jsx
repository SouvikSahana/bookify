import React,{useState,useEffect} from 'react'
// import ImageUploader from '../components/ImageUploader'
import {useNavigate} from "react-router-dom"
import AlertPop from '../AlertPop'
import db from "../firebase"
import {useStateValue} from "../StateProvider"
import { collection, addDoc, doc, getDoc,setDoc, getDocs, where, query } from 'firebase/firestore';

const CreateCategory = () => {
    const [state,dispatch]= useStateValue()

    const navigate= useNavigate()
    const [categoryName,setCategoryName]= useState("")

    const [isEdit,setIsEdit]= useState(false)
    const [id,setId]= useState(null)

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

      const fetchData= async(docId)=>{
            try{
                const docRef= doc(db,"categories",docId)
                const docSnap= await getDoc(docRef)
                if(docSnap.exists()){
                    setCategoryName(docSnap.data().categoryName)
                }else{
                    showAlertFunction("There is no Category with this ID","warning")
                    navigate("/createdauthor",{replace: true})
                }
            }catch(error){
                console.log(error)
                showAlertFunction("Error"+error,"warning")
            }
      }
      useEffect(()=>{
        if(id){
            fetchData(id)
        }
      },[id])
      useEffect(()=>{
        const url= new URL(window.location.href)
        if(url.searchParams.get("isedit")){
            setIsEdit(true)
            setId(url.searchParams.get("id"))
        }
      },[window.location])
    const createHandle=async(e)=>{
        e.preventDefault();
        try{
           if(!categoryName){
            showAlertFunction("Please fill Category Name","warning");
           }

            if(isEdit){
                const docRef= doc(db,'categories',id)
                await setDoc(docRef,{
                    categoryName: categoryName?.trim().toLowerCase()
                },{merge: true})

                navigate("/createdcategory",{replace:true})
            }else{
                const q= query(collection(db,"categories"),where("categoryName","==",categoryName?.trim().toLowerCase()))
                const getSnap=await getDocs(q)
                const getData= await getSnap.docs.map((doc)=>({
                    id: doc.id,
                    ... doc.data()
                }))
                if(getData.length>0){
                    showAlertFunction("Already data exists","warning")
                }else{
                    const docRef= await addDoc(collection(db,"categories"),{
                        categoryName: categoryName?.trim().toLowerCase(),
                       createdBy: state?.user?.email,
                       timestamp: new Date() 
                    })
                    navigate("/createdcategory",{replace:true})
                }
                
            }
            // console.log(await docRef.id)
            
        }catch(error){
            console.log(error)
        }
    }
  return (
    <div className='p-2'>
         <div className='center flex justify-center'> {alertVisible && <AlertPop message={msg} type={type}/>} </div>
        <div className='text-center text-xl mt-4'>
            {/* <ImageUploader image={image} setImage={setImage} /> */}
            {/* because of firebase storage plan */}
            Create Category
        </div>
        <div className='p-2 flex flex-col gap-2 max-w-[700px] mx-auto'>
            <div className='flex flex-col gap-1'>
                <label htmlFor="categoryName">Category Name : </label>
                <input value={categoryName} onChange={(e)=>setCategoryName(e.target.value)} type="text" name="categoryName" id="categoryName" className='h-10 outline-none bg-gray-700 text-white p-1 px-2 rounded-md' />
            </div>
        </div>
        <div className='flex flex-row gap-4 justify-center mt-10'>
            <button className='bg-red-500 p-2 rounded-md min-w-20' onClick={()=> navigate(-1)} >Cancel</button>
            <button className='bg-green-500 p-2 rounded-md min-w-20' onClick={createHandle} >{isEdit?"Edit":"Save"}</button>
        </div>
    </div>
  )
}

export default CreateCategory