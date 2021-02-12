import React from "react";
import moment from "moment/moment";
import NotIcon from "@material-ui/icons/Notifications";
import DeleteIcon from "@material-ui/icons/Delete";
import {Card, CardContent} from "@material-ui/core";

const NotificationItem = ({ item, editText, onClose }) => {
    const { message, orgs } = item;

    const handleOnClose = (key) => {
        onClose(key);
    };

    return (
        <Card variant="outlined" className="mb-2">
            <CardContent >
                <div className="row">
                    <div className="col-1">
                        <NotIcon style={{ color: "#eee" }} />
                    </div>
                    <div className={"col-8"}>
                        <span dangerouslySetInnerHTML={{ __html: editText ? editText : "" }} />
                    </div>

                    <div className="col-2">{moment(message._ts_epoch_ms).fromNow()}</div>
                    <div className="col-1 d-flex justify-content-end">
                        <DeleteIcon style={{ color: "#eee", cursor: 'pointer' }} onClick={() => handleOnClose(message._key)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default NotificationItem;
