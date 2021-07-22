import React, {useEffect} from 'react';
import {Field, ErrorMessage} from 'formik';
import {TextField} from "formik-material-ui";
import {MenuItem} from "@material-ui/core";
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import ErrorOutline from "@material-ui/icons/ErrorOutline";
const SelectArrayWrapper = (props) => {
    const {title,option,initialValue,valueKey, name,select,onChange, helperText,disabled,defaultValueSelect, defaultValue,options,error, ...rest} = props;

    const [value, setValue] = React.useState(null);

    const handleChange = (event) => {
        setValue(event.target.value);

        console.log(event.target.value)

           if (onChange)
            onChange(event.target.value)
    };

    useEffect(()=>{
        if (onChange)
            onChange(initialValue)
    },[])


    return (
        <>
            <div className={"custom-label text-bold text-blue mb-3"}>
                {title}
            </div>
            <div className={"field-box"}>
            <Select
                native
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={defaultValue}
                onChange={handleChange}
                variant="outlined"
                style={{width:"100%"}}
                disabled={disabled}
                name={name}
                className={error&&"border-red-error"}
            >
                {select&&
                <option  value={""}>
                    {"Select"}
                </option>}

                {options.map((item, index) => (
                    <option selected={valueKey?(item[valueKey]===initialValue):(item===initialValue)}   key={valueKey?item[valueKey]:item} value={valueKey?item[valueKey]:item}>
                        {option?item[option]:item}
                    </option>
                ))}
            </Select>

                {error && <span style={{color:"#f44336",fontSize: "0.75rem"}}> {error.message}</span>}
            </div>
        </>
    );
};

export default SelectArrayWrapper;
