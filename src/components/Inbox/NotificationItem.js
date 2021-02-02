import React from "react";
import { Alert } from "react-bootstrap";
import moment from "moment/moment";
import Org from "../Org/Org";

const NotificationItem = ({ item }) => {
    const { message, orgs } = item;

    const handleOnClose = (key) => {
        console.log("[NotifItem] ", key);
    };

    return (
        <div>
            <Alert
                variant={message.type === "notification" ? "success" : "primary"}
                onClose={() => handleOnClose(message._key)}
                dismissible>
                <div>
                    {moment(message._ts_epoch_ms).format("DD MMM YYYY")} : {message.text}
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
                                              textColor="black"
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
