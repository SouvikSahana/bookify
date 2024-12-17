import React,{useState,useEffect} from 'react'
// import ImageUploader from '../components/ImageUploader'
import {useNavigate} from "react-router-dom"
import AlertPop from '../AlertPop'
import db from "../firebase"
import {useStateValue} from "../StateProvider"
import { collection, addDoc, doc, getDoc,setDoc,where,query, getDocs } from 'firebase/firestore';

const CreateAuthor = () => {
    const [state,dispatch]= useStateValue()

    const navigate= useNavigate()
    const [name,setName]= useState("")
    const [image,setImage]= useState(null)

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
                const docRef= doc(db,"authors",docId)
                const docSnap= await getDoc(docRef)
                if(docSnap.exists()){
                    setName(docSnap.data()?.name)
                    setImage(docSnap.data()?.image)
                }else{
                    showAlertFunction("There is no Author with this ID","warning")
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
           if(!name){
            showAlertFunction("Please fill Author Name","warning");
           }else if(!image){
                showAlertFunction("Please upload an Image","warning")
            }

            if(isEdit){
                const docRef= doc(db,'authors',id)
                await setDoc(docRef,{
                    name: name?.trim().toLowerCase()
                    , image: image?.trim() 
                },{merge: true})

                navigate("/createdauthor",{replace:true})
            }else{
                const q= query(collection(db,"authors"),where("name","==",name?.trim().toLowerCase()))
                const getSnap=await getDocs(q)
                const getData= await getSnap.docs.map((doc)=>({
                    id: doc.id,
                    ... doc.data()
                }))
                if(getData.length>0){
                    showAlertFunction("Already data exists","warning")
                }else{
                    const docRef= await addDoc(collection(db,"authors"),{
                        name: name?.trim().toLowerCase()
                        , image: image?.trim() ,
                        bookCount: 0,
                       createdBy: state?.user?.email,
                       timestamp: new Date() 
                    })
                    navigate("/createdauthor",{replace:true})
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
            Create Author
        </div>
        <div className='p-2 flex flex-col gap-2 max-w-[700px] mx-auto'>
            <div className='flex flex-col gap-1'>
                <label htmlFor="name">Name : </label>
                <input value={name} onChange={(e)=>setName(e.target.value)} type="text" name="name" id="name" className='h-10 outline-none bg-gray-700 text-white p-1 px-2 rounded-md' />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="image">Image URL : </label>
                <input value={image} onChange={(e)=>setImage(e.target.value)} type="text" name="title" id="title" className='h-10 outline-none bg-gray-700 text-white p-1 px-2 rounded-md' />
            </div>
        </div>
        <div className='flex flex-row gap-4 justify-center mt-10'>
            <button className='bg-red-500 p-2 rounded-md min-w-20' onClick={()=> navigate(-1)} >Cancel</button>
            <button className='bg-green-500 p-2 rounded-md min-w-20' onClick={createHandle} >{isEdit?"Edit":"Save"}</button>
        </div>
    </div>
  )
}

export default CreateAuthor