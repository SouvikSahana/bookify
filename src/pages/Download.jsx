import React from 'react'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {collection,getDocs} from "firebase/firestore"
import db from "../firebase"

const Download = () => {
    const downloadData=async(dbName)=>{
        try{
            const snapShot= await getDocs(collection(db,dbName))
            const fetchedData= await snapShot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            }))
            // console.log(fetchedData)
            const jsonString = JSON.stringify(fetchedData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${dbName}.json`;
            document.body.appendChild(a); 
            a.click(); 
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }catch(error){
            console.log(error)
        }
    }
  return (
    <div className='p-2 flex gap-2 flex-wrap'>
        <div onClick={()=>downloadData("books")}   className='hover:bg-blue-500 cursor-pointer p-2 bg-slate-700 rounded-md grow min-w-[200px] min-h-20 gap-3 items-center justify-center  flex flex-row'>
            <div className='text-sx font-medium text-center select-none  '>Books</div>
            <FileDownloadIcon />
        </div>
        <div onClick={()=>downloadData("authors")}  className='hover:bg-blue-500 cursor-pointer p-2 bg-slate-700 rounded-md grow min-w-[200px] min-h-20 gap-3 items-center justify-center  flex flex-row'>
            <div className='text-sx font-medium text-center select-none  '>Authors</div>
            <FileDownloadIcon />
        </div>
        <div onClick={()=>downloadData("categories")}  className='hover:bg-blue-500 cursor-pointer p-2 bg-slate-700 rounded-md grow min-w-[200px] min-h-20 gap-3 items-center justify-center  flex flex-row'>
            <div className='text-sx font-medium text-center select-none  '>Categories</div>
            <FileDownloadIcon />
        </div>
        <div onClick={()=>downloadData("users")}  className='hover:bg-blue-500 cursor-pointer p-2 bg-slate-700 rounded-md grow min-w-[200px] min-h-20 gap-3 items-center justify-center  flex flex-row'>
            <div className='text-sx font-medium text-center select-none  '>Users</div>
            <FileDownloadIcon />
        </div>
    </div>
  )
}

export default Download