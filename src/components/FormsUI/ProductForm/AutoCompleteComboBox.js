import React, {useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {makeStyles} from '@mui/styles';
import CustomizedSelect from "./CustomizedSelect";
import CustomPopover from "../CustomPopover";
import InfoIcon from "./InfoIcon";
import Autocomplete from '@mui/material/Autocomplete';
import CustomizedInput from "./CustomizedInput";
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
const useStyles = makeStyles((theme) => ({
    formControl: {

    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const AutoCompleteComboBox = (props) => {

    const {label,title,option,initialValue,detailsHeading,details,placeholder,valueKey,
        name,select,onChange, helperText,disabled,defaultValueSelect, defaultValue,options,error, ...rest} = props;

    const [value, setValue] = React.useState(initialValue);
    const classes = useStyles();
    const handleChange = (event,selectValue) => {

        setValue(selectValue);
           if (onChange)
            onChange(selectValue)
    };

    useEffect(()=>{
        if (onChange)
            onChange(initialValue)
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

                freeSolo
                style={{width:"100%"}}

                onChange={(event,value) =>handleChange(event,value)}
                className={`custom-autocomplete ${error&&"border-red-error"}`}
                renderInput={(params) => <TextField  name={name} variant="standard" {...params} />
                }
                options={options}
                value={value}

            />

                </FormControl>

                {error && <span style={{color:"#f44336",fontSize: "12px!important"}} className={"text-danger"}> {error.message}</span>}
            </div>
        </>
    );
};

export default AutoCompleteComboBox;
