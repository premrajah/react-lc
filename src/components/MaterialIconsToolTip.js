import React from 'react'
import {Tooltip} from "@material-ui/core";

const MaterialIconsToolTip = ({title, placement, arrow, children}) => {
    return <Tooltip title={title} placement={placement ? placement : 'bottom'} arrow={arrow ? true : false}>
        {children}
    </Tooltip>
}

export default MaterialIconsToolTip;