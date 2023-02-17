import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import CustomizedInput from "./CustomizedInput";
import CustomPopover from "../CustomPopover";
import InfoIcon from "./InfoIcon";
import {replace} from "formik";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const TextFieldWrapper = ({
    name,
    type,
    title,
    explanation,
    details,
    detailsHeading,
    validators,
    label,
    hidden,
    onChange,
    error,
    initialValue,
    disabled,
    readonly,ignoreTrim,
    customReadOnly,reset,noMargin,
                              numberInput,
    ...otherProps
}) => {
    // const [field, mata] = useField(name)
    const classes = useStyles();
    const [field, setField] = useState(null);

    useEffect(() => {

            if (onChange) {
                setField(initialValue)
                onChange(initialValue);
            }
        // }
    }, [initialValue]);



    useEffect(() => {

        if (reset) {
            setField("")
            onChange(initialValue);
        }
        // }
    }, [reset]);


    const configTextField = {
        // ...field,
        ...otherProps,
        variant: "outlined",
        fullWidth: true,
    };

    const handleChange = (event) => {
        const { value } = event.target;
        setField(value);

        if (!ignoreTrim)
          value.trim()

        if (onChange){
            if (numberInput){
                putMask(value,event)
            }else{
                onChange(value);
            }

        }
    };


    const putMask = (value,event) => {

        let x = value.replace(/\D/g, '')
        value=x

            setField(value)
            if (onChange){
                onChange(value)
            }

    };

    return (
        <>
            {title &&!hidden&& (
                <div className={"custom-label text-bold text-blue mb-0 ellipsis-end"}>
                    {/*<span className="mr-1">{title}</span>*/}
                    <span
                        dangerouslySetInnerHTML={{__html:title}}
                        className={"title-bold"} style={{ textTransform: "capitalize" }} />
                    {details && (
                        <CustomPopover  {...otherProps} heading={detailsHeading} text={details}>
                            <InfoIcon />
                        </CustomPopover>
                    )}
                </div>
            )}
            {explanation && (
                <div className={"text-gray-light  mb-0 ellipsis-end"}>{explanation}</div>
            )}

            <div className={`${type !== "hidden" ? "field-box " : "d-none"} ${noMargin?"":"mb-2"}`}>
                <CustomizedInput
                    disabled={disabled}
                    type={type}
                    variant="outlined"
                    label={label}
                    hidden={hidden}
                    value={field}
                    className={error && "border-red-error"}
                    onChange={handleChange}
                    name={name}
                    {...configTextField}

                />
            </div>
            {error && (
                <span
                    style={{ color: "#f44336", fontSize: "12px!important" }}
                    className="text-danger">
                    {error.message}
                </span>
            )}
        </>
    );
};

export default TextFieldWrapper;
