import React from 'react'
import IconButton from "@mui/material/IconButton";

const ActionIconBtn = ({onClick,children,size, ...otherProps}) => {



    return   <IconButton {...otherProps} onClick={onClick} size={size?size:""}>
                  {children}
             </IconButton>


}

export default ActionIconBtn;
