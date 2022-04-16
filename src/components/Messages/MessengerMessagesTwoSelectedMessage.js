import React from 'react';
import {Box, Tab, Tabs} from "@mui/material";
import PropTypes from "prop-types";
import MessengerMessagesFilesDisplay from "./MessengerMessagesFilesDisplay";

const MessengerMessagesTwoSelectedMessage = ({messages}) => {

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    const [value, setValue] = React.useState(0);

    const handleTabsChange = (event, newValue) => {
        setValue(newValue);
    };



    return <>
        {messages.length > 0 && <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleTabsChange} aria-label="basic tabs example">
                    <Tab label="Chats" {...a11yProps(0)} />
                    <Tab label="Files" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {messages.length > 0 && messages.map((m,i) => <div key={i}>{m.message.text}</div>)}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {messages.length > 0 && messages.map( (m, i) => (
                    <div>{m.artifacts.map((a,j) => (
                        // <div key={j}>{a.blob_url}</div>
                        <MessengerMessagesFilesDisplay key={j} artifacts={a} />
                    ))}</div>
                ))}
            </TabPanel>
        </Box>}
    </>




    // --------- extra ---------- //

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
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
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
}

export default MessengerMessagesTwoSelectedMessage;