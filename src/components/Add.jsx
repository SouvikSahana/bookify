import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';

import {useNavigate} from "react-router-dom"

const actions = [
  { icon: <MenuBookIcon />, name: 'Book', href:"/createbook" },
  { icon: <PersonIcon />, name: 'Author',href:"/createauthor" },
  { icon: <CategoryIcon />, name: 'Category',href:"/createcategory" },
];

export default function BasicSpeedDial() {
    const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
    const navigate= useNavigate();
  return (
    <div className='sticky  bottom-0 bg-black '>
    <Box sx={{ height: 30, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={()=>{navigate(action.href); handleClose();}}
          />
        ))}
      </SpeedDial>
    </Box>
    </div>
  );
}
