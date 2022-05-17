import React, { useEffect, useRef } from "react";
import { Box, Skeleton, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import MessengerMessagesFilesDisplay from "./MessengerMessagesFilesDisplay";
import MessengerMessageTwoMessageBubble from "./MessengerMessageTwoMessageBubble";

const MessengerMessagesTwoSelectedMessage = ({ messages }) => {
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const messagesEndRef = useRef(null);

    const [value, setValue] = React.useState(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleTabsChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            {messages.length > 0 ? (
                <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={value} onChange={handleTabsChange} aria-label="message-tabs">
                            <Tab label="Chats" {...a11yProps(0)} />
                            <Tab label="Files" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        {messages.length > 0 && (
                            <>
                                {messages.map((m, i) => (
                                    <React.Fragment key={i}>
                                        <div
                                            className={`d-flex ${
                                                m.options.is_owned
                                                    ? "justify-content-end"
                                                    : "justify-content-start"
                                            }`}>
                                            <MessengerMessageTwoMessageBubble m={m} />
                                        </div>
                                    </React.Fragment>
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {messages.length > 0 &&
                            messages.map((m, ind) => (
                                <div key={ind}>
                                    {m.artifacts.map((a, j) => (
                                        <MessengerMessagesFilesDisplay key={j} artifacts={a} />
                                    ))}
                                </div>
                            ))}
                    </TabPanel>
                </Box>
            ) : (
                <div>
                    abc
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

export default MessengerMessagesTwoSelectedMessage;
