import React from 'react'
import {Link} from "react-router-dom";

const BlueBorderLink = ({children, ...otherProps}) => {



    return <Link className={"mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue"} {...otherProps} >{otherProps.title}</Link>


}

export default BlueBorderLink;
