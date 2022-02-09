import React from 'react'
import {Button} from "@mui/material";
import {useFormikContext} from 'formik'
import IconButton from "@mui/material/IconButton";
import {Add} from "@mui/icons-material";

const IconBtn = ({onClick, ...otherProps}) => {


    return   <IconButton onClick={onClick}>
        <Add />
    </IconButton>


}

export default IconBtn;
