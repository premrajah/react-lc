import React, {useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
import {GoogleMap} from "../../Map/MapsContainer";
import CloseButtonPopUp from "../Buttons/CloseButtonPopUp";
import ErrorBoundary from "../../ErrorBoundary";


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

    const handleChange = (event) => {
            console.log(event)
            setValue(event);

        //     setAddress(address)
        // setLatitude("")
        // setLongitude("")

        if (event&&event.value) {


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




    const draggedLocation=(data)=>{


        if (data.latitude&&data.longitude){

            setLatitude(data.latitude)
            setLongitude(data.longitude)


            onChange({ address: address,
                longitude: longitude,
                latitude: latitude})


        }

    }



    useEffect(()=>{
        if (onChange) {

            if (initialValue) {
                setAddress(initialValue.address)
                setLongitude(initialValue.geo_codes[0].address_info.geometry.location.lng)
                setLatitude(initialValue.geo_codes[0].address_info.geometry.location.lat)
            }
            onChange(initialValue)
        }
    },[])


  const  setClear=()=>{

        setValue(null)

    }

    return (
        <>

            <div className={"field-box "}>

                <GooglePlacesAutocomplete

                    selectProps={{
                        value,
                        isClearable:{setClear},
                        className:"google-autocomplete",
                        onChange: handleChange,
                    }}
                    apiKey={"AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM"}/>


                {latitude &&longitude &&
                <div className="mt-2">
                <GoogleMap
                    width={"100%"} height={"300px"}

                                name={address}
                               searchLocation={true}
                               latitude={latitude}
                                longitude= {longitude}

                        setLocation={draggedLocation }/>
                </div>
                    }

            </div>
        </>
    );
};

export default SearchPlaceAutocomplete;
