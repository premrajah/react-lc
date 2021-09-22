import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {value} from "lodash/seq";

const MessengerMessages = ({ messages, getMessages }) => {
    const [allOrgs, setAllOrgs] = useState([]);
    const [autoCompleteOrg, setAutoCompleteOrg] = useState("");

    useEffect(() => {
        getAllOrgs();
        getMessages();
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

    const autoCompleteOnChange = (e, value) => {
        setAutoCompleteOrg(value);
    }

    return (
        <div className="row">
            {/*Messenger messages*/}
            {console.log(">>> ", allOrgs, messages)}
            <div className="col-md-5">
                <div className="message-search-field mb-3">
                    <Autocomplete
                        freeSolo
                        onChange={(e, value) => autoCompleteOnChange(e, value)}
                        options={allOrgs.length > 0 ? allOrgs.map(option => option.email ? option.email : "") : ""}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search input"
                                margin="normal"
                                variant="outlined"
                                InputProps={{ ...params.InputProps, type: 'search' }}
                            />
                        )}
                    />
                </div>
                <List className="message-orgs">
                    {allOrgs.length > 0
                        ? allOrgs.map((item) => (
                              <div>
                                  <ListItem button alignItems="flex-start" divider key={item._id} className="mb-2">
                                      <ListItemAvatar className="mr-1">
                                          <Avatar>
                                              {item.email
                                                  ? item.email.substr(0, 2).toUpperCase()
                                                  : ""}
                                          </Avatar>
                                      </ListItemAvatar>
                                      <ListItemText primary={item.name ? item.name : ""} secondary={item.email ? item.email : ""} />
                                  </ListItem>
                              </div>
                          ))
                        : ""}
                </List>
            </div>
            <div className="col-md-7">
                <div className="message-window">
                    {messages.length > 0 ? messages.map((m, i) => (
                        <div>{m.message.text}</div>
                    )) : ""}
                </div>
                <div className="message-reply">text {autoCompleteOrg}</div>
            </div>
        </div>
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
