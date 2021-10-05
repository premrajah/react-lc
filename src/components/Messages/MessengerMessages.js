import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import { Divider, List, ListItem, ListItemIcon } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import MessageIcon from "@material-ui/icons/Message";
import CreateIcon from "@material-ui/icons/Create";
import TextField from "../FormsUI/ProductForm/TextField";
import {useRouteMatch} from "react-router-dom";

const msgWindowHeight = "500px";

const MessengerMessages = ({ userDetail, messages, getMessages }) => {
    const [allOrgs, setAllOrgs] = useState([]);
    const [allMessageGroups, setAllMessageGroups] = useState([]);
    const [autoCompleteOrg, setAutoCompleteOrg] = useState("");
    const [userOrg, setUserOrg] = useState("");
    const [selectedMsgGroup, setSelectedMsgGroup] = useState([]);

    const [msgDisplay, setMsgDisplay] = useState(true);
    const [matchDisplay, setMatchDisplay] = useState(false);
    const [cycleDisplay, setCycleDisplay] = useState(false);

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
                setAllOrgs(response.data.data);
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
        if(!id) return;
        axios
            .get(`${baseUrl}message-group/${id}/message`)
            .then(response => {
                console.log('gm ', response.data.data)
                setSelectedMsgGroup(response.data.data);
            })
            .catch(error => {
                console.log('group message error ', error.message);
            })
    }

    const handleGroupClick = (groupId) => {
        if(!groupId) return;
        getGroupMessageWithId(groupId);
    };

    const handleColumnDisplay = (value) => {
        setSelectedMsgGroup([]);
        switch (value) {
            case "message":
                setMatchDisplay(false);
                setCycleDisplay(false);
                setMsgDisplay(true);
                break;
            case "match":
                setMsgDisplay(false);
                setCycleDisplay(false);
                setMatchDisplay(true);
                break;
            case "cycle":
                setMsgDisplay(false);
                setMatchDisplay(false);
                setCycleDisplay(true);
                break;
            case "new":
                setMsgDisplay(false);
                setMatchDisplay(false);
                setCycleDisplay(false);
        }
    };

    return (
        <>
            <div className="row mb-2">
                <div className="col-md-2">
                    <CreateIcon fontSize="large" style={{ cursor: "pointer" }} onClick={() => handleColumnDisplay("new")} />
                </div>
            </div>
            <Divider />
            <div className="row mt-2">
                {/*{console.log("Mes ", messages)}*/}
                {/*{console.log("Orgs ", allOrgs)}*/}
                {/*{console.log("MG ", allMessageGroups)}*/}
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
                        <div className="message-search-field mb-3">
                            <Autocomplete
                                freeSolo
                                onChange={(e, value) => setAutoCompleteOrg(value)}
                                options={
                                    allOrgs.length > 0
                                        ? allMessageGroups.map((option) =>
                                              option.name ? option.name : ""
                                          )
                                        : ""
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search for group"
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{ ...params.InputProps, type: "search" }}
                                    />
                                )}
                            />
                        </div>

                        <h5 style={{ color: "var(--lc-purple)" }}>Group Messages</h5>
                        {allMessageGroups.length === 0 && <div>No group chats yet. </div>}
                        <List
                            className="message-groups"
                            style={{ height: msgWindowHeight, maxHeight: msgWindowHeight, overflow: "auto" }}>
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
                                            <ListItem button divider onClick={() => handleGroupClick(group._key)}>
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

                {
                    matchDisplay && <div className="col-md-4">
                        Match
                    </div>
                }

                {
                    cycleDisplay && <div className="col-md-4">
                        cycle
                    </div>
                }


                {(msgDisplay || matchDisplay || cycleDisplay) && <div className="col-md-7">
                    <div
                        className="row"
                        style={{height: msgWindowHeight, maxHeight: msgWindowHeight, overflow: "auto"}}>
                        <div className="col">
                            {selectedMsgGroup.length > 0 ? <div
                                className="message-window p-3"
                                style={{background: "var(--lc-bg-gray)", height: msgWindowHeight}}>
                                {selectedMsgGroup.length > 0
                                    ? selectedMsgGroup.map((m, i) => (
                                        <div key={i} className="d-flex">
                                            <div>{m.message.text}</div>
                                        </div>
                                    ))
                                    : ""}
                            </div> : <div></div>}
                        </div>
                    </div>
                </div>}


            </div>

            <div className="row" style={{ height: "60px", background: "red" }}>
                <div className="col d-flex align-items-center">
                    <div className="message-reply col">text {autoCompleteOrg}</div>
                </div>
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
