import React from 'react'
import {Button} from "@mui/material";
import {useFormikContext} from 'formik'

const LoadingButtonWrapper = ({children, ...otherProps}) => {

    const { submitForm } = useFormikContext();
    const handleSubmit= () => {
        submitForm().then().catch(err => console.log(err));
    }

    const configButton = {
        variant: 'contained',
        fullWidth: true,
        color: 'primary',
        disableRipple: true,
        onClick: handleSubmit,
        ...otherProps
    }

    return <Button {...configButton}>
        {children}
    </Button>


}

export default ButtonWrapper;
