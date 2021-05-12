import React from "react";
import moment from "moment/moment";
import NotIcon from "@material-ui/icons/Notifications";
import { Card, CardContent } from "@material-ui/core";
import MoreMenu from "../MoreMenu";

const NotificationItem = ({ item, editText }) => {
    const { message, orgs } = item;


    return (
        <Card variant="outlined" className="mb-2">
            <CardContent>
                <div className="row">
                    <div className="col-12">
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

                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default NotificationItem;
