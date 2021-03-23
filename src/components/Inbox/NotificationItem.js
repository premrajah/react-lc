import React from "react";
import moment from "moment/moment";
import NotIcon from "@material-ui/icons/Notifications";
import {Card, CardContent} from "@material-ui/core";
import MoreMenu from "../MoreMenu";

const NotificationItem = ({ item, editText, onClose }) => {
    const { message, orgs } = item;

    const handleOnClose = (key) => {
        onClose(key);
    };

    return (
        <Card variant="outlined" className="mb-2">
            <CardContent>
                <div className="row">
                    <div className={"col-12"}>
                        <NotIcon
                            style={{
                                color: "#eee",
                                float: "left",
                                marginRight: "15px",
                                marginTop: "3px",
                            }}
                        />
                        <p
                            style={{ float: "left", marginBottom: "0" }}
                            dangerouslySetInnerHTML={{ __html: editText ? editText : "" }}></p>

                        <span className="text-mute time-text">
                            {moment(message._ts_epoch_ms).fromNow()}
                        </span>

                        <span style={{ float: "right" }}>
                            <MoreMenu delete={true} />
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default NotificationItem;
