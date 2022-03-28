import React, {useEffect, useState} from 'react'
import {Checkbox} from '@mui/material'
import {Info} from "@mui/icons-material";
import CustomPopover from "../CustomPopover";

const CheckboxWrapper = ({name, title,details,detailsHeading,onChange, legend,initialValue,error, ...otherProps}) => {

    const [field,setField] = useState(initialValue)

    useEffect(()=>{
        if (onChange&&initialValue)
            onChange(initialValue)
    },[])

    const handleChange = e => {
        const { checked } = e.target;
        setField(checked);

        if (onChange)
        onChange(checked)
    };

    const configCheckbox = {
        // ...field,
        ...otherProps,
        onChange: handleChange
    };

    // const configFormControl = {};
    //
    // if(mata && mata.touched && mata.error) {
    //     configFormControl.error = true;
    // }

    return  (
        <>
        <div style={{width:"100%"}} className={"custom-label text-bold text-blue mb-1"}>
            {title} {details&&<CustomPopover heading={detailsHeading} text={details}><Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"24px"}/></CustomPopover>}
        </div>
            <span style={{width:"100%"}} className={""}>

            <Checkbox
                className={error?"border-red-error":""} checked={field} onChange={handleChange} {...configCheckbox} />
            </span>


        </>
    )

}

export default CheckboxWrapper;
