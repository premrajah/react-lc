import React, {useEffect, useState} from 'react'
import {TextField} from "@mui/material";
import {makeStyles} from '@mui/styles';
import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import CustomizedInput from "./CustomizedInput";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));




const TextFieldWrapper = ({name,title,validators,label,onChange,error,initialValue,disabled,readonly,customReadOnly , ...otherProps}) => {

    // const [field, mata] = useField(name)
    const classes = useStyles();
    const [field,setField] = useState(initialValue)

    useEffect(()=>{
        if (onChange)
            onChange(initialValue)
    },[])
        const configTextField = {
        // ...field,
        ...otherProps,
        variant: 'outlined',
        fullWidth: true,
    }


    const handleChange = (event) => {

           const {value} = event.target;
           setField(value)

            if (onChange)
             onChange(value)
    };


    return(
        <>

            {title&& <div className={"custom-label text-bold text-blue mb-0"}>
                {title}
            </div>}

           <div className={"field-box mb-2"}>

               <CustomizedInput

                  variant="outlined" label={label} value={field} className={error&&"border-red-error"} onChange={handleChange} name={name} {...configTextField} />

           </div>
            {error && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{error.message}</span>}
        </>

    )
}

export default TextFieldWrapper;
