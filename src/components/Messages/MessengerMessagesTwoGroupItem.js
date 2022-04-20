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
        handleGroupClickCallback(group);
    }

    return (
        <>
            <ListItem alignItems="flex-start" onClick={() => handleListItemClick()} style={{cursor: "pointer"}}>
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
