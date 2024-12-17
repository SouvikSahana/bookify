const initialState={
    user:null,
    likes:[],
    bookmarks : [],
    arr:[]
}

const  reducer=(state,action)=>{
    switch(action.TYPE){
        case "USER":
            return {...state, user: action.payload}
        case "SET_LIKES":
            return {...state, likes: action.payload}
        case "SET_BOOKMARKS":
            return {...state, bookmarks: action.payload}
    }
}

const capitalize=(str)=>{
    return str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

export default reducer
export {initialState, capitalize}