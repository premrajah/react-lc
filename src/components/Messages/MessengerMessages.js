import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { baseUrl, createMarkup } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {Button, List, ListItem, Tooltip} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import CreateIcon from "@material-ui/icons/Create";
import SendIcon from "@material-ui/icons/Send";
import FilterListIcon from '@material-ui/icons/FilterList';
import TextField from "../FormsUI/ProductForm/TextField";
import moment from "moment/moment";
import Select from "react-select";
import {makeStyles} from "@material-ui/core";
import RichTextEditor from "./RichTextEditor";


const msgWindowHeight = "520px";
const useStyles = makeStyles({
    active: {
        background: "red"
    }
});

const MessengerMessages = ({ userDetail, messages, getMessages }) => {

    const classes = useStyles()
    const reactSelectRef = useRef([]);

    const [allOrgs, setAllOrgs] = useState([]);
    const [allMessageGroups, setAllMessageGroups] = useState([]);
    const [autoCompleteOrg, setAutoCompleteOrg] = useState("");
    const [userOrg, setUserOrg] = useState("");
    const [selectedMsgGroup, setSelectedMsgGroup] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const [reactSelectValues, setReactSelectValues] = useState([]);
    const [reactSelectedValues, setReactSelectedValues] = useState([]);

    const [messageText, setMessageText] = useState("");
    const [showHideGroupFilter, setShowHideGroupFilter] = useState(false);
    const [showHideOrgSearch, setShowHideOrgSearch] = useState(false);


    useEffect(() => {
        getAllOrgs();
        getAllMessageGroups();
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

    const getAllOrgsOffsetAndSize = (offset, size) => {
        if(!offset || !size) return;

        axios
            .get(`${baseUrl}org/all/?${offset}=${offset}&${size}=${size}`)
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

    const handleGroupClick = (groupId, selectedIndex) => {
        if (!groupId) return;
        updateSelected(selectedIndex);

        if(reactSelectedValues.length > 0   ) {
            reactSelectRef.current.clearValue();
        }
        setShowHideGroupFilter(false);
        setShowHideOrgSearch(false);
        getGroupMessageWithId(groupId);
        setSelectedMsgGroup([]);
    };

    const handleRichTextCallback = (value) => {
        setMessageText(value);
    }

    const  updateSelected = (selectedIndex) => {
        setSelectedItem(selectedIndex);
    }


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
            default:
                return;
        }

        postMessage(payload);
    };

    const postMessage = (payload) => {
        axios
            .post(`${baseUrl}message/chat`, payload)
            .then((response) => {
                if (response.status === 200) {

                    setMessageText("");
                    if(reactSelectedValues.length > 0   ) {
                        reactSelectRef.current.clearValue();
                    }
                    getAllMessageGroups();
                    getAllOrgs();
                }
            })
            .catch((error) => {
                console.log("postMessage error ", error.message);
            });
    };

    const handleSendMessage = () => {
        if (messageText && reactSelectedValues.length > 0) {
            sendMessage(messageText, reactSelectedValues, "", "", "new_message");

        } else if (messageText) {
            let messageGroupId = selectedMsgGroup.length > 0 ? selectedMsgGroup[0].message_groups[0]._id : null;

            if(messageGroupId) {
                sendMessage(messageText, [], messageGroupId, "", "group_message");
            }

        }
    };


    return (
        <>
            <div className="row">
                {
                    <div className="col-md-4">

                        <div className="row">
                             <div className="col-md-8">
                                 {showHideGroupFilter && <Autocomplete
                                     size="small"
                                    freeSolo
                                    onChange={(e, value) => setAutoCompleteOrg(value)}
                                    options={
                                        allMessageGroups.length > 0
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
                                />}
                            </div>

                            <div className="col-md-2 d-flex justify-content-center align-items-center">
                                <Tooltip title="Filter groups">
                                    <Button onClick={() => setShowHideGroupFilter(!showHideGroupFilter)}>
                                        <FilterListIcon fontSize="large" />
                                    </Button>
                                </Tooltip>
                            </div>

                            <div className="col-md-2 d-flex justify-content-center align-items-center">
                                <Tooltip title="New Message">
                                    <Button onClick={() => setShowHideOrgSearch(!showHideOrgSearch)}>
                                        <CreateIcon />
                                    </Button>
                                </Tooltip>
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
                                        <div key={i} >
                                            <ListItem
                                                selected={selectedItem === i}
                                                button
                                                divider
                                                onClick={() => handleGroupClick(group._key, i)}>
                                                {group.name.replace(/\W/g, " ")}
                                                {/*{group.name}*/}
                                            </ListItem>
                                        </div>
                                    ))
                            ) : (
                                <div>Loading...</div>
                            )}
                        </List>
                    </div>
                }


                {
                    <>
                        <div className="col-md-7">
                            {showHideOrgSearch && <div className="row">
                                <div className="col">
                                        <Select
                                            options={reactSelectValues.length > 0 ? reactSelectValues : []}
                                            isMulti
                                            placeholder="Search orgs to send messages"
                                            name="orgs"
                                            className="react-multi-select"
                                            classNamePrefix="select"
                                            onChange={(e) => handleNewMessageSelect(e)}
                                            ref={reactSelectRef}
                                        />
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
                                                        <div dangerouslySetInnerHTML={createMarkup(m.message.text)}></div>
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
                                        <div></div>
                                    )}
                                </div>
                            </div>

                            <div className="row mt-2" style={{ height: "60px" }}>
                                <div className="col-11 p-0">
                                    {/*<TextField*/}
                                    {/*    id="send-new-msg"*/}
                                    {/*    label="Send new message"*/}
                                    {/*    variant="outlined"*/}
                                    {/*    fullWidth*/}
                                    {/*    onChange={(text) => setMessageText(text)}*/}
                                    {/*    value={messageText || ""}*/}
                                    {/*/>*/}
                                    <RichTextEditor richTextHandleCallback={(value) => handleRichTextCallback(value)} />
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
                }
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
