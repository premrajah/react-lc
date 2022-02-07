import React from 'react'
import {Link} from "react-router-dom";

const BlueBorderLink = ({children,fullWidth, ...otherProps}) => {



    return <Link className={` btn btn-link blue-btn-border btn-blue ${fullWidth?"fullWidth":""}`} {...otherProps} >{otherProps.title}</Link>


}

export default BlueBorderLink;
