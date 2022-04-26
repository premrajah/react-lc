import React from "react";
import { Chip, Divider, ListItem, ListItemText } from "@mui/material";
import OrgComponent from "../Org/OrgComponent";

const MessengerMessagesTwoGroupItem = ({ group, index, handleGroupClickCallback, handleSelectedItemCallback }) => {

    const handleOrgDisplay = (org, index) => {
        return (
            <Chip
                label={
                    <>
                        <span key={index}>
                            <OrgComponent org={org} colorClass="blue-text" />
                        </span>
                    </>
                }
                className="mr-1 mb-1"
                variant="outlined"
            />
        );
    };

    const handleListItemClick = () => {
        handleSelectedItemCallback(index);
        handleGroupClickCallback(group.message_group._key);
    }

    return (
        <>
            <ListItem  onClick={() => handleListItemClick()}>
                <ListItemText
                    primary={
                        group.orgs.length > 0 &&
                        group.orgs.map((org, index) => handleOrgDisplay(org, index))
                    }
                />
            </ListItem>
        </>
    );
};

export default MessengerMessagesTwoGroupItem;
