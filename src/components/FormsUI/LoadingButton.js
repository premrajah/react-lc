import React from 'react'
import {Button} from "@material-ui/core";
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
