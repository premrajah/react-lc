import React from 'react'
import {Link} from "react-router-dom";

const GreenBorderLink = ({children,fullWidth, ...otherProps}) => {



    return <Link className={`  btn-link-custom green-border-btn ${fullWidth?"fullWidth":""}`} {...otherProps} >{otherProps.title}</Link>


}

export default GreenBorderLink;
