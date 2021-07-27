import React, {useEffect, useState} from 'react'
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel} from '@material-ui/core'
import {useField, useFormikContext} from 'formik'

const CheckboxWrapper = ({name, title,onChange, legend,initialValue, ...otherProps}) => {

    const [field,setField] = useState(initialValue)

    useEffect(()=>{
        if (onChange&&initialValue)
            onChange(initialValue)
    },[])

    const handleChange = e => {
        const { checked } = e.target;
        setField(checked);

        if (onChange)
        onChange(checked)
    };

    const configCheckbox = {
        // ...field,
        ...otherProps,
        onChange: handleChange
    };

    // const configFormControl = {};
    //
    // if(mata && mata.touched && mata.error) {
    //     configFormControl.error = true;
    // }

    return  (
        <>
        <div style={{width:"100%"}} className={"custom-label text-bold text-blue mb-3"}>
            {title}
        </div>
            <div style={{width:"100%"}} className={"custom-label text-bold text-blue mb-3"}>

            <Checkbox checked={field} onChange={handleChange} {...configCheckbox} />
            </div>
        </>
    )

}

export default CheckboxWrapper;
