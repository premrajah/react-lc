import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {IconButton, List, Skeleton, Tooltip} from "@mui/material";
import {makeStyles} from "@mui/styles";
import MessengerMessagesTwoGroupItem from "./MessengerMessagesTwoGroupItem";
import MessengerMessagesTwoSelectedMessage from "./MessengerMessagesTwoSelectedMessage";
import MenuItem from "@mui/material/MenuItem";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import MessengerMessagesTwoFilterChats from "./MessengerMessagesTwoFilterChats";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MessengerMessagesTwoOrgSearch from "./MessengerMessagesTwoOrgSearch";
import WysiwygEditor from "./WysiwygEditor";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import {LoaderAnimated} from "../../Util/GlobalFunctions";
import draftToHtml from "draftjs-to-html";
import {convertToRaw} from "draft-js";
import {Spinner} from "react-bootstrap";

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
    const [clickedMessageArtifact, setClickedMessageArtifact] = useState([]);
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
    const [selectedMessageGroupOrgs, setSelectedMessageGroupOrgs] = useState([]);

    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadedArtifacts, setUploadedArtifacts] = useState([]);
    const [sentMessageGroupKey, setSentMessageGroupKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [groupLoading, setGroupLoading] = useState(false);
    const [chatEndReached, setChatEndReached] = useState(false);
    const [groupListEndReached, setGroupListEndReached] = useState(false);
    const [updateMsgLoading, setUpdateMsgLoading] = useState(false);
    const [scrollEnd, setScrollEnd] = useState(false);
    const [offset, setOffset] = useState(0);
    const [groupOffset, setGroupOffset] = useState(0);
    const [groupPageSize, setGroupPageSize] = useState(40);
    const [pageSize, setPageSize] = useState(10);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        // handleSelectedItemCallback(0);
        getAllMessageGroups(true,true);
        setSendButtonDisable(false);
        setUploadedImages([]); // reset uploaded images
        setUploadedFiles([]); // reset uploaded image files
    }, []);

    const listInnerRef = useRef();
    const listInnerRefTable = useRef();
    const groupListInnerRef = useRef();



    const onUpScroll = () => {
        if (listInnerRef.current&&!chatEndReached&&(!updateMsgLoading)) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

            // console.log(scrollTop, scrollHeight, clientHeight)
            // console.log(scrollTop-clientHeight , -(scrollHeight-50))

            if (scrollTop-clientHeight < -(scrollHeight-50)) {
                // console.log("reached top");


                if (!chatEndReached){
                    setOffset(offset+pageSize)

                    setScrollEnd(true)
                    getSelectedGroupMessage(selectedMessageGroupKey,false,false,offset+pageSize )

                }



            }else{

            }


        }
    };

    const onDownScrollTable = () => {

        // console.log("detect scroll")
        // if (listInnerRefTable.current&&!chatEndReached&&(!updateMsgLoading)) {
        //     const { scrollTop, scrollHeight, clientHeight } = listInnerRefTable.current;
        //
        //     console.log(scrollTop, scrollHeight, clientHeight)
        //     console.log(scrollTop-clientHeight , -(scrollHeight-100))
        //
        //     if (scrollTop+clientHeight > (scrollHeight-50)) {
        //         // console.log("reached top");


                if (!chatEndReached){
                    // setOffset(offset+pageSize)
                    //
                    // setScrollEnd(true)
                    // getSelectedGroupMessage(selectedMessageGroupKey,false,false,offset+pageSize )

                }


        //     }else{
        //
        //     }
        //
        //
        // }
    };

    const onDownScroll = () => {
        if (groupListInnerRef.current&&!groupListEndReached&&(!groupLoading)) {
            const { scrollTop, scrollHeight, clientHeight } = groupListInnerRef.current;

            // console.log(scrollTop, scrollHeight, clientHeight)
            // console.log(scrollDown-clientHeight , -(scrollHeight-50))

            if (scrollTop+clientHeight > (scrollHeight-50)) {
                // console.log("reached bottom");


                if (!groupListEndReached){
                    setGroupOffset(groupOffset+groupPageSize)
                    setGroupLoading(true)
                    getAllMessageGroups(false,false,(groupOffset+groupPageSize))
                }

            }else{

            }


        }
    };

    const getAllMessageGroups = (handleClick=false, resetIndex=false,currentGroupOffset=0) => {
        setTrackedMessageGroups([]);
        axios
            .get(`${baseUrl}message-group/non-empty/expand?offset=${currentGroupOffset}&size=${groupPageSize}`)
            .then((res) => {
                const data = res.data.data;
                let tempTrackedMessageGroups = [];
                // track lists
                data.forEach((d, index) => {
                    tempTrackedMessageGroups.push({ groupKey: d.message_group._key, index: index });
                });


                setGroupLoading(false)


                if (data.length==0){
                    setGroupListEndReached(true)
                }

                if (resetIndex){
                    handleSelectedItemCallback(0);
                    setAllGroups(data)
                    setFilteredGroups(data)
                    setTrackedMessageGroups(data)
                }else{
                    setAllGroups((group) => group.concat(data));
                    setFilteredGroups((group) => group.concat(data));
                    setTrackedMessageGroups((group) => group.concat(data));
                }


                // on first load handle click

                if (handleClick){

                    setSelectedMessageGroupOrgs(data[0].orgs.filter(org=>org._id!=userDetail.orgId))
                    data.length > 0 && handleGroupClickCallback(data[0].message_group._key);
                }


            })
            .catch((error) => {
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
            });
    };

    const getSelectedGroupMessage = (key, clear=true,loading=true, currentOffset=0,tab=0) => {

        console.log(key,clear)

        if (!key) return;

        setClickedMessageKey(key);
        setSendButtonDisable(false);

        if (clear){

            setOffset(0)
            setLoading(loading)
            setChatEndReached(false)


        }else{
            setUpdateMsgLoading(true)
        }

        console.log(offset)



        let url=`${baseUrl}message-group/${key}/message?offset=${currentOffset}&size=${pageSize}`

        if (tab==1){
            url `${url}&with-artifacts=true`
        }
        axios
            .get(url)
            .then((res) => {
                setUpdateMsgLoading(false)

                if (clear){
                    setClickedMessage([]); // clear previous chat

                    if (res.data.data.length<pageSize){
                        setChatEndReached(true)
                    }else{
                        setChatEndReached(false)
                    }

                    if (tab==0){
                        setClickedMessage(res.data.data);
                    }else{
                        setClickedMessageArtifact(res.data.data);

                    }


                }else{

                    // console.log(res.data.data)
                    if (tab==0){
                        setClickedMessage((chat) => chat.concat(res.data.data));
                    }else{
                        setClickedMessageArtifact((chat) => chat.concat(res.data.data));

                    }

                    setClickedMessage((chat) => chat.concat(res.data.data));

                    setScrollEnd(false)

                    if (res.data.data.length==0){
                        setChatEndReached(true)
                    }else{
                        setChatEndReached(false)
                    }
                }

                handleResetWysiwygEditor();

                setLoading(false)
            })
            .catch((error) => {
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
                setLoading(true)
            });
    };

    const handleGroupClickCallback = (key,clear=true) => {


        setScrollEnd(false)
        // if (!key) {
        //     setClickedMessage([]); // clear selected message for new chat
        // }
        setNewMessageDisplay(null); // clear org visibility message
        setSelectedMessageGroupKey(key);

        if (orgSearchVisibility) {
            setOrgSearchVisibility(false);
        }

        getSelectedGroupMessage(key,clear);

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
            setClickedMessage([])
            setActiveTab(0)
            // setNewMessageDisplay("Select organisations to send new message");
        }

        if (filteredGroups[0].message_group._id === 0) {
            setFilteredGroups(allGroups); // remove temp new message
            handleClearOrgSearch();
            handleSelectedItemCallback(0);
            handleGroupClickCallback(allGroups[0].message_group._key);
            setNewMessageDisplay(null);
        }
    };

    const handleImageUploadCallback = (values, files,artifacts) => {
        setUploadedImages(values);
        setUploadedFiles(files);
        setUploadedArtifacts(artifacts)
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
                    text: messageText?messageText:"",
                },
                to_org_ids: orgIds,
                ...(uploadedImages.length > 0 && { linked_artifact_ids: uploadedImages }),
            };

            postMessage(payload, "N");
        } else {
            payload = {
                message: {
                    type: "message",
                    text: messageText?messageText:"",
                },
                to_org_ids: [],
                message_group_id: clickedMessageKey,
                ...(uploadedImages.length > 0 && { linked_artifact_ids: uploadedImages }),
            };

            postMessage(payload, "R");
        }
    };

    const postMessage = (payload, messageType) => {
        setUploadedImages([]); //reset uploaded images
        setUploadedFiles([]); // reset uploaded image files
        setUploadedArtifacts([])


        setSentMessageGroupKey(null); // reset
        axios
            .post(`${baseUrl}message/chat`, payload)
            .then((response) => {
                let data = response.data.data;
                setSentMessageGroupKey(data.message_group._key); // store the response message_group key

                handleResetWysiwygEditor();
                setSendButtonDisable(false);

                if (messageType === "N") {
                    handleClearOrgSearch(); // clear selected orgs
                    getAllMessageGroups(true,true);
                }

                if (messageType === "R") {

                    if (filterVisibility) {
                        handleFilterVisibility();
                    }
                    setOffset(0)
                    setGroupOffset(0)
                    getSelectedGroupMessage(selectedMessageGroupKey,true,false)
                    getAllMessageGroups(false,true,0);
                }



            })
            .catch((error) => {
                setSendButtonDisable(false);
                showSnackbar({ show: true, severity: "warning", message: `${error.message}` });
            });
    };

    return (
        <React.Fragment>
            <div className="row g-0 " style={{ height: "45px" }}>
                <div className="col-md-4">
                    <div className="row g-0">
                        <div className="col-md-12 d-flex justify-content-between">
                            <>
                                <MessengerMessagesTwoFilterChats
                                        handleFilerCallback={(v) => handleFilterCallback(v)}
                                        handleClearInputCallback={(v) =>
                                            handleClearInputCallback(v)
                                        }
                                    />
                                </>
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
                            handleOrgSelectedCallback={(v) =>{ handleOrgSelectedCallback(v)}}
                        />
                    )}
                </div>
            </div>

            <div className="row g-0 g-0 no-gutters ">
                <div

                     className="col-md-4 msg-group-box">
                    {filteredGroups.length > 0 ? (
                        <List
                            onScroll={onDownScroll}


                            ref={groupListInnerRef}
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
                                        handleGroupClickCallback={(key)=>{
                                            setActiveTab(0);
                                        handleGroupClickCallback(key)}}
                                        handleSelectedItemCallback={handleSelectedItemCallback}


                                    />
                                </>
                            ))}


                            {groupLoading&&<>
                                {/*<Skeleton className="mb-1" variant="rectangular" height="52px" >*/}


                                    <div className="spinner-chat"><Spinner
                                        className="mr-2"
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /></div>
                                {/*</Skeleton>*/}

                            </>}
                        </List>
                    ) : (
                        <div style={{height:"625px", overflowY:"scroll"}}>

                            {/*<Skeleton className="mb-1" animation="wave" variant="rectangular" height="100%" />*/}
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            <Skeleton className="mb-1" variant="rectangular" height="52px" />
                            {/*<Skeleton variant="rectangular" height="40px" />*/}
                        </div>
                    )}
                </div>
                <div className="col-md-8 msg-conversation-box position-relative">
                    <div className="row">
                        <div className="col position-relative" style={{ height: "500px", minHeight: "500px" }}>



                            {loading && <div className="loader-absolute">{LoaderAnimated()}</div>}
                            {clickedMessage.length > 0 && (
                                <div

                                    style={{
                                        height: "500px",
                                        minHeight: "500px",
                                        maxHeight: "500px",

                                    }}>

                                    <MessengerMessagesTwoSelectedMessage
                                        selectedMessageGroupOrgs={selectedMessageGroupOrgs}
                                        chatEndReached={chatEndReached}
                                        scrollEnd={scrollEnd}
                                        listInnerRef={listInnerRef}
                                        listInnerRefTable={listInnerRefTable}
                                        activeTab={activeTab}
                                        onScroll={onUpScroll}
                                        setActiveTab={(data)=> {
                                            setActiveTab(data);
                                            if (data==1){
                                                getSelectedGroupMessage(selectedMessageGroupKey,true,true,0,1)
                                            }

                                        }}
                                        onDownScrollTable={onDownScrollTable}
                                        groupMessageKey={selectedMessageGroupKey}
                                        messages={clickedMessage}
                                        artifacts={clickedMessageArtifact}
                                    />
                                </div>
                            )}
                            {/*{newMessageDisplay && (*/}
                            {/*    <div className="row mt-2">*/}
                            {/*        <div className="col">*/}
                            {/*            {selectedOrgs.length === 0 && (*/}
                            {/*                <div>{newMessageDisplay}</div>*/}
                            {/*            )}*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    </div>
                    <div className="row d-none">
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
                    {activeTab ===0&&
                    <div
                        // style={{minHeight: "125px"}}

                        className="row g-0 no-gutters  editor-box ">
                        <div className="col-sm-11">
                            <WysiwygEditor
                                // allOrgs={allGroups}
                                ref={resetDraftRef}
                                richTextHandleCallback={(value) => handleRichTextCallback(value)}
                                handleEnterCallback={(value, content) =>
                                    handleEnterCallback(value, content)
                                }
                                uploadedFiles={uploadedFiles}
                                uploadedImages={uploadedImages}
                                uploadedArtifacts={uploadedArtifacts}

                                handleImageUploadCallback={(values, files,artifacts) =>
                                    handleImageUploadCallback(values, files,artifacts)
                                }
                            />
                        </div>
                        <div className="col-sm-1 d-flex justify-content-center align-items-start">
                            <div>

                                <div>
                                    <Tooltip title="Send" placement="right-end" arrow>
                                        <IconButton
                                            className={classes.customHoverFocus}
                                            disabled={!(messageText || uploadedImages.length > 0)}
                                            onClick={() => handleSendMessage()}>
                                            <SendIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <div style={{  }}>
                                    {(messageText || uploadedImages.length > 0) && (
                                        <Tooltip title="Clear" placement="right-start" arrow>
                                            <IconButton
                                                className={`${classes.customHoverFocusClearText}`}
                                                disabled={
                                                    !(messageText || uploadedImages.length > 0)
                                                }
                                                onClick={() => handleResetWysiwygEditor()}>
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>}
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
