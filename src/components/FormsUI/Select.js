import React from 'react';
import {Field, ErrorMessage} from 'formik';
// import {TextField} from "formik-material-ui";
import {MenuItem} from "@mui/material";

const SelectArrayWrapper = (props) => {
    const {label, name, helperText, options, ...rest} = props;
    return (
        <>
            {/*<Field*/}
            {/*    // component={TextField}*/}
            {/*    type="text"*/}
            {/*    name={name}*/}
            {/*    label={label}*/}
            {/*    select*/}
            {/*    variant="outlined"*/}
            {/*    helperText={helperText}*/}
            {/*    margin="normal"*/}
            {/*    InputLabelProps={{*/}
            {/*        shrink: true,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    {options.map((option, index) => (*/}
            {/*        <MenuItem key={option} value={option}>*/}
            {/*            {option}*/}
            {/*        </MenuItem>*/}
            {/*    ))}*/}
            {/*</Field>*/}
        </>
    );
};

export default SelectArrayWrapper;
