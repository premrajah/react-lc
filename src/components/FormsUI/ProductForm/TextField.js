import React, {useEffect, useState} from 'react'
import {TextField} from "@material-ui/core";


import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Select from "@material-ui/core/Select";

const TextFieldWrapper = ({name,title,validators,onChange,error, ...otherProps}) => {

    // const [field, mata] = useField(name)


        const configTextField = {
        // ...field,
        ...otherProps,
        variant: 'outlined',
        fullWidth: true,
    }

    const handleChange = (event) => {

            const {value} = event.target;
            console.log(value)

        onChange(value)
    };

    return(
        <>

        <div className={"custom-label text-bold text-blue mb-3"}>
            {title}
        </div>

           <div className={"field-box mb-1"}>
               <TextField   className={error&&"border-red-error"} onChange={handleChange} name={name} {...configTextField} />
           </div>
            {error && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{error.message}</span>}
        </>

    )
}

export default TextFieldWrapper;
