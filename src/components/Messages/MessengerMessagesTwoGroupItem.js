import React from "react";
import { Chip, Divider, ListItem, ListItemText } from "@mui/material";
import OrgComponent from "../Org/OrgComponent";

const MessengerMessagesTwoGroupItem = ({ group, index, handleGroupClickCallback }) => {

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

    return (
        <>
            <ListItem alignItems="flex-start" onClick={() => handleGroupClickCallback(group)} style={{cursor: "pointer"}}>
                <ListItemText
                    primary={
                        group.orgs.length > 0 &&
                        group.orgs.map((org, index) => handleOrgDisplay(org, index))
                    }
                />
            </ListItem>
            <Divider style={{ background: "var(--lc-purple)", opacity: "0.3" }} />
        </>
    );
};

export default MessengerMessagesTwoGroupItem;
