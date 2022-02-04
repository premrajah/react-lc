import React, {useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
import {GoogleMap} from "../../Map/MapsContainer";


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
    const [latitude, setLatitude] = React.useState();
    const [longitude, setLongitude] = React.useState();
    const [address, setAddress] = React.useState()
    const classes = useStyles();
    const handleChange = (event) => {
            console.log(event)
            setValue(event);
            setAddress("")
        setLatitude("")
        setLongitude("")

        if (event) {


            geocodeByPlaceId(event.value.place_id)
                .then(results => {

                    setLongitude(results[0].geometry.viewport.Ra.g)
                    setLatitude(results[0].geometry.viewport.Ab.g)

                    setAddress(value["label"])

                    if (onChange) {
                        onChange(
                            {
                                address: value["label"],
                                longitude: results[0].geometry.viewport.Ra.g,
                                latitude: results[0].geometry.viewport.Ab.g
                            })

                    }
                    }
                )
                .catch(error => console.error(error));
        }


    };





    useEffect(()=>{
        if (onChange)
            onChange(initialValue)
    },[])


    return (
        <>

            <div className={"field-box "}>

                <GooglePlacesAutocomplete
                    searchable
                    isClearable={true}
                    selectProps={{
                        value,
                        className:"google-autocomplete",
                        onChange: handleChange,
                    }}
                    apiKey={"AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM"}/>



                {latitude &&longitude &&
                <div className="mt-2">
                <GoogleMap
                    width={"100%"} height={"300px"}


                               searchLocation={true}
                               latitude={latitude}
                                longitude= {longitude}

                    />
                </div>
                    }



                {/*{error && <span style={{color:"#f44336",fontSize: "12px!important"}} className={"text-danger"}> {error.message}</span>}*/}
            </div>
        </>
    );
};

export default SearchPlaceAutocomplete;
