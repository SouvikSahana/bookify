import { useState,useEffect } from 'react'
import Home from './pages/Home'
import './App.css'
import Header from "./components/Header"
import Book from './components/Book'
import Category from './pages/Category'
import Author from "./pages/Author"
import CreateBook from './pages/CreateBook'
import CreatedList from './pages/CreatedList'
import Add from "./components/Add"
import CreateAuthor from "./pages/CreateAuthor"
import CreatedAuthor from "./pages/CreatedAuthor"
import CreateCategory from "./pages/CreateCategory"
import CreatedCategory from "./pages/CreatedCategory"
import Download from './pages/Download'
import Library from './pages/Library'
import Wishlist from './pages/Wishlist'

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {authGet} from "./firebase"
import {useStateValue} from "./StateProvider"

import db from "./firebase"
import {getDocs, collection,doc, where, query} from "firebase/firestore"

function App() {
  const [state,dispatch]= useStateValue()
  useEffect(()=>{
    authGet.onAuthStateChanged((authuser)=>{
      // console.log(authuser)
      if(authuser){
        dispatch({TYPE:"USER",payload:authuser})
      }else{
        console.log("No user found.")
      }
    })
  },[])
  const loadLikes=async(email)=>{
      try{
        const q= await query(collection(db,"users"),where("email","==",email))
        const snapShot= await getDocs(q)
        const filteredData=await snapShot.docs.map((doc)=>({
          ... doc.data()
        }))
        if(filteredData.length>0){
          dispatch({TYPE:"SET_LIKES",payload: filteredData[0]?.likes})
          dispatch({TYPE:"SET_BOOKMARKS",payload: filteredData[0]?.bookmarks})
        }
      }catch(error){
        console.log(error)
      }
  } 
  useEffect(()=>{
    if(state?.user){
      loadLikes(state?.user?.email)
    }
  },[state?.user])
  return (
    <Router >
      <div className="h-[100vh] bg-black flex flex-col">
      <Header/>
      <div className=" mt-16 bg-black flex-1">
      <Routes >
        <Route path='/' Component={Home} />
        <Route path='/book/*' Component={Book} />
        <Route path='/categories' Component={Category} />
        <Route path='/authors' Component={Author} />
        <Route path='/download' Component={Download} />
        {state?.user && <Route path='/createbook' Component={CreateBook} />}
        {state?.user && <Route path='/createauthor' Component={CreateAuthor} />}
        {state?.user && <Route path='/createcategory' Component={CreateCategory} />}
        {state?.user && <Route path='/createdlist' Component={CreatedList} />}
        {state?.user && <Route path='/createdauthor' Component={CreatedAuthor} />}
        {state?.user && <Route path='/createdcategory' Component={CreatedCategory} />}

        {state?.user && <Route path='/library' Component={Library} />}
        {state?.user && <Route path='/wishlist' Component={Wishlist} />}
      </Routes>
      </div>

     {state?.user&& <Add />}
      </div>
     
    </Router>
  )
}

export default App
