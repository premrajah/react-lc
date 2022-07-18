import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import { IconButton, List, Skeleton, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
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
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import { LoaderAnimated } from "../../Util/GlobalFunctions";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

const newMessagePlaceHOlder = {
    message_group: { _id: 0 },
    orgs: [{ name: "New Message", email: "new@new.com" }],
};

const useStyles = makeStyles((theme) => ({
    customHoverFocus: {
        "&:hover, &.Mui-focusVisible": { color: "var(--lc-purple)" },
    },
    customHoverFocusClearText: {
        "&:hover, &.Mui-focusVisible": { color: "orange" },
    },
}));

const MessengerMessagesTwo = ({ userDetail, showSnackbar }) => {
    const classes = useStyles();

    const resetDraftRef = useRef(null);
    const orgSearchRef = useRef(null);

    const [allGroups, setAllGroups] = useState([]);
    const [trackedMessageGroups, setTrackedMessageGroups] = useState([]);
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
    const [sendButtonDisable, setSendButtonDisable] = useState(false);
    const [selectedMessageGroupKey, setSelectedMessageGroupKey] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [sentMessageGroupKey, setSentMessageGroupKey] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleSelectedItemCallback(0);
        getAllMessageGroups();
        setSendButtonDisable(false);
        setUploadedImages([]); // reset uploaded images
        setUploadedFiles([]); // reset uploaded image files
    }, []);

    const getAllMessageGroups = () => {
        setTrackedMessageGroups([]);
        axios
            .get(`${baseUrl}message-group/non-empty/expand`)
            .then((res) => {
                const data = res.data.data;
                let tempTrackedMessageGroups = [];
                // track lists
                data.forEach((d, index) => {
                    tempTrackedMessageGroups.push({ groupKey: d.message_group._key, index: index });
                });

                setAllGroups(data);
                setFilteredGroups(data);
                setTrackedMessageGroups(tempTrackedMessageGroups);

                // on first load handle click
                handleSelectedItemCallback(0);
                data.length > 0 && handleGroupClickCallback(data[0].message_group._key);
            })
            .catch((error) => {
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
            });
    };

    const getSelectedGroupMessage = (key) => {
        if (!key) return;

        setClickedMessageKey(key);
        setSendButtonDisable(false);

        axios
            .get(`${baseUrl}message-group/${key}/message`)
            .then((res) => {
                setClickedMessage([]); // clear previous chat

                setClickedMessage(res.data.data);
                handleResetWysiwygEditor();
            })
            .catch((error) => {
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
            });
    };

    const handleGroupClickCallback = (key) => {
        if (!key) {
            setClickedMessage([]); // clear selected message for new chat
        }
        setNewMessageDisplay(null); // clear org visibility message
        setSelectedMessageGroupKey(key);

        if (orgSearchVisibility) {
            setOrgSearchVisibility(false);
        }


        getSelectedGroupMessage(key);
    };

    const handleSelectedItemCallback = (selectedIndex) => {
        setSelectedMenuItemIndex(selectedIndex);
    };

    const handleFilterCallback = (values) => {
        setClickedMessage([]);

        setFilterValues(values);
        if (filterValues) {
            let temp = allGroups.filter((item, index) => {
                let orgs = item.orgs.filter((org) => org._id != userDetail.orgId);

                let existFlag = false;
                for (let i = 0; i < orgs.length; i++) {
                    if (orgs[i].name && orgs[i].name.toLowerCase().includes(values.toLowerCase())) {
                        existFlag = true;
                        break;
                    }
                }

                return existFlag;
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

        if (!orgSearchVisibility) {
            setFilteredGroups([newMessagePlaceHOlder, ...allGroups]);
            handleSelectedItemCallback(0);
            handleGroupClickCallback("");
            setNewMessageDisplay("Select organisations to send new message");
        }

        if (filteredGroups[0].message_group._id === 0) {
            setFilteredGroups(allGroups); // remove temp new message
            handleClearOrgSearch();
            handleSelectedItemCallback(0);
            handleGroupClickCallback(allGroups[0].message_group._key);
            setNewMessageDisplay(null);
        }
    };

    const handleImageUploadCallback = (values, files) => {
        setUploadedImages(values);
        setUploadedFiles(files);
    };

    const handleClearInputCallback = (v) => {
        if (!v) return;

        setFilteredGroups(allGroups);
        handleSelectedItemCallback(0);
        handleGroupClickCallback(allGroups[0].message_group._key);
    };

    const handleRichTextCallback = (value) => {
        const content = draftToHtml(convertToRaw(value));

        if (value.hasText()) {
            setMessageText(content);
        } else {
            setMessageText(null);
        }
    };

    const handleEnterCallback = (keyCode) => {
        if (!keyCode) return;

        // for enter command
        if (keyCode === 13 && messageText) {
            handleSendMessage(); // send message
        }
    };

    const handleOrgSelectedCallback = (value) => {
        setSelectedOrgs(value);
    };

    const handleResetWysiwygEditor = () => {
        resetDraftRef.current.resetDraft();
        setMessageText("");
        setUploadedImages([]); // reset uploaded images
        setUploadedFiles([]); // reset uploaded image files
    };

    const handleClearOrgSearch = () => {
        orgSearchRef.current.clearValue();
    };

    const handleSendMessage = () => {
        setSendButtonDisable(true);
        let payload = {};
        if (selectedOrgs.length > 0 && messageText) {
            const orgIds = [];
            selectedOrgs.map((o) => orgIds.push(o.value));

            payload = {
                message: {
                    type: "message",
                    text: messageText,
                },
                to_org_ids: orgIds,
                ...(uploadedImages.length > 0 && { linked_artifact_ids: uploadedImages }),
            };

            postMessage(payload, "N");
        } else {
            payload = {
                message: {
                    type: "message",
                    text: messageText,
                },
                to_org_ids: [],
                message_group_id: clickedMessageKey,
                ...(uploadedImages.length > 0 && { linked_artifact_ids: uploadedImages }),
            };

            postMessage(payload, "R");
        }
    };

    const postMessage = (payload, messageType) => {
        setSentMessageGroupKey(null); // reset
        axios
            .post(`${baseUrl}message/chat`, payload)
            .then((response) => {
                let data = response.data.data;
                setSentMessageGroupKey(data.message_group._key); // store the response message_group key

                handleResetWysiwygEditor();
                setSendButtonDisable(false);

                if (messageType === "N") {
                    console.log("New Message");
                    handleClearOrgSearch(); // clear selected orgs
                    getAllMessageGroups();
                }

                if (messageType === "R") {
                    console.log("Replayed Message");

                    if (filterVisibility) {
                        handleFilterVisibility();
                    }
                    getAllMessageGroups();
                }

                setUploadedImages([]); //reset uploaded images
                setUploadedFiles([]); // reset uploaded image files

            })
            .catch((error) => {
                setSendButtonDisable(false);
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
            });
    };

    return (
        <React.Fragment>
            <div className="row " style={{ height: "45px" }}>
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-md-10 d-flex justify-content-around">
                            {filterVisibility && (
                                <>
                                    <MessengerMessagesTwoFilterChats
                                        handleFilerCallback={(v) => handleFilterCallback(v)}
                                        handleClearInputCallback={(v) =>
                                            handleClearInputCallback(v)
                                        }
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
                    {orgSearchVisibility && (
                        <MessengerMessagesTwoOrgSearch
                            ref={orgSearchRef}
                            handleOrgSelectedCallback={(v) => handleOrgSelectedCallback(v)}
                        />
                    )}
                </div>
            </div>

            <div className="row no-gutters">
                <div className="col-md-4 msg-group-box">
                    {filteredGroups.length > 0 ? (
                        <List
                            sx={{
                                height: "625px",
                                minHeight: "625px",
                                maxHeight: "625px",
                                overflow: "auto",
                                bgColor: "background.paper",
                            }}>
                            {filteredGroups.map((g, index) => (
                                <>
                                    <HandleGroupDataDisplay
                                        userOrg={userDetail.orgId}
                                        selectedMenuItemIndex={selectedMenuItemIndex}
                                        group={g}
                                        index={index}
                                        handleGroupClickCallback={handleGroupClickCallback}
                                        handleSelectedItemCallback={handleSelectedItemCallback}
                                    />
                                </>
                            ))}
                        </List>
                    ) : (
                        <div>
                            {filteredGroups.length === 0 && <div>No groups yet.</div>}
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton className="mb-1" variant="rectangular" height="40px" />
                            <Skeleton variant="rectangular" height="40px" />
                        </div>
                    )}
                </div>
                <div className="col-md-8 msg-conversation-box">
                    <div className="row">
                        <div className="col" style={{ height: "500px", minHeight: "500px" }}>

                            {loading && <div>{LoaderAnimated()}</div>}
                            {clickedMessage.length > 0 && (
                                <div
                                    style={{
                                        height: "500px",
                                        minHeight: "500px",
                                        maxHeight: "500px",
                                    }}>
                                    <MessengerMessagesTwoSelectedMessage
                                        groupMessageKey={selectedMessageGroupKey}
                                        messages={clickedMessage}
                                    />
                                </div>
                            )}
                            {newMessageDisplay && (
                                <div className="row mt-2">
                                    <div className="col">
                                        {selectedOrgs.length === 0 && (
                                            <div>{newMessageDisplay}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            {selectedOrgs.length > 0 && (
                                <small>
                                    Selected:{" "}
                                    {selectedOrgs.map((o) => (
                                        <span className="mr-1">
                                            <span>{o.label}</span>
                                            {selectedOrgs.length > 1 && <span>, </span>}
                                        </span>
                                    ))}
                                </small>
                            )}
                        </div>
                    </div>
                    <div className="row no-gutters editor-box ">
                        <div className="col-sm-11">
                            <WysiwygEditor
                                // allOrgs={allGroups}
                                ref={resetDraftRef}
                                richTextHandleCallback={(value) => handleRichTextCallback(value)}
                                handleEnterCallback={(value, content) =>
                                    handleEnterCallback(value, content)
                                }
                                handleImageUploadCallback={(values, files) =>
                                    handleImageUploadCallback(values, files)
                                }
                            />
                        </div>
                        <div className="col-sm-1 d-flex justify-content-center align-items-center">
                            <div>
                                <div style={{ minHeight: "51px" }}>
                                    {(messageText || uploadedImages.length > 0) && (
                                        <Tooltip title="Clear" placement="right-start" arrow>
                                            <IconButton
                                                className={`${classes.customHoverFocusClearText}`}
                                                disabled={
                                                    !(messageText || uploadedImages.length > 0)
                                                }
                                                onClick={() => handleResetWysiwygEditor()}>
                                                <ClearIcon fontSize="large" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </div>
                                <div>
                                    <Tooltip title="Send" placement="right-end" arrow>
                                        <IconButton
                                            className={classes.customHoverFocus}
                                            disabled={!(messageText || uploadedImages.length > 0)}
                                            onClick={() => handleSendMessage()}>
                                            <SendIcon fontSize="large" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const HandleGroupDataDisplay = ({
    group,
    userOrg,
    index,
    selectedMenuItemIndex,
    handleGroupClickCallback,
    handleSelectedItemCallback,
    ...props
}) => {
    const [groupListItem, setGroupListItem] = useState(group);

    useEffect(() => {
        setGroupListItem(group);
    }, [group]);

    return (
        <>
            <MenuItem
                button
                divider
                dense
                disableGutters
                key={`${index}-${groupListItem.message_group._key}`}
                id={`group-item-${index}-${groupListItem.message_group._key}`}
                selected={selectedMenuItemIndex === index}
                style={{ whiteSpace: "normal" }}>
                <MessengerMessagesTwoGroupItem
                    userOrg={userOrg}
                    group={groupListItem}
                    index={index}
                    handleGroupClickCallback={handleGroupClickCallback}
                    handleSelectedItemCallback={handleSelectedItemCallback}
                />
            </MenuItem>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessagesTwo);