import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {
    Avatar, Checkbox,
    Divider,
    List,
    ListItem,
    ListItemAvatar, ListItemSecondaryAction,
    ListItemText,
    TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

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
            <div className="row">
                {console.log("Mes ", messages)}
                {/*{console.log("Orgs ", allOrgs)}*/}
                {/*{console.log("MG ", allMessageGroups)}*/}
                <div className="col-md-5">
                    <div className="message-search-field mb-3">
                        <Autocomplete
                            freeSolo
                            onChange={(e, value) => setAutoCompleteOrg(value)}
                            options={
                                allOrgs.length > 0
                                    ? allOrgs.map((option) => (option.email ? option.email : ""))
                                    : ""
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search for Org by email"
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{ ...params.InputProps, type: "search" }}
                                />
                            )}
                        />
                    </div>

                    <div className="mb-1">Organizations</div>
                    <List
                        className="message-orgs"
                        style={{ height: "300px", maxHeight: "550px", overflow: "auto" }}>
                        {allOrgs.length > 0 ?
                            allOrgs
                                .filter((val) => {
                                    if (val.email) {
                                        if (autoCompleteOrg === "" || autoCompleteOrg === "null") {
                                            return val;
                                        } else if (
                                            val.email
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
                                .map((item, i) => (
                                    <div key={i}>
                                        <ListItem
                                            onClick={() => handleOrgClick()}
                                            button
                                            alignItems="flex-start"
                                            divider
                                            key={item._id}
                                            className="mb-2">
                                            <ListItemAvatar className="mr-1">
                                                <Avatar>
                                                    {item.email
                                                        ? item.email.substr(0, 2).toUpperCase()
                                                        : ""}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={item.name ? item.name : ""}
                                                secondary={item.email ? item.email : ""}
                                            />
                                        </ListItem>
                                    </div>
                                )): <div>Loading...</div>}
                    </List>

                    <Divider className="mt-2" />
                    <div>Group Messages</div>
                    {allMessageGroups.length === 0 && <div>No group chats yet. </div>}
                    <List
                        className="message-groups"
                        style={{ height: "300px", maxHeight: "300px", overflow: "auto" }}>
                        {allMessageGroups.length > 0 ?
                        allMessageGroups.map((group, i) => (
                            <div key={i}>
                                <ListItem button divider>
                                    {group.name}
                                </ListItem>
                            </div>
                        )): <div>Loading...</div>}
                    </List>
                </div>
                <div
                    className="col-md-7"
                    >
                    <div className="row" style={{ height: "600px", maxHeight: "600px", overflow: "auto" }}>
                        <div className="col">
                            <div className="message-window">
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

                    <div className="row mt-5" style={{height: "60px", background: "red"}}>
                        <div className="col d-flex align-items-center">
                            <div className="message-reply col">text {autoCompleteOrg}</div>
                        </div>
                    </div>
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
