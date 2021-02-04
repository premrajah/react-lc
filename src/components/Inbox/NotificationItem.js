import React from "react";
import { Alert } from "react-bootstrap";
import moment from "moment/moment";
import Org from "../Org/Org";
import {Link} from "react-router-dom";
import {Link as NotifLinkIcon} from '@material-ui/icons'

const NotificationItem = ({ item, editText, onClose }) => {
    const { message, orgs } = item;

    const handleOnClose = (key) => {
        onClose(key);
    };

    return (
        <div>
            <Alert
                variant={message.type === "notification" ? "success" : "primary"}
                onClose={() => handleOnClose(message._key)}
                dismissible>
                <div>
                    {moment(message._ts_epoch_ms).format("DD MMM YYYY")} : {editText}
                </div>
                <div>
                    {orgs.length > 0
                        ? orgs.map((orgItem) => {
                              return (
                                  <span key={message._key + Math.random()}>
                                      {orgItem.actor === "message_from" ? "From: " : "To: "}{" "}
                                      <span className="mr-4">
                                          <Org
                                              orgId={orgItem.org._id}
                                              orgDescription={orgItem.org.description}
                                          />
                                      </span>
                                  </span>
                              );
                          })
                        : null}
                </div>
            </Alert>
        </div>
    );
};

export default NotificationItem;
