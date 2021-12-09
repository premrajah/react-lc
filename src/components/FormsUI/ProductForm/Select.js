import React, {useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {makeStyles} from '@mui/styles';
import CustomizedSelect from "./CustomizedSelect";
import CustomPopover from "../CustomPopover";
import InfoIcon from "./InfoIcon";


const useStyles = makeStyles((theme) => ({
    formControl: {

    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const SelectArrayWrapper = (props) => {

    const {label,title,option,initialValue,detailsHeading,details,placeholder,valueKey, name,select,onChange, helperText,disabled,defaultValueSelect, defaultValue,options,error, ...rest} = props;

    const [value, setValue] = React.useState();
    const classes = useStyles();
    const handleChange = (event) => {
        setValue(event.target.value);
           if (onChange)
            onChange(event.target.value)
    };

    useEffect(()=>{
        if (onChange)
            onChange(initialValue)
    },[])


    return (
        <>
            {title&& <div className={"custom-label text-bold text-blue mb-0"}>
                {title} <CustomPopover heading={detailsHeading} text={details}><InfoIcon/></CustomPopover>
            </div>}
            <div className={"field-box mb-2"}>
                <FormControl variant="standard" >
                {label && <InputLabel >{label}</InputLabel>}


            <CustomizedSelect

                native
                variant="standard"
                label={label}
                value={defaultValue}
                onChange={handleChange}
                style={{width:"100%"}}
                disabled={disabled}
                name={name}
                className={error&&"border-red-error"}
            >
                {select&&
                <option  value={""}>
                    {select}
                </option>}
                {placeholder&&
                <option  value="" disabled>
                    {placeholder}
                </option>}

                {options&&options.map((item, index) => (
                    <option selected={valueKey?(item[valueKey]===initialValue):(item===initialValue)}   key={valueKey?item[valueKey]:item} value={valueKey?item[valueKey]:item}>
                        {(option?item[option]:item)}
                    </option>
                ))}
            </CustomizedSelect>
                </FormControl>

                {error && <span style={{color:"#f44336",fontSize: "12px!important"}} className={"text-danger"}> {error.message}</span>}
            </div>
        </>
    );
};

export default SelectArrayWrapper;
