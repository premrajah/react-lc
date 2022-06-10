import React, {useEffect, useRef, useState} from "react";
import { Box, Skeleton, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import MessengerMessagesFilesDisplay from "./MessengerMessagesFilesDisplay";
import MessengerMessageTwoMessageBubble from "./MessengerMessageTwoMessageBubble";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";

const MessengerMessagesTwoSelectedMessage = ({ groupMessageKey, messages, userDetail }) => {
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    // const messagesEndRef = useRef(null);

    const [value, setValue] = React.useState(0);
    const [groupMessageArtifacts, setGroupMessageArtifacts] = useState([]);

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' });
    // };

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

    return (
        <>
            {messages.length > 0 ? (
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={value} onChange={handleTabsChange} aria-label="message-tabs">
                            <Tab label="Chats" {...a11yProps(0)} />
                            <Tab label="Group Files" {...a11yProps(1)} onClick={() => getArtifacts()} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        {messages.length > 0 && (
                            <div className="mb-5" style={{ height: "500px", minHeight: "500px", maxHeight: "500px", overflow: "auto" }}>
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
                                {/*<div ref={messagesEndRef} />*/}
                            </div>
                        )}
                    </TabPanel>

                    <TabPanel value={value} index={1}>
                        {groupMessageArtifacts.length > 0 ? groupMessageArtifacts.map((a, index) => {
                            return <MessengerMessagesFilesDisplay key={index} artifacts={a} />
                        }) : <div>No group files yet.</div>}
                    </TabPanel>
                </Box>
            ) : (
                <div>
                    <Skeleton variant="rectangular" height="40px" />
                </div>
            )}
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
