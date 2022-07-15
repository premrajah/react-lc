import React, {useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CustomizedSelect from "./CustomizedSelect";
import CustomPopover from "../CustomPopover";
import InfoIcon from "./InfoIcon";




const SelectArrayWrapper = (props) => {

    const {label,title,option,notNative,initialValue,detailsHeading,details,noBorder,textAlignRight,subOption,subValueKey,
        placeholder,valueKey, name,select,onChange, helperText,disabled,defaultValueSelect,
        defaultValue,options,multiple,error, ...rest} = props;

    const [value, setValue] = React.useState();

    const handleChange = (event) => {
        setValue(event.target.value);
           if (onChange)
            onChange(event.target.value)
    };

    useEffect(()=>{
        if (onChange) {


              setValue(initialValue)
                onChange(initialValue)

        }
    },[initialValue])


    return (
        <>
            {title&& <div className={"custom-label text-bold ellipsis-end text-blue mb-0"}>
                {title} {details&&<CustomPopover heading={detailsHeading} text={details}><InfoIcon/></CustomPopover>}

            </div>}
            <div className={"field-box mb-2"}>
                <FormControl variant="outlined" >
                {label && <InputLabel >{label}</InputLabel>}


            <CustomizedSelect

                multiple={multiple}
                native={notNative?false:true}

                variant="standard"
                label={label}
                value={defaultValue}
                onChange={handleChange}
                style={{width:"100%"}}
                disabled={disabled}
                name={name}
                className={` ${error&&"border-red-error"} txt-capitalize ${textAlignRight&&"select-text-right"}  ${noBorder&&"select-no-border"} `}
                // defaultValue={defaultValue ? defaultValue : ""}
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
                    <option
                        selected={subValueKey?item[valueKey][subValueKey]==initialValue:valueKey?(item[valueKey]===initialValue):(item===initialValue)}

                        key={subValueKey?item[valueKey][subValueKey]:valueKey?item[valueKey]:item}
                        value={subValueKey?item[valueKey][subValueKey]:valueKey?item[valueKey]:item}

                    >
                     {subOption?option?item[option][subOption]:item:option?item[option]:item}
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
