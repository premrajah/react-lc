import React from 'react';
import {Divider, ListItem, ListItemText} from "@mui/material";
import OrgComponent from "../Org/OrgComponent";

const MessengerMessagesTwoGroupItem = ({groups, index}) => {


    const handleOrgDisplay = (group, index) => {
        return <span key={index} className="mr-1">
            <OrgComponent org={group} colorClass="blue-text" />
        </span>
    }

    return <>
        <ListItem alignItems="flex-start">
            <ListItemText primary={groups.orgs.length > 0 && groups.orgs.map((group, index) => handleOrgDisplay(group, index))} />
        </ListItem>
        <Divider />
    </>
}

export default MessengerMessagesTwoGroupItem;