import React from "react";
import { Alert } from "react-bootstrap";
import Org from "../Org/Org";
import moment from "moment/moment";
import { Card, CardContent } from "@material-ui/core";
import MoreMenu from "../MoreMenu";

const MessageItem = ({ item, onDelete }) => {
    const { message, orgs } = item;
    const { text, type, _ts_epoch_ms, _neverDelete, _key, _id } = message;

    const handleDeleteMessage = (key) => {
        onDelete(key);
    };

    return (
        <Card variant="outlined" className="mb-2">
            <CardContent variant="secondary">
                <div className="row">
                    <div className="col">
                        <div className="d-flex">
                            {type ? <span className="w-100">{type.toUpperCase()}</span> : null}{" "}
                            <span className="float-right">
                                {_neverDelete ? (
                                    <MoreMenu
                                        delete
                                        triggerCallback={() => handleDeleteMessage(_key)}
                                    />
                                ) : null}
                            </span>
                        </div>
                        <div>{text ? <div>{text}</div> : null}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div>
                            {orgs.map((org) => {
                                return (
                                    <span key={org.org._ts_epoch_ms + Math.random()}>
                                        <span className="mr-1">
                                            {org.actor === "message_from" ? "From:" : "To:"}
                                        </span>
                                        <span className="mr-2">
                                            <Org
                                                orgId={org.org._id}
                                                orgDescription={org.org.description}
                                            />
                                        </span>
                                    </span>
                                );
                            })}
                            <span className="text-mute float-right">
                                {_ts_epoch_ms ? moment(_ts_epoch_ms).fromNow() : null}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MessageItem;
