import React, {useEffect} from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {makeStyles} from '@material-ui/core/styles';
import {capitalize} from "../../../Util/GlobalFunctions";

const useStyles = makeStyles((theme) => ({
    formControl: {

    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const SelectArrayWrapper = (props) => {

    const {label,title,option,initialValue,placeholder,valueKey, name,select,onChange, helperText,disabled,defaultValueSelect, defaultValue,options,error, ...rest} = props;

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
            {title&& <div className={"custom-label text-bold text-blue mb-3"}>
                {title}
            </div>}
            <div className={"field-box"}>
                <FormControl variant="outlined" className={classes.formControl}>
                {label && <InputLabel >{label}</InputLabel>}
            <Select
                native
                label={label}
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
                    {select}
                </option>}
                {placeholder&&
                <option  value="" disabled>
                    {placeholder}
                </option>}

                {options.map((item, index) => (
                    <option selected={valueKey?(item[valueKey]===initialValue):(item===initialValue)}   key={valueKey?item[valueKey]:item} value={valueKey?item[valueKey]:item}>
                        {(option?item[option]:item)}
                    </option>
                ))}
            </Select>
                </FormControl>

                {error && <span style={{color:"#f44336",fontSize: "0.75rem"}} className={"text-danger"}> {error.message}</span>}
            </div>
        </>
    );
};

export default SelectArrayWrapper;
