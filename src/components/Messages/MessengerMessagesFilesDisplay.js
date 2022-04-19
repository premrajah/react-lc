import React from "react";
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from "@mui/material";

const MessengerMessagesFilesDisplay = ({ artifacts }) => {

    return (
        <>
            {artifacts && <List sx={{width: "100%", maxWidth: "100%", bgcolor: "background.paper"}}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt={artifacts && artifacts.name} src={artifacts && artifacts.blob_url}/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={artifacts && artifacts.name}
                        secondary={
                            <React.Fragment>
                                <a
                                    className="text-pink"
                                    href={artifacts && artifacts.blob_url}
                                    type={artifacts && artifacts.blob_content}
                                    target="_blank"
                                >
                                    {artifacts &&  artifacts.name}
                                </a>
                            </React.Fragment>
                        }
                    />
                </ListItem>
                <Divider variant="outlined" component="li"/>
            </List>}
        </>
    );
};

export default MessengerMessagesFilesDisplay;
