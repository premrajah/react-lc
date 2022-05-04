import React from "react";
import { Chip, Divider, ListItem, ListItemText } from "@mui/material";
import OrgComponent from "../Org/OrgComponent";
import TooltipDisplay from "../Org/TooltipDisplay";

const MessengerMessagesTwoGroupItem = ({
    group,
    index,
    handleGroupClickCallback,
    handleSelectedItemCallback,
}) => {
    const handleOrgDisplay = (org, index) => {
        console.log("> ", org);
        return (
            <React.Fragment
                key={`${index}_${org._ts_epoch_ms}`}>
                <TooltipDisplay org={org}>
                    <Chip label={org.name ? org.name : ""} className="mr-1 mb-1" variant="outlined" />
                </TooltipDisplay>
            </React.Fragment>
        );
    };

    const handleListItemClick = () => {
        handleSelectedItemCallback(index);
        handleGroupClickCallback(group.message_group._key);
    };

    return (
        <>
            <ListItem onClick={() => handleListItemClick()}>
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
