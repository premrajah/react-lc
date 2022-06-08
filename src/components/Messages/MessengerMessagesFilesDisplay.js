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
import moment from "moment/moment";

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
                                <div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <a
                                                className="text-pink"
                                                href={artifacts && artifacts.blob_url}
                                                type={artifacts && artifacts.blob_content}
                                                target="_blank"
                                            >
                                                Download
                                            </a>
                                        </div>
                                        <small className="text-mute">{moment(artifacts._ts_epoch_ms).fromNow()}</small>
                                    </div>
                                </div>

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
