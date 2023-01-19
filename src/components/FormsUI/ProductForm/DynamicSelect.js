import React, {useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {makeStyles} from '@mui/styles';
import CustomPopover from "../CustomPopover";
import InfoIcon from "./InfoIcon";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';



const DynamicSelectArrayWrapper = (props) => {

    const {label,title,option,initialValue,initialValueTextbox,detailsHeading,details,placeholder,valueKey,
        name,select,onChange, helperText,disabled,defaultValueSelect, defaultValue,options,error, ...rest} = props;

    const [value, setValue] = React.useState(initialValue);
    const [valueTextbox, setValueTextbox] = React.useState(initialValue);
    const handleChange = (event,selectValue) => {


        console.log(selectValue)

        if (typeof selectValue === 'string'){
            setValue(selectValue);
            setValueTextbox(selectValue);
            onChange(selectValue)
        }else{
            setValue(selectValue[`${valueKey}`])
            setValueTextbox(selectValue[`${option}`])
            if (onChange){
                onChange(selectValue[`${valueKey}`])
            }
        }

    };

    useEffect(()=>{


            if (onChange) {
                onChange(initialValue)
            }
        setValue(initialValue)
        setValueTextbox(initialValueTextbox)

    },[])


    return (
        <>
            {title&& <div className={"custom-label text-bold ellipsis-end text-blue mb-0"}>
                {title} {details&&<CustomPopover heading={detailsHeading} text={details}><InfoIcon/></CustomPopover>}
            </div>}
            <div className={"field-box mb-2"}>
                <FormControl variant="outlined" >
                    {label && <InputLabel >{label}</InputLabel>}


                    <Autocomplete

                        style={{width:"100%"}}
                        value={valueTextbox}

                        onClose={()=>setValueTextbox("")}
                        onChange={
                            (event,value) =>
                                handleChange(event,value)
                        }
                        className={`custom-autocomplete ${error&&"border-red-error"}`}
                        renderInput={(params) =>
                            <TextField
                                onChange={(event) =>handleChange(event,event.target.value)}
                                 variant="standard" {...params} />
                        }
                        options={options}
                        getOptionLabel={(optionTmp) =>
                            typeof optionTmp === 'string' ? optionTmp : optionTmp[`${option}`]
                        }
                        noOptionsText="No locations found"
                        renderOption={(props, optionTmp) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>

                                {optionTmp[`${option}`]}
                            </Box>
                        )}


                        // value={value}

                    />
                    <input name={name} type={"hidden"} value={value}/>

                </FormControl>

                {error && <span style={{color:"#f44336",fontSize: "12px!important"}} className={"text-danger"}> {error.message}</span>}
            </div>
        </>
    );
};

export default DynamicSelectArrayWrapper;
