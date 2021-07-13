import React from 'react'
import {TextField} from "@material-ui/core";
import {useField} from 'formik'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
//
import ErrorOutline from '@material-ui/icons/ErrorOutline';

const TextFieldWrapper = ({name,title,error, ...otherProps}) => {

    const [field, mata] = useField(name)

    const configTextField = {
        ...field,
        ...otherProps,
        variant: 'outlined',
        fullWidth: true,
    }

    if(mata && mata.touched && mata.error) {
        configTextField.error = true;
        configTextField.helperText = mata.error;
    }

    return(
        <>

        <div className={"custom-label text-bold text-blue mb-3"}>
            {title}
        </div>

           <div className={"field-box"}><TextField {...configTextField} />{error&& <ErrorOutline style={{color:"#f44336"}} />}</div>


   </>

    )
}

export default TextFieldWrapper;
