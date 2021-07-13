import React from 'react';
import {Field, ErrorMessage} from 'formik';
import {TextField} from "formik-material-ui";
import {MenuItem} from "@material-ui/core";
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
const SelectArrayWrapper = (props) => {
    const {title, name,select, helperText,disabled, defaultValue,options, ...rest} = props;

    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);

        if (props.handleChange)
          props.handleChange(event.target.value)
    };

    return (
        <>
            <div className={"custom-label text-bold text-blue mb-3"}>
                {title}
            </div>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={defaultValue}
                onChange={handleChange}
                variant="outlined"
                style={{width:"100%"}}
                disabled={disabled}
                name={name}

            >
                {/*{select &&  <MenuItem  value={""}>*/}
                {/*    {select}*/}
                {/*</MenuItem>}*/}
                {options.map((option, index) => (
                    <MenuItem key={option._key?option._key:option.name?option.name:option} value={option._key?option._key:option.name?option.name:option}>
                        {option.name?option.name:option}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
};

export default SelectArrayWrapper;
