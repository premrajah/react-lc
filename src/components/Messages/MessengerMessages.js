import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {baseUrl, createMarkup, randomColorGen, useInterval} from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import {Button, List, ListItem, Tooltip, TextField, Avatar} from "@mui/material";
import {Alert, Autocomplete} from "@mui/lab";
import AddIcon from '@mui/icons-material/Add';
import ExplicitIcon from '@mui/icons-material/Explicit';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SendIcon from "@mui/icons-material/Send";
import FilterListIcon from '@mui/icons-material/Search';
import moment from "moment/moment";
import Select from "react-select";
import {makeStyles} from "@mui/styles";
import RichTextEditor from "./RichTextEditor";
import WysiwygEditor from "./WysiwygEditor";
import styles from './MessengerMessage.module.css';
import MessageEntityDialog from "./MessageEntityDialog";
import AvatarWithColours from "../Avatars/AvatarWithColours";
import {purple} from "@mui/material/colors";
import CustomizedSelect from "../FormsUI/ProductForm/CustomizedSelect";
import CustomizedInput from "../FormsUI/ProductForm/CustomizedInput";



const msgWindowHeight = "520px";
const useStyles = makeStyles({
    root: {
        '&$selected': {
            backgroundColor: 'var(--lc-purple)',
            color: '#ffffff',
            '&:hover': {
                backgroundColor: 'var(--lc-pink)',
                color: '#ffffff',
            }
        },
    },
    selected: {},
});

const MessengerMessages = ({ userDetail, messages, getMessages }) => {

    const classes = useStyles()
    const reactSelectRef = useRef([]);
    const resetDraftRef = useRef();
    const messagesEndRef = useRef(null)

    const [allOrgs, setAllOrgs] = useState([]);
    const [allMessageGroups, setAllMessageGroups] = useState([]);
    const [autoCompleteOrg, setAutoCompleteOrg] = useState("");
    const [userOrg, setUserOrg] = useState("");
    const [selectedMsgGroup, setSelectedMsgGroup] = useState([]);
    const [selectedItem, setSelectedItem] = useState(0);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedGroupKey, setSelectedGroupKey] = useState(null);

    const [reactSelectValues, setReactSelectValues] = useState([]);
    const [reactSelectedValues, setReactSelectedValues] = useState([]);

    const [messageText, setMessageText] = useState("");
    const [showHideGroupFilter, setShowHideGroupFilter] = useState(false);
    const [showHideOrgSearch, setShowHideOrgSearch] = useState(false);

    const [openEntityDialog, setOpenEntityDialog] = useState(false);

    let trackedList = [];


    useEffect(() => {
        scrollToBottom()
    }, [selectedMsgGroup]);

    useEffect(() => {
        getAllOrgs();
        getAllMessageGroups();
        // getAllMessageGroupsExpand();
    }, []);

    useEffect(() => {
        setUserOrg(userDetail.orgId);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    // useInterval(() => {
    //     getAllOrgs();
    //     getAllMessageGroups();
    // }, 1000 * 10);

    const ListGroupDisplay = (group, i) => {
        trackedList.push({groupId: group._id, groupKey: group._key, name: group.name, index: i});

        return <div key={i} >

            <div
                // classes={{root: classes.root, selected: classes.selected}}
                className={"click-item p-2 message-group-item"}
                selected={selectedItem === i}
                button
                divider
                onClick={() => handleGroupClick(group, i)}
            >
                {/*{group.name.replace(/\W/g, " ")}*/}
            {/*     {group.orgs || group.orgs.length > 0 && group.orgs.map((g, i) => {*/}
            {/*         return <div key={i} className="mr-2">*/}
            {/*             <Tooltip arrow title={*/}
            {/*                 <div className="d-flex flex-column">*/}
            {/*                     <div>{g.name ? g.name : ""}</div>*/}
            {/*                     <small>{g.email ? g.email : ""}</small>*/}
            {/*                 </div>*/}
            {/*             }>*/}
            {/*                <Avatar style={{color: "#000", backgroundColor: "var(--lc-bg-gray)", border: "1px solid var(--lc-green)"}}>{g.name ? g.name.substr(0, 2) : ""}</Avatar>*/}
            {/*             </Tooltip>*/}
            {/*         </div>*/}
            {/*})}*/}
                {group.name.replaceAll(",",", ").replaceAll("+",", ").replaceAll("-","")}
            </div>
        </div>
    }

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
                const data = response.data.data;
                setAllMessageGroups(data);

                // if(selectedItem === 0) {
                //     handleGroupClick(data[0], 0);
                // }
            })
            .catch((error) => {
                console.log("message-group-error ", error.message);
            });
    };

    const getAllMessageGroupsExpand = () => {
        axios
            // .get(`${baseUrl}message-group/expand`)
            .get(`${baseUrl}message-group/do-not-use`)
            .then((response) => {
                const data = response.data.data;
                setAllMessageGroups(data);

                if(!selectedItem) {
                    handleGroupClick(data[0], 0);
                }
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

    const getSingleMessageGroupExpand = (id) => {
        if (!id) return;
        axios
            .get(`${baseUrl}message-group/${id}/expand`)
            .then((response) => {
                setSelectedMsgGroup(response.data.data);
            })
            .catch((error) => {
                console.log("group message error ", error.message);
            });
    };

    const handleEntityDialogOpen = () => {
        setOpenEntityDialog(true);
    };

    const handleEntityDialogClose = (value) => {
        setOpenEntityDialog(false);
        // setSelectedValue(value);
    };


    const handleNewMessageSelect = (e) => {
        if (!e) return;
        const temp = [];
        e.map((v) => {
            temp.push(v.value);
        });
        setReactSelectedValues(temp);
    };

    const handleFilterGroups = (e, value) => {
        setAutoCompleteOrg(value);
    }

    const handleGroupClick = (group, selectedIndex) => {
        setSelectedGroupId(group._id);
        setSelectedGroupKey(group._key);
        updateSelected(selectedIndex);

        if(reactSelectedValues.length > 0   ) {
            reactSelectRef.current.clearValue();
        }
        setShowHideGroupFilter(false);
        setShowHideOrgSearch(false);
        getGroupMessageWithId(group._key);
        setSelectedMsgGroup([]);
    };

    const handleRichTextCallback = (value) => {
        setMessageText(value);
    }

    const handleOrgSearchButton = () => {
        // showHideOrgSearch ? allMessageGroups.pop() : allMessageGroups.unshift({id: "0", name: "New Chat"});
        if(showHideOrgSearch) {
            if(allMessageGroups[0].id === "0") {
                getAllMessageGroups();
                // getAllMessageGroupsExpand();
                handleGroupClick(allMessageGroups[0], 0);
            }
        } else {
            allMessageGroups.unshift({id: "0", name: "New Message"});
            handleGroupClick(allMessageGroups[0], 0);
        }
        setShowHideOrgSearch(!showHideOrgSearch);
    }

    const  updateSelected = (selectedIndex) => {
        setSelectedItem(selectedIndex);
    }

    const checkWhoseMessage = (orgs) => {
        if(orgs.length > 0) {
            if(orgs[0].actor === "message_to"){
                if((orgs[0].org.org._id && orgs[0].org.org._id.toLowerCase()) === userDetail.orgId.toLowerCase()) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    const handleFilterGroupsButton = () => {
        setAutoCompleteOrg("");
        setShowHideGroupFilter(!showHideGroupFilter);
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

    const postMessage = (payload, messageKey) => {
        axios
            .post(`${baseUrl}message/chat`, payload)
            .then((response) => {
                if (response.status === 200) {

                    const data = response.data.data;

                    setMessageText("");
                    if(reactSelectedValues.length > 0   ) {
                        reactSelectRef.current.clearValue();
                    }
                    getAllMessageGroups();
                    // getAllMessageGroupsExpand();
                    getAllOrgs();

                    if(payload.message_group_id) {
                        handleGroupClick(data.message_group, selectedItem);
                    } else {

                        if(trackedList.length > 0) {
                            const msgGroupIdCheck = trackedList.filter(g => g.groupId === data.message_group._id);
                            if(msgGroupIdCheck) {
                                const _id = msgGroupIdCheck[0].groupId;
                                const _key = msgGroupIdCheck[0].groupKey;
                                const name = msgGroupIdCheck[0].name;
                                const index = msgGroupIdCheck[0].index - 1;
                                handleGroupClick({_id, _key, name}, index);
                            }
                        }
                    }

                    resetDraftRef.current.resetDraft(); // clear draftjs text field

                }
            })
            .catch((error) => {
                console.log("postMessage error ", error.message);
            });
    };

    const handleSendMessage = () => {
        if (messageText && reactSelectedValues.length > 0) {
            sendMessage(messageText, reactSelectedValues, "", "", "new_message");

        } else if (messageText && selectedMsgGroup.length > 0) {

            if(selectedGroupId) {
                sendMessage(messageText, [], selectedGroupId, "", "group_message");
            }
        }
    };



    return (
        <>

            <div className="row">
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-md-8">
                            {!showHideGroupFilter && <div className="d-flex justify-content-start align-items-center h-100">Groups</div>}
                            {showHideGroupFilter && <Autocomplete
                                variant={"standard"}
                                disablePortal
                                id="groups-filter"
                                fullWidth
                                onChange={(e, value) => handleFilterGroups(e, value)}
                                options={allMessageGroups.length > 0
                                    ? allMessageGroups.map((option) =>
                                        option.name ? option.name : ""
                                    )
                                    : []}
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField  {...params} label="Search for Groups" />}
                            />}
                        </div>

                        <div className="col-md-2 d-flex justify-content-center align-items-center">
                            <Tooltip title="Filter groups">
                                <Button onClick={() => handleFilterGroupsButton()}>
                                    <FilterListIcon className={"text-blue"} style={{fontSize:"24px"}} />
                                </Button>
                            </Tooltip>
                        </div>

                        <div className="col-md-2 d-flex justify-content-center align-items-center">
                            <Tooltip title="New Message">
                                <Button onClick={() => handleOrgSearchButton()}>
                                    <AddIcon className={"text-blue"} style={{fontSize:"24px"}} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>

                    {allMessageGroups.length === 0 && <div>No group chats yet. </div>}
                    <div
                        className="message-groups bg-white rad-8 p-3 gray-border text-capitalize"
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
                                .map((group, i) => ListGroupDisplay(group, i))
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                </div>

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
                                        <div  key={i} className={`d-flex ${checkWhoseMessage(m.orgs) ? 'justify-content-start' : 'justify-content-end'}`}>
                                            <div
                                                className="w-75 p-3 mb-3 border-rounded text-blue gray-border"
                                                style={{
                                                    background: checkWhoseMessage(m.orgs) ? "#ffffff" : "#ffffff"

                                                }}>
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <small>
                                                            <small className="mr-1" style={{opacity: '0.8'}}>{checkWhoseMessage(m.orgs) ? m.orgs[0].org.org.name : ''}</small>
                                                            <small className={"text-gray-light"} style={{opacity: '0.5'}}>
                                                                {moment(
                                                                    m.message._ts_epoch_ms
                                                                ).fromNow()}
                                                            </small>
                                                        </small>
                                                    </div>
                                                    <div>
                                                        {m.message.entity_as_json && <small className="mr-2" style={{cursor: "pointer"}}>
                                                            <ExplicitIcon fontSize="small" onClick={handleEntityDialogOpen}/>
                                                            <MessageEntityDialog entity={m.message.entity_as_json} open={openEntityDialog} onClose={handleEntityDialogClose} />

                                                        </small>}
                                                        {m.artifacts.length > 0 && <small style={{cursor: "pointer"}}>
                                                            <PhotoLibraryIcon fontSize="small"/>
                                                        </small>}
                                                    </div>
                                                </div>
                                                <div dangerouslySetInnerHTML={createMarkup(m.message.text)}></div>
                                            </div>
                                        </div>
                                    )).reverse()}
                                    <div className="dummy" ref={messagesEndRef} />
                                </div>

                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>

                    {<div className="row">
                        <div className="col">
                            {reactSelectedValues.length > 0 && <Alert severity="info" className="mr-2">{`Send message to selected orgs`}</Alert>}
                            {reactSelectedValues.length > 0 || selectedMsgGroup.length > 0 && <Alert severity="info">{`Reply to the selected group`}</Alert>}
                        </div>
                    </div>}

                    <div className="row mt-2" style={{height: "60px"}}>
                        <div className="col-11 p-0 mb-5" style={{border: '1px solid var(--lc-pale-purple)'}}>
                            {/*<RichTextEditor*/}
                            {/*    richTextHandleCallback={(value) => handleRichTextCallback(value)}*/}
                            {/*    allOrgs={allOrgs} ref={resetDraftRef}*/}
                            {/*/>*/}
                            <WysiwygEditor
                                wrapperClassName="wysiwyg-wrapper-class"
                                editorClassName="wysiwyg-editor-class"
                                allOrgs={allOrgs}
                                ref={resetDraftRef}
                                richTextHandleCallback={(value) => handleRichTextCallback(value)}
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
                                    style={{color: messageText ? "var(--lc-pink)" : "var(--lc-bg-gray)"}}
                                />
                            </Button>
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
