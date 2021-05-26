import React from 'react'
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel} from '@material-ui/core'
import {useField, useFormikContext} from 'formik'

const CheckboxWrapper = ({name, label, legend, ...otherProps}) => {

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

    return <FormControl {...configFormControl}>
        <FormLabel component="legend">{legend}</FormLabel>
        <FormGroup>
            <FormControlLabel control={<Checkbox {...configCheckbox} />} label={label} />
        </FormGroup>
    </FormControl>
}

export default CheckboxWrapper;