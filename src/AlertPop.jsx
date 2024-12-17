import React,{useState} from "react";
import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"

const AlertPop=({message, type})=>{
    return(
        <div className='fixed  top-5 z-50 w-[100%]'>
        <div className='mx-auto w-fit'>
          <Stack sx={{ width: '100%' }} >
          <Alert severity={type} className='z-50'>{message}</Alert>
          
      </Stack>
      </div>
      </div>
    )
}

export default AlertPop