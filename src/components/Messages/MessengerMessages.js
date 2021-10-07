import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import { Button, Divider, List, ListItem, ListItemIcon } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import MessageIcon from "@material-ui/icons/Message";
import CreateIcon from "@material-ui/icons/Create";
import SendIcon from "@material-ui/icons/Send";
import TextField from "../FormsUI/ProductForm/TextField";
import moment from "moment/moment";
import Select from "react-select";

const msgWindowHeight = "560px";

const MessengerMessages = ({ userDetail, messages, getMessages }) => {
    const [allOrgs, setAllOrgs] = useState([]);
    const [allMessageGroups, setAllMessageGroups] = useState([]);
    const [autoCompleteOrg, setAutoCompleteOrg] = useState("");
    const [userOrg, setUserOrg] = useState("");
    const [selectedMsgGroup, setSelectedMsgGroup] = useState([]);
    const [reactSelectValues, setReactSelectValues] = useState([]);
    const [reactSelectedValues, setReactSelectedValues] = useState([]);
    const [messageText, setMessageText] = useState("");

    const [msgDisplay, setMsgDisplay] = useState(true);
    const [matchDisplay, setMatchDisplay] = useState(false);
    const [cycleDisplay, setCycleDisplay] = useState(false);
    const [newMsgDisplay, setNewMsgDisplay] = useState(false);

    useEffect(() => {
        getAllOrgs();
        getAllMessageGroups();
        // getMessages();
    }, []);

    useEffect(() => {
        setUserOrg(userDetail.orgId);
    }, []);

    const getAllOrgs = () => {
        axios
            .get(`${baseUrl}org/all`)
            .then((response) => {
                const res = response.data.data;
                setAllOrgs(res);

                const temp = [];
                res.map((r) => {
                    if (r.email !== null) {
                        temp.push({ value: r._id, label: r.email });
                    }
                });
                setReactSelectValues(temp);
            })
            .catch((error) => {
                console.log("all orgs errors ", error.message);
            });
    };

    const getAllMessageGroups = () => {
        axios
            .get(`${baseUrl}message-group`)
            .then((response) => {
                setAllMessageGroups(response.data.data);
            })
            .catch((error) => {
                console.log("message-group-error ", error.message);
            });
    };

    const getGroupMessageWithId = (id) => {
        if (!id) return;
        axios
            .get(`${baseUrl}message-group/${id}/message`)
            .then((response) => {
                setSelectedMsgGroup(response.data.data);
            })
            .catch((error) => {
                console.log("group message error ", error.message);
            });
    };

    const handleNewMessageSelect = (e) => {
        if (!e) return;
        const temp = [];
        e.map((v) => {
            temp.push(v.value);
        });
        setReactSelectedValues(temp);
    };

    const handleGroupClick = (groupId) => {
        if (!groupId) return;
        getGroupMessageWithId(groupId);
    };

    const sendMessage = (text, toOrgIds, messageGroupId, linkedMessageId, messageType) => {
        if (!text) return;

        let payload = {};

        switch (messageType) {
            case "new_message":
                payload = {
                    message: {
                        type: "message",
                        text: text,
                    },
                    to_org_ids: toOrgIds,
                };
                break;
            case "group_message":
                payload = {
                    message: {
                        type: "message",
                        text: text,
                    },
                    to_org_ids: [],
                    message_group_id: messageGroupId,
                };
                break;
        }

        postMessage(payload);
    };

    const postMessage = (payload) => {
        axios
            .post(`${baseUrl}message/chat`, payload)
            .then((response) => {
                if (response.status === 200) {
                    // getMessages();
                    setMessageText("");
                    setReactSelectedValues([]);
                    getAllMessageGroups();
                }
            })
            .catch((error) => {
                console.log("postMessage error ", error.message);
            });
    };

    const handleSendMessage = () => {
        if (reactSelectedValues.length > 0) {
            sendMessage(messageText, reactSelectedValues, "", "", "new_message");
        }
    };

    const handleColumnDisplay = (value) => {
        setSelectedMsgGroup([]);
        switch (value) {
            case "message":
                setMatchDisplay(false);
                setCycleDisplay(false);
                setNewMsgDisplay(false);
                setMsgDisplay(true);
                break;
            case "match":
                setMsgDisplay(false);
                setCycleDisplay(false);
                setNewMsgDisplay(false);
                setMatchDisplay(true);
                break;
            case "cycle":
                setMsgDisplay(false);
                setMatchDisplay(false);
                setNewMsgDisplay(false);
                setCycleDisplay(true);
                break;
            case "new":
                setNewMsgDisplay(true);
        }
    };

    return (
        <>
            <div className="row mt-2">
                <div className="row">
                    <div className="col-md-1">
                        <List>
                            <ListItem button onClick={() => handleColumnDisplay("message")}>
                                <ListItemIcon>
                                    <MessageIcon fontSize="large" />
                                </ListItemIcon>
                            </ListItem>
                            <ListItem button onClick={() => handleColumnDisplay("match")}>
                                <ListItemIcon>Match</ListItemIcon>
                            </ListItem>
                            <ListItem button onClick={() => handleColumnDisplay("cycle")}>
                                <ListItemIcon>Cycle</ListItemIcon>
                            </ListItem>
                        </List>
                    </div>
                </div>
                {msgDisplay && (
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col">
                                <div className="d-flex justify-content-around align-items-center">
                                    <h5 style={{ width: "80%", color: "var(--lc-purple)" }}>
                                        Group Messages
                                    </h5>
                                    <Button onClick={() => handleColumnDisplay("new")}>
                                        <CreateIcon />
                                    </Button>
                                </div>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col">
                                <Autocomplete
                                    freeSolo
                                    onChange={(e, value) => setAutoCompleteOrg(value)}
                                    options={
                                        allOrgs.length > 0
                                            ? allMessageGroups.map((option) =>
                                                option.name ? option.name : ""
                                            )
                                            : []
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search for group"
                                            margin="normal"
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                type: "search",
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {allMessageGroups.length === 0 && <div>No group chats yet. </div>}
                        <List
                            className="message-groups"
                            style={{
                                height: msgWindowHeight,
                                maxHeight: msgWindowHeight,
                                overflow: "auto",
                            }}>
                            {allMessageGroups.length > 0 ? (
                                allMessageGroups
                                    .filter((val) => {
                                        if (val.name) {
                                            if (
                                                autoCompleteOrg === "" ||
                                                autoCompleteOrg === "null"
                                            ) {
                                                return val;
                                            } else if (
                                                val.name
                                                    .toLowerCase()
                                                    .includes(
                                                        autoCompleteOrg
                                                            ? autoCompleteOrg.toLowerCase()
                                                            : setAutoCompleteOrg("")
                                                    )
                                            ) {
                                                return val;
                                            }
                                        }
                                    })
                                    .map((group, i) => (
                                        <div key={i}>
                                            <ListItem
                                                button
                                                divider
                                                onClick={() => handleGroupClick(group._key)}>
                                                {group.name}
                                            </ListItem>
                                        </div>
                                    ))
                            ) : (
                                <div>Loading...</div>
                            )}
                        </List>
                    </div>
                )}

                {matchDisplay && <div className="col-md-4">Match</div>}

                {cycleDisplay && <div className="col-md-4">cycle</div>}

                {(msgDisplay || matchDisplay || cycleDisplay) && (
                    <>
                        <div className="col-md-7">
                            {newMsgDisplay && <div className="row">
                                <div className="col">
                                    {reactSelectValues.length > 0 ? (
                                        <Select
                                            options={reactSelectValues}
                                            isMulti
                                            name="orgs"
                                            className="react-multi-select"
                                            classNamePrefix="select"
                                            onChange={(e) => handleNewMessageSelect(e)}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>}

                            <div
                                className="row"
                                style={{
                                    height: msgWindowHeight,
                                    maxHeight: msgWindowHeight,
                                    overflow: "auto",
                                }}>
                                <div className="col">
                                    {selectedMsgGroup.length > 0 ? (
                                        <div
                                            className="message-window p-3"
                                            style={{ height: msgWindowHeight }}>
                                            {selectedMsgGroup.map((m, i) => (
                                                <div key={i} className="d-flex">
                                                    <div
                                                        className="w-75 p-2 mb-1 border-rounded"
                                                        style={{
                                                            background: "rgba(39, 36, 92, 0.3)",
                                                        }}>
                                                        <div>{m.message.text}</div>
                                                        <div className="float-right">
                                                            {moment(
                                                                m.message._ts_epoch_ms
                                                            ).fromNow()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>click on a group to view messages.</div>
                                    )}
                                </div>
                            </div>

                            <div className="row mt-2" style={{ height: "60px" }}>
                                <div className="col-11 p-0">
                                    <TextField
                                        id="send-new-msg"
                                        label="Send new message"
                                        variant="outlined"
                                        fullWidth
                                        onChange={(text) => setMessageText(text)}
                                        value={messageText || ""}
                                    />
                                </div>
                                <div className="col-1 d-flex justify-content-center align-items-center p-0">
                                    <Button
                                        type="button"
                                        disabled={messageText ? false : true}
                                        fullWidth
                                        onClick={() => handleSendMessage()}>
                                        <SendIcon
                                            fontSize="large"
                                            style={{ color: messageText ? "var(--lc-pink)" : "var(--lc-bg-gray)" }}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </>
    );
};

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        messages: state.messages,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMessages: (data) => dispatch(actionCreator.getMessages(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessages);
