import React from 'react'
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel} from '@material-ui/core'
import {useField, useFormikContext} from 'formik'

const CheckboxWrapper = ({name, title, legend, ...otherProps}) => {

    const [field, mata, helpers] = useField(name);
    const { setFieldValue } = useFormikContext();

    const handleChange = e => {
        const { checked } = e.target;
        setFieldValue(name, checked);
    };

    const configCheckbox = {
        ...field,
        ...otherProps,
        onChange: handleChange
    };

    const configFormControl = {};

    if(mata && mata.touched && mata.error) {
        configFormControl.error = true;
    }

    return  (
        <>
        <div style={{width:"100%"}} className={"custom-label text-bold text-blue mb-3"}>
            {title}
        </div>
            <div style={{width:"100%"}} className={"custom-label text-bold text-blue mb-3"}>

            <Checkbox onChange={otherProps.onChange} {...configCheckbox} />
            </div>
        </>
    )

}

export default CheckboxWrapper;
