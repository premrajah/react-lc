import React from 'react'
import IconButton from "@mui/material/IconButton";
import {Close} from "@mui/icons-material";

const CloseButtonPopUp = ({onClick, ...otherProps}) => {


    return   <IconButton style={{border: "1px solid #eee"}} onClick={onClick}>
        <Close />
    </IconButton>


}

export default CloseButtonPopUp;
