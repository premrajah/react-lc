import React, { useEffect, useState } from "react";
import CustomizedInput from "./CustomizedInput";
import CustomPopover from "../CustomPopover";
import InfoIcon from "./InfoIcon";
import { InputAdornment } from "@mui/material";

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
    readonly, ignoreTrim,
    height,
    customReadOnly, reset, noMargin,
    editMode,
    numberInput,
    startAdornment, endAdornment,classAdd,
    ...otherProps
}) => {

    const [field, setField] = useState("");

    useEffect(() => {

        if (onChange) {

            setField(initialValue ?? '')
            // if (!editMode) {

                onChange(initialValue);
            // }

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

        if (onChange) {
            if (numberInput) {
                putMask(value, event)
            } else {
                onChange(value);
            }

        }
    };


    const putMask = (value, event) => {

        let x = value.replace(/\D/g, '')
        value = x

        setField(value)
        if (onChange) {
            onChange(value)
        }

    };

    return (
        <>
            {title && !hidden && (
                <div className={"custom-label text-bold text-blue mb-0 ellipsis-end"}>
                    {/*<span className="mr-1">{title}</span>*/}
                    <span
                        dangerouslySetInnerHTML={{ __html: title }}
                        className={"title-bold"} style={{ textTransform: "capitalize" }} />
                    {details && (
                        <CustomPopover  {...otherProps} heading={detailsHeading} text={details}>
                            <InfoIcon />
                        </CustomPopover>
                    )}
                </div>
            )}


            <div  className={`${classAdd}  ${type !== "hidden" ? "field-box " : "d-none"} ${noMargin ? "" : "mb-2"}`} >
                <CustomizedInput
                    // defaultValue={"name"}

                    // padding={height}
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
                    startAdornment={startAdornment ? <InputAdornment position="start">{startAdornment}</InputAdornment> : ""}
                    endAdornment={endAdornment ? <InputAdornment position="end ">{endAdornment}</InputAdornment> : ""}


                />
                {explanation && (
                    <span className={"text-gray-light text-12 m-0 ellipsis-end"}>{explanation}</span>
                )}
            </div>
            {}
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
