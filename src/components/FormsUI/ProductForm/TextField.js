import React, {useEffect, useState} from 'react'
import {TextField} from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {makeStyles} from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const TextFieldWrapper = ({name,title,validators,label,onChange,error,initialValue, ...otherProps}) => {

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

            {title&& <div className={"custom-label text-bold text-blue mb-1"}>
                {title}
            </div>}

           <div className={"field-box mb-1"}>

               <TextField  variant="outlined" label={label} value={field} className={error&&"border-red-error"} onChange={handleChange} name={name} {...configTextField} />

           </div>
            {error && <span style={{color:"#f44336",fontSize:"0.75rem!important"}} className='text-danger'>{error.message}</span>}
        </>

    )
}

export default TextFieldWrapper;
