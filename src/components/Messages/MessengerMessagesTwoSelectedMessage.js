import React, {useEffect, useRef, useState} from "react";
import {Box, Skeleton, Tab, Tabs} from "@mui/material";
import PropTypes from "prop-types";
import MessengerMessagesFilesDisplay from "./MessengerMessagesFilesDisplay";
import MessengerMessageTwoMessageBubble from "./MessengerMessageTwoMessageBubble";
import {connect} from "react-redux";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import WysiwygGroupImageUpload from "./WysiwygGroupImageUpload";
import {Spinner} from "react-bootstrap";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import {getInitials} from "../../Util/GlobalFunctions";

const MessengerMessagesTwoSelectedMessage = ({ groupMessageKey,chatEndReached,messages, userDetail,onScroll,listInnerRef,scrollEnd,...otherprops }) => {
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };



    const [value, setValue] = React.useState(0);
    const [groupMessageArtifacts, setGroupMessageArtifacts] = useState([]);
    const [currentTab, setCurrentTab] = React.useState(0);
    // const [messages, setMessages] = useState([]);

    // useEffect(()=>{
    //
    //     console.log(otherprops.messages)
    //     setMessages(otherprops.messages)
    //
    // },[otherprops.messages])

    const handleTabsChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleWhoseMessage = (o, index) => {
        if(o.actor === "message_from") {
            if(o.org.org._id.toLowerCase() === userDetail.orgId.toLowerCase()) {
                return "justify-content-end";
            }
        }

        return "justify-content-start";
    }


    const getArtifacts = () => {
        setGroupMessageArtifacts([]); // clear artifacts
        if(groupMessageKey) {
            axios
                .get(`${baseUrl}message-group/${groupMessageKey}/artifact`)
                .then((res) => {
                    let data = res.data.data;
                    setGroupMessageArtifacts(data);
                })
                .catch(error => {

                })
        }
    }

    const afterUploadedImagesCallback = () => {
        getArtifacts()
    }

    return (
        <>
            {/*{messages.length > 0 ? (*/}
            {/*    <Box sx={{ width: "100%" }}>*/}
            {/*        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>*/}
            {/*            <Tabs style={{height: "50px"}} value={value} onChange={handleTabsChange} aria-label="message-tabs">*/}
            {/*                <Tab label="Chats" {...a11yProps(0)} />*/}
            {/*                <Tab label="Group Files" {...a11yProps(1)} onClick={() => getArtifacts()} />*/}
            {/*            </Tabs>*/}
            {/*        </Box>*/}
            {/*        <TabPanel value={value} index={0}>*/}
<>

    <div className="row">
        <div className="col-12 d-flex">
        <a href="javascript:void(0)" onClick={()=>setCurrentTab(0)}>
            <div className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${currentTab===0?"w3-border-red":""}`}>Chat</div>
        </a>
        <a href="javascript:void(0)" onClick={()=>setCurrentTab(1)}>
            <div className={`w3-third tablink w3-bottombar w3-hover-light-grey w3-padding ${currentTab===1?"w3-border-red":""}`}>Files</div>
        </a>
        </div>
    </div>
    <div className={`${currentTab!==0?"d-none":"row"}`}>
        <div className="col-12">
                        {scrollEnd &&
                        <div className="spinner-chat"><Spinner
                            className="mr-2"
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /></div>}



                        {/*{messages.length > 0 && (*/}
                            <div
                                onScroll={onScroll}
                                ref={listInnerRef}

                                className="mb-5" style={{
                                flexFlow:"column-reverse",
                                display: "flex",
                                height: "400px", minHeight: "400px", maxHeight: "400px", overflow: "auto", overflowX: "hidden" }}>


                                <>
                                {messages.map((m, i) => (
                                    <React.Fragment key={i}>
                                        <div
                                            className={`d-flex ${
                                                (m.orgs.map((o, i) => handleWhoseMessage(o, i)).filter((s) => s === "justify-content-end").length > 0) ? "justify-content-end" : "justify-content-start"
                                            }`}>
                                            <MessengerMessageTwoMessageBubble m={m} />
                                        </div>
                                    </React.Fragment>
                                ))}

                                    {chatEndReached &&
                                    <div>
                                        <p>End of Conversation</p>

                                    </div>}
                                </>

                            </div>
            {/*)}*/}
    </div>

        <div className={`${currentTab!==1?"d-none":"row"}`}>

                <div className="col-12">
                                    <WysiwygGroupImageUpload groupKey={groupMessageKey} afterUploadCallback={() => afterUploadedImagesCallback()} />
                                </div>
                            </div>

                            <div style={{ height: "350px", minHeight: "350px", maxHeight: "350px", overflow: "auto", overflowX: "hidden" }}>

                                {groupMessageArtifacts.length > 0 ? groupMessageArtifacts.map((a, index) => {
                                    return <MessengerMessagesFilesDisplay key={index} artifacts={a} />
                                }) : <></>}
                            </div>

        </div>
                        {/*)}*/}

                        </>
                {/*    </TabPanel>*/}

                {/*    <TabPanel value={value} index={1}>*/}
                {/*        <div className="row">*/}
                {/*            <div className="col-1">*/}
                {/*                <WysiwygGroupImageUpload groupKey={groupMessageKey} afterUploadCallback={() => afterUploadedImagesCallback()} />*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*        <div style={{ height: "350px", minHeight: "350px", maxHeight: "350px", overflow: "auto", overflowX: "hidden" }}>*/}

                {/*            {groupMessageArtifacts.length > 0 ? groupMessageArtifacts.map((a, index) => {*/}
                {/*                return <MessengerMessagesFilesDisplay key={index} artifacts={a} />*/}
                {/*            }) : <div>No group files yet.</div>}*/}
                {/*        </div>*/}
                {/*    </TabPanel>*/}
                {/*</Box>*/}
            {/*) : (*/}
            {/*    <div>*/}
            {/*        <Skeleton variant="rectangular" height="40px" />*/}
            {/*    </div>*/}
            {/*)}*/}
        </>
    );

    // --------- extra ---------- //

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}>
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <div>{children}</div>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MessengerMessagesTwoSelectedMessage);
