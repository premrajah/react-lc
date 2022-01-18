import React, {useEffect} from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {makeStyles} from '@mui/styles';
import CustomizedSelect from "./CustomizedSelect";
import CustomPopover from "../CustomPopover";
import InfoIcon from "./InfoIcon";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';


const useStyles = makeStyles((theme) => ({
    formControl: {

    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const SearchPlaceAutocomplete = (props) => {

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
                {title} {details&&<CustomPopover heading={detailsHeading} text={details}><InfoIcon/></CustomPopover>}
            </div>}
            <div className={"field-box mb-2"}>

                {/*{label && <InputLabel >{label}</InputLabel>}*/}

                <GooglePlacesAutocomplete apiKey={"AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM"}/>

                {/*{error && <span style={{color:"#f44336",fontSize: "12px!important"}} className={"text-danger"}> {error.message}</span>}*/}
            </div>
        </>
    );
};

export default SearchPlaceAutocomplete;
