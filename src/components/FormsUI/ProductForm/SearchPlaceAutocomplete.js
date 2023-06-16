import React, {useEffect} from 'react';
import {GoogleMap} from "../../Map/MapsContainer";
import LocationSearchAutocomplete from "./LocationSearchAutocomplete";
import TextFieldWrapper from "./TextField";


const SearchPlaceAutocomplete = (props) => {

    const {label,title,option,initialValue,detailsHeading,details,placeholder,valueKey,
        name,select,onChange, helperText,disabled,defaultValueSelect, defaultValue,options,error,hideMap,fromOutboundTransport, ...rest} = props;
    const [latitude, setLatitude] = React.useState();
    const [longitude, setLongitude] = React.useState();
    const [address, setAddress] = React.useState()
    const [initialValueFlag, setInitialValueFlag] = React.useState(false)

    const handleChange = (data) => {

        setLatitude("")
        setLongitude("")
        setAddress("")

        setTimeout(function() {

            setLatitude(data.latitude)
            setLongitude(data.longitude)
            setAddress(data.address)

            props.onChange(data)

        }, 500);


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

            if (!fromOutboundTransport){
                try {
                    if (initialValue && initialValue.geo_codes && initialValue.geo_codes.length > 0) {
                        setAddress(initialValue.address)
                        setLongitude(initialValue.geo_codes[0].address_info.geometry.location.lng)
                        setLatitude(initialValue.geo_codes[0].address_info.geometry.location.lat)
                    }
                    onChange(initialValue)
                }catch (e){

                }
            }else{
                try {
                    if (initialValue){
                        // setAddress(initialValue.address)

                        console.log("init value gogle map",initialValue.address_info.formatted_address)
                        console.log(initialValue)
                        setInitialValueFlag(true)
                        setLongitude(initialValue.address_info.geometry.location.lng)
                        setLatitude(initialValue.address_info.geometry.location.lat)
                        setAddress(initialValue.address_info.formatted_address)

                    }
                    onChange(initialValue)
                }catch (e){

                }
            }

        }
    },[initialValue])


  // const  setClear=()=>{
  //
  //       setValue(null)
  //
  //   }



    return (
        <>


            <div className={"field-box "}>


                {!initialValueFlag?<>

                {title?
                    <div className="custom-label text-bold ellipsis-end text-blue mb-0">{title}</div>
                :
                 <div className={"text-gray-light  mb-0 ellipsis-end"}>
                    Search for your location by name or postal code.<br/> (Min of 4 characters required.)
                </div>}
                <LocationSearchAutocomplete setLocation={handleChange} />
                </>:
                    <TextFieldWrapper
                        initialValue={address?address:""}
                        onChange={(value)=>{}}
                        // error={this.state.errors["address"]}
                        name="address"
                        title={ "Selected Location"}


                    />
                }
                {!hideMap&&latitude &&longitude &&
                <div className="mt-2">

                <div className={"custom-label text-bold text-blue mb-0 ellipsis-end"}>
                      Drag the marker to specify exact location
                    </div>
                <GoogleMap
                    width={"100%"} height={"300px"}

                    draggable
                                name={address}
                               searchLocation={true}
                               latitude={latitude}
                                longitude= {longitude}
                    location={{location:{lat:latitude, lng:longitude}}}

                        setLocation={draggedLocation }/>
                </div>
                    }

            </div>
        </>
    );
};

export default SearchPlaceAutocomplete;
