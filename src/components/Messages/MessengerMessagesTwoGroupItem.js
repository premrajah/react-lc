import React from "react";
import { Chip, Divider, ListItem, ListItemText } from "@mui/material";
import OrgComponent from "../Org/OrgComponent";

const MessengerMessagesTwoGroupItem = ({ groups, index }) => {
    const handleOrgDisplay = (group, index) => {
        return (
            <Chip
                label={
                    <>
                        <span key={index}>
                            <OrgComponent org={group} colorClass="blue-text" />
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
            <ListItem alignItems="flex-start">
                <ListItemText
                    primary={
                        groups.orgs.length > 0 &&
                        groups.orgs.map((group, index) => handleOrgDisplay(group, index))
                    }
                />
            </ListItem>
            <Divider style={{ background: "var(--lc-purple)", opacity: "0.3" }} />
        </>
    );
};

export default MessengerMessagesTwoGroupItem;
