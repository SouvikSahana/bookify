import {useContext,createContext, useReducer } from "react"

const ContextProvider= createContext()

const StateProvider=({initialState,reducer,children})=>{
    return(
        <ContextProvider.Provider value={useReducer(reducer,initialState)}>
            {children}
        </ContextProvider.Provider>
    )
}
export default StateProvider

export const useStateValue=()=> useContext(ContextProvider)