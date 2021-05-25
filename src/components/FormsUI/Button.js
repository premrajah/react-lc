import React from 'react'
import {Button} from "@material-ui/core";
import {useFormikContext} from 'formik'

const ButtonWrapper = ({children, ...otherProps}) => {

    const { submitForm } = useFormikContext();
    const handleSubmit= () => {
        submitForm();
    }

    const configButton = {
        variant: 'contained',
        fullWidth: true,
        color: 'red',
        disableRipple: true,
        onClick: handleSubmit,
        ...otherProps
    }

    return <Button {...configButton}>
        {children}
    </Button>


}

export default ButtonWrapper;