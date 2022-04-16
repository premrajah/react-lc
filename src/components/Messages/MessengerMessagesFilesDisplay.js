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
        <List sx={{ width: "100%", maxWidth: "100%", bgcolor: "background.paper" }}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt={artifacts.name} src={artifacts.blob_url} />
                </ListItemAvatar>
                <ListItemText
                    primary={artifacts.name}
                    secondary={
                        <React.Fragment>
                            <a
                                className="text-pink"
                                href={artifacts.blob_url}
                                type={artifacts.blob_content}
                                target="_blank"
                                rel="noreferrer"
                                ref="no-referrer"
                            >
                                {artifacts.name}
                            </a>
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="outlined" component="li" />
        </List>
    );
};

export default MessengerMessagesFilesDisplay;
