import React,{useState,useEffect} from 'react'
// import ImageUploader from '../components/ImageUploader'
import {useNavigate} from "react-router-dom"
import AlertPop from '../AlertPop'
import db from "../firebase"
import {useStateValue} from "../StateProvider"
import { collection, addDoc, doc, getDoc,setDoc, getDocs, count, where, query } from 'firebase/firestore';

const CreateBook = () => {
    const [state,dispatch]= useStateValue()

    const navigate= useNavigate()
    const [title,setTitle]= useState("")
    const [author,setAuthor]= useState("")
    const [category,setCategory]= useState("")
    const [description,setDescription]= useState("")
    const [image,setImage]= useState(null)
    const [isEdit,setIsEdit]= useState(false)
    const [id,setId]= useState(null)

    const [authors,setAuthors]= useState([])
    const [categories,setCategories]= useState([])
    const [prevAuthorArr,setPrevAuthorArr] = useState([])
    const [prevCategoryArr,setPrevCategoryArr]= useState([])

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
                const docRef= doc(db,"books",docId)
                const docSnap= await getDoc(docRef)
                if(docSnap.exists()){
                    setTitle(docSnap.data().title)
                    setImage(docSnap.data().image)
                    setCategory(docSnap.data()?.category?.join(", "))
                    setPrevCategoryArr([...docSnap.data()?.category])
                    setAuthor(docSnap.data()?.author?.join(", "))
                    setPrevAuthorArr([...docSnap.data()?.author])
                    setDescription(docSnap.data().description)
                }else{
                    showAlertFunction("There is no book with this ID","warning")
                    navigate("/createdlist",{replace: true})
                }
            }catch(error){
                console.log(error)
                showAlertFunction("Error"+error,"warning")
            }
      }
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
           if(!title){
            showAlertFunction("Please fill Book Title","warning");
           }else if(!author){
            showAlertFunction("Please fill Author Name","warning")
            }else if(! description){
                showAlertFunction("Please fill Book Description.","warning")
            }else if(!category){
                showAlertFunction("Please fill Category section","warning")
            }else if(!image){
                showAlertFunction("Please upload an Image","warning")
            }
            const arrAuthor= Array.from(new Set(author?.split(",").map(item => item?.trim()?.toLowerCase())));
            const arrCategory= Array.from(new Set(category?.split(",").map(item=> item?.trim()?.toLowerCase())));

            // first check for duplicity otherwise author & category will be created
            if(!isEdit){
                const q= query(collection(db,'books'),where("title","==",title?.trim()?.toLowerCase()))
                const getSnap=await getDocs(q)
                var getData= await getSnap.docs.map((doc)=>({
                    id: doc.id,
                    ... doc.data()
                }))
            }

            if(isEdit){
                //removing count of previous category & author and update new one
                //prevAuthorArr , prevCategoryArr
                const delArrAuthor= prevAuthorArr.filter((item)=>!arrAuthor.includes(item))
                const newArrAuthor= arrAuthor.filter((item)=>!prevAuthorArr.includes(item))
                
                const delArrCategory= prevCategoryArr.filter((item)=>!arrCategory.includes(item))
                const newArrCategory= arrCategory.filter((item)=>!prevCategoryArr.includes(item))

                
                // remove previous count
                for(let i=0;i<delArrAuthor.length;i++){
                    const isPresent= authors.filter((item)=>item.name ==delArrAuthor[i])
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
                for(let i=0;i<delArrCategory.length;i++){
                    const isPresent= categories.filter((item)=>item.categoryName ==delArrCategory[i])
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

                //update new count
                for(let i=0;i<newArrAuthor.length;i++){
                    const isPresent= authors.filter((item)=>item.name ==newArrAuthor[i])
                    if(isPresent.length>0){
                        const docRef= doc(db,"authors",isPresent[0].id)
                        try{
                            await setDoc(docRef,{bookCount: isPresent[0].bookCount+1},{merge: true})
                        }catch(error){
                            console.log(error)
                        }
                    }else{
                        await addDoc(collection(db,"authors"),{
                            name: newArrAuthor[i],
                            bookCount:1,
                            createdBy: state?.user?.email,
                            timestamp: new Date() 
                        })
                    }
                }

                for(let i=0;i<newArrCategory.length;i++){
                    const isPresent= categories.filter((item)=> item.categoryName== newArrCategory[i])
                    if(isPresent.length>0){
                        const docRef= doc(db,"categories",isPresent[0].id)
                        try{
                            await setDoc(docRef,{count: isPresent[0].count+1},{merge: true})
                        }catch(error){
                            console.log(error)
                        }
                    }else{
                        await addDoc(collection(db,"categories"),{
                            categoryName: newArrCategory[i],
                            count: 1,
                            createdBy: state?.user?.email,
                            timestamp: new Date() 
                        })
                    }
                    
                }
            }else{
                if(getData.length>0){

                }else{
                    // first time when book is created , then fresh or count will be updated , no worry for removing count
                    for(let i=0;i<arrAuthor.length;i++){
                        const isPresent= authors.filter((item)=>item.name ==arrAuthor[i])
                        if(isPresent.length>0){
                            const docRef= doc(db,"authors",isPresent[0].id)
                            try{
                                await setDoc(docRef,{bookCount: isPresent[0].bookCount+1},{merge: true})
                            }catch(error){
                                console.log(error)
                            }
                        }else{
                            await addDoc(collection(db,"authors"),{
                                name: arrAuthor[i],
                                bookCount:1,
                                createdBy: state?.user?.email,
                                timestamp: new Date() 
                            })
                        }
                        
                    }

                    for(let i=0;i<arrCategory.length;i++){
                        const isPresent= categories.filter((item)=> item.categoryName== arrCategory[i])
                        if(isPresent.length>0){
                            const docRef= doc(db,"categories",isPresent[0].id)
                            try{
                                await setDoc(docRef,{count: isPresent[0].count+1},{merge: true})
                            }catch(error){
                                console.log(error)
                            }
                        }else{
                            await addDoc(collection(db,"categories"),{
                                categoryName: arrCategory[i],
                                count: 1,
                                createdBy: state?.user?.email,
                                timestamp: new Date() 
                            })
                        }
                        
                    }
                }
            }
            
            

            if(isEdit){
                const docRef= doc(db,'books',id)
                await setDoc(docRef,{
                    title: title?.trim()?.toLowerCase()
                    , image: image?.trim() ,
                    category: arrCategory
                    ,description: description?.trim(),
                   author: arrAuthor
                },{merge: true})
                navigate("/createdlist",{replace:true})
            }else{
                if(getData.length>0){
                    showAlertFunction("Already exists this data","warning")
                }else{
                    const docRef= await addDoc(collection(db,"books"),{
                        title: title?.trim()?.toLowerCase()
                        , image: image?.trim() ,
                        category: arrCategory
                        ,description: description?.trim(),
                       author: arrAuthor,
                       createdBy: state?.user?.email,
                       timestamp: new Date() 
                    })
                    navigate("/createdlist",{replace:true})
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
        <div>
            {/* <ImageUploader image={image} setImage={setImage} /> */}
            {/* because of firebase storage plan */}
        </div>
        <div className='p-2 flex flex-col gap-2 max-w-[700px] mx-auto'>
            <div className='flex flex-col gap-1'>
                <label htmlFor="title">Title : </label>
                <input placeholder='Enter Title' value={title} onChange={(e)=>setTitle(e.target.value)} type="text" name="title" id="title" className='h-10 outline-none bg-gray-700 text-white p-1 px-2 rounded-md' />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="image">Image URL : </label>
                <input placeholder='Enter Image URL' value={image} onChange={(e)=>setImage(e.target.value)} type="text" name="title" id="title" className='h-10 outline-none bg-gray-700 text-white p-1 px-2 rounded-md' />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="author">Author : </label>
                <input placeholder='Multiple author separated by ,(comma)' value={author} onChange={(e)=> setAuthor(e.target.value)} type="text" name="author" id="author"  className='h-10 outline-none bg-gray-700 text-white p-1 px-2 rounded-md' />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="category">Category : </label>
                <input placeholder='Multiple category separated by ,(comma)' value={category} onChange={(e)=>setCategory(e.target.value)} type="text" name="category" id="category" className='h-10 outline-none bg-gray-700 text-white p-1 px-2 rounded-md' />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="title">Description : </label>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} type="text" name="title" id="title" rows={5}  className='resize-none outline-none bg-gray-700 text-white p-1 px-2 rounded-md' />
            </div>
        </div>
        <div className='flex flex-row gap-4 justify-center mt-4'>
            <button className='bg-red-500 p-2 rounded-md min-w-20' onClick={()=> navigate(-1)} >Cancel</button>
            <button className='bg-green-500 p-2 rounded-md min-w-20' onClick={createHandle} >{isEdit?"Edit":"Save"}</button>
        </div>
    </div>
  )
}

export default CreateBook