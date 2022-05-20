import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import {IconButton, List, Skeleton, Tooltip} from "@mui/material";
import MessengerMessagesTwoGroupItem from "./MessengerMessagesTwoGroupItem";
import MessengerMessagesTwoSelectedMessage from "./MessengerMessagesTwoSelectedMessage";
import MenuItem from "@mui/material/MenuItem";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import MessengerMessagesTwoFilterChats from "./MessengerMessagesTwoFilterChats";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MessengerMessagesTwoOrgSearch from "./MessengerMessagesTwoOrgSearch";
import WysiwygEditor from "./WysiwygEditor";
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import {LoaderAnimated} from "../../Util/GlobalFunctions";

const newMessagePlaceHOlder = {"message_group": {"_id": 0}, "orgs": [{"name": "New Message", "email": "new@new.com"}]}


const MessengerMessagesTwo = ({ loading, userDetail, showSnackbar }) => {

    const resetDraftRef = useRef(null);
    const orgSearchRef = useRef(null);

    const [allGroups, setAllGroups] = useState([]);
    const [clickedMessage, setClickedMessage] = useState([]);
    const [clickedMessageKey, setClickedMessageKey] = useState(null);
    const [selectedMenuItemIndex, setSelectedMenuItemIndex] = useState(null);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [filterVisibility, setFilterVisibility] = useState(false);
    const [orgSearchVisibility, setOrgSearchVisibility] = useState(false);
    const [filterValues, setFilterValues] = useState("");
    const [messageText, setMessageText] = useState("");
    const [selectedOrgs, setSelectedOrgs] = useState([]);
    const [newMessageDisplay, setNewMessageDisplay] = useState(null);

    useEffect(() => {
        setSelectedMenuItemIndex(0);
        getAllMessageGroups();
    }, []);

    const getAllMessageGroups = () => {
        axios
            .get(`${baseUrl}message-group/non-empty/expand`)
            .then((res) => {
                const data = res.data.data;

                setAllGroups(data);
                setFilteredGroups(data);

                // on first load handle click
                // if (selectedMenuItemIndex === 0) {
                    handleSelectedItemCallback(0);
                    handleGroupClickCallback(data[0].message_group._key);
                // }
            })
            .catch((error) => {
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
            });
    };

    const getSelectedGroupMessage = (key) => {
        if(!key) return;

        setClickedMessageKey(key);

        axios
            .get(`${baseUrl}message-group/${key}/message`)
            .then((res) => {
                setClickedMessage(res.data.data.reverse());
            })
            .catch((error) => {
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
            });
    };

    const handleGroupClickCallback = (key) => {
        setClickedMessage([]); // clear selected message
        getSelectedGroupMessage(key);
    };

    const handleSelectedItemCallback = (selectedIndex) => {
        setSelectedMenuItemIndex(selectedIndex);
    };

    const handleFilterCallback = (values) => {
        setFilterValues(values);
        if (filterValues) {
            let temp = allGroups.filter((g, index) => {
                return (
                    g.message_group.name &&
                    g.message_group.name.toLowerCase().includes(values.toLowerCase())
                );
            });

            setFilteredGroups(temp);
        } else {
            setFilteredGroups(allGroups);
        }
    };

    const handleFilterVisibility = () => {
        setFilterVisibility(!filterVisibility);

        if (filterVisibility) {
            setFilteredGroups(allGroups);
        }
    };

    const handleOrgSelectVisibility = () => {
        setOrgSearchVisibility(!orgSearchVisibility);

        if(!orgSearchVisibility) {
            setFilteredGroups([newMessagePlaceHOlder, ...allGroups]);
            handleSelectedItemCallback(0)
            handleGroupClickCallback("")
            setNewMessageDisplay("Select Orgs to send New Message");
        }

        if(filteredGroups[0].message_group._id === 0) {
            setFilteredGroups(allGroups); // remove temp new message
            handleClearOrgSearch();
            handleSelectedItemCallback(0);
            handleGroupClickCallback(allGroups[0].message_group._key);
            setNewMessageDisplay(null);
        }
    }


    const handleClearInputCallback = (v) => {
      if(!v) return;

      setFilteredGroups(allGroups);
        handleSelectedItemCallback(0);
        handleGroupClickCallback(allGroups[0].message_group._key);
    }

    const handleRichTextCallback = (value) => {
        setMessageText(value);
    };

    const handleOrgSelectedCallback = (value) => {
        setSelectedOrgs(value);
    }

    const handleGroupDataDisplay = (group, index) => {
        return (
            <MenuItem
                button
                divider
                dense
                disableGutters
                key={`${index}_${group.message_group._key}`}
                selected={selectedMenuItemIndex === index}
                style={{ whiteSpace: "normal" }}>
                <MessengerMessagesTwoGroupItem
                    group={group}
                    index={index}
                    handleGroupClickCallback={handleGroupClickCallback}
                    handleSelectedItemCallback={handleSelectedItemCallback}
                />
            </MenuItem>
        );
    };

    const handleResetWysiwygEditor = () => {
        resetDraftRef.current.resetDraft();
        setMessageText("");
    }

    const handleClearOrgSearch = () => {
        orgSearchRef.current.clearValue();
    }

    const handleSendMessage = () => {
        let payload = {};
        if(selectedOrgs.length > 0 && messageText) {

            const orgIds = [];
            selectedOrgs.map(o => orgIds.push(o.value));

            payload = {
                message: {
                    type: "message",
                    text: messageText,
                },
                to_org_ids: orgIds,
            };

            postMessage(payload, "N")

        } else {

            payload = {
                message: {
                    type: "message",
                    text: messageText,
                },
                to_org_ids: [],
                message_group_id: clickedMessageKey,
            };

            postMessage(payload, "R");
        }

    }

    const postMessage = (payload, messageType) => {
        axios
            .post(`${baseUrl}message/chat`, payload)
            .then((response) => {
                let data = response.data.data;

                resetDraftRef.current.resetDraft();
                // getAllMessageGroups();

                if(messageType === "N") {
                    // console.log('N ', data)

                    handleClearOrgSearch(); // clear selected orgs
                    getAllMessageGroups();
                }

                if(messageType === "R") {
                    // console.log('R ', data)
                    handleSelectedItemCallback(selectedMenuItemIndex);
                    handleGroupClickCallback(data.message_group._key);
                    // const returned = allGroups.filter(m => m.message_group._key === data.message_group._key);
                    // console.log("r ", returned)
                }
            })
            .catch(error => {
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
            })
    }

    return (
        <React.Fragment>
            <div className="row" style={{ height: "45px" }}>
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-md-10 d-flex justify-content-around">
                            {filterVisibility && (
                                <>
                                    <MessengerMessagesTwoFilterChats
                                        handleFilerCallback={(v) => handleFilterCallback(v)}
                                        handleClearInputCallback={(v) => handleClearInputCallback(v)}
                                    />
                                    <div className="d-flex justify-content-start align-items-center">
                                        {filteredGroups.length}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="col-md-1">
                            <Tooltip title="Filter chats">
                                <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{ height: "45px" }}>
                                    <FilterListIcon onClick={() => handleFilterVisibility()} />
                                </div>
                            </Tooltip>
                        </div>

                        <div className="col-md-1">
                            <Tooltip title="New Chat">
                                <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{ height: "45px" }}>
                                    <AddCircleIcon onClick={() => handleOrgSelectVisibility()} />
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    {orgSearchVisibility && <MessengerMessagesTwoOrgSearch ref={orgSearchRef} handleOrgSelectedCallback={(v) => handleOrgSelectedCallback(v)}/>}
                </div>
            </div>

            <div className="row">
                <div className="col-md-4">
                    {filteredGroups.length > 0 ? (
                        <List
                            sx={{
                                height: "500px",
                                minHeight: "500px",
                                maxHeight: "500px",
                                overflow: "auto",
                                bgColor: "background.paper",
                            }}>
                            {filteredGroups.map((g, index) => handleGroupDataDisplay(g, index))}
                        </List>
                    ) : <div>
                        <Skeleton className="mb-1" variant="rectangular" height="40px" />
                        <Skeleton className="mb-1" variant="rectangular" height="40px" />
                        <Skeleton className="mb-1" variant="rectangular" height="40px" />
                        <Skeleton variant="rectangular" height="40px" />
                    </div>}
                </div>
                <div className="col-md-8">
                    <div className="row">
                        <div className="col" style={{ height: "500px", minHeight: "500px"}}>
                            {clickedMessage.length > 0 && (
                                <div style={{ height: "500px", minHeight: "500px", maxHeight: "500px", overflow: "auto" }}>
                                    <MessengerMessagesTwoSelectedMessage messages={clickedMessage} />
                                </div>
                            )}
                            {newMessageDisplay && <div className="row mt-2">
                                <div className="col">
                                    {selectedOrgs.length === 0 && <div>{newMessageDisplay}</div>}
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            {selectedOrgs.length > 0 && <small>Selected: {selectedOrgs.map(o => <span className="mr-1"><span>{o.label}</span>{selectedOrgs.length > 1 && <span>, </span>}</span> )}</small>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-11">
                            <WysiwygEditor
                                allOrgs={allGroups}
                                ref={resetDraftRef}
                                richTextHandleCallback={(value) =>
                                    handleRichTextCallback(value)
                                }
                            />
                        </div>
                        <div className="col-sm-1 d-flex justify-content-center align-items-center">
                            <div>
                                <Tooltip title="Clear" placement="right-start" arrow>
                                    <IconButton disabled={!messageText} onClick={() => handleResetWysiwygEditor()}>
                                        <ClearIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Send" placement="right-end" arrow>
                                    <IconButton disabled={!messageText} onClick={() => handleSendMessage()}>
                                        <SendIcon fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessagesTwo);
