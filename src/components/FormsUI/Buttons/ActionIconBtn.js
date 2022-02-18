import React from 'react'
import {Button} from "@mui/material";
import {useFormikContext} from 'formik'
import IconButton from "@mui/material/IconButton";
import {Add} from "@mui/icons-material";

const ActionIconBtn = ({onClick,children, ...otherProps}) => {



    return   <IconButton {...otherProps} onClick={onClick}>
                  {children}
             </IconButton>


}

export default ActionIconBtn;
