import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {Divider, List, ListItem, ListItemIcon} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import MessageIcon from '@material-ui/icons/Message';
import CreateIcon from '@material-ui/icons/Create';
import TextField from "../FormsUI/ProductForm/TextField";

const MessengerMessages = ({ userDetail, messages, getMessages }) => {
    const [allOrgs, setAllOrgs] = useState([]);
    const [allMessageGroups, setAllMessageGroups] = useState([]);
    const [autoCompleteOrg, setAutoCompleteOrg] = useState("");
    const [userOrg, setUserOrg] = useState("");


    useEffect(() => {
        getAllOrgs();
        getAllMessageGroups();
        getMessages();
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

    const handleOrgClick = () => {
        console.log(">>> click")
    }


    return (
        <>
            <div className="row mb-2">
                <div className="col-md-2">
                    <CreateIcon fontSize="large" style={{cursor: "pointer"}} />
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
                            <ListItem button>
                                <ListItemIcon>
                                    <MessageIcon fontSize="large" />
                                </ListItemIcon>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    Match
                                </ListItemIcon>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    Cycle
                                </ListItemIcon>
                            </ListItem>
                        </List>
                    </div>
                </div>
                <div className="col-md-5" >
                    <div className="message-search-field mb-3">
                        <Autocomplete
                            freeSolo
                            onChange={(e, value) => setAutoCompleteOrg(value)}
                            options={
                                allOrgs.length > 0
                                    ? allMessageGroups.map((option) => (option.name ? option.name : ""))
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

                    <h5 style={{color: "var(--lc-purple)"}}>Group Messages</h5>
                    {allMessageGroups.length === 0 && <div>No group chats yet. </div>}
                    <List
                        className="message-groups"
                        style={{ height: "500px", maxHeight: "500px", overflow: "auto" }}>
                        {allMessageGroups.length > 0 ?
                        allMessageGroups.filter(val => {
                            if (val.name) {
                                if (autoCompleteOrg === "" || autoCompleteOrg === "null") {
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
                        }).map((group, i) => (
                            <div key={i}>
                                <ListItem button divider>
                                    {group.name}
                                </ListItem>
                            </div>
                        )): <div>Loading...</div>}
                    </List>
                </div>
                <div
                    className="col-md-6"
                    >
                    <div className="row" style={{ height: "500px", maxHeight: "500px", overflow: "auto" }}>
                        <div className="col">
                            <div className="message-window p-3" style={{background: "var(--lc-bg-gray)"}}>
                                {messages.length > 0
                                    ? messages.map((m, i) => (
                                        <div key={i}>
                                            <div>{m.message.text}</div>
                                        </div>
                                    ))
                                    : ""}
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            <div className="row" style={{height: "60px", background: "red"}}>
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
