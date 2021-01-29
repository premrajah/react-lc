import React, { Component } from "react";
import { connect } from "react-redux";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import Notifications from "../../components/Inbox/Notifications";
import Messages from "../../components/Inbox/Messages";
import { Tabs, Tab, Typography, Box, AppBar } from "@material-ui/core";
import PropTypes from "prop-types";

class Inbox extends Component {
    state = {
        tabValue: 0,
    };

    render() {
        const TabPanel = (props) => {
            const { children, value, index, ...other } = props;

            return (
                <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple-tabpanel-${index}`}
                    aria-labelledby={`simple-tab-${index}`}
                    {...other}>
                    {value === index && (
                        <Box p={3}>
                            <Typography>{children}</Typography>
                        </Box>
                    )}
                </div>
            );
        };

        TabPanel.propTypes = {
            children: PropTypes.node,
            index: PropTypes.any.isRequired,
            value: PropTypes.any.isRequired,
        };

        const a11yProps = (index) => {
            return {
                id: `simple-tab-${index}`,
                "aria-controls": `simple-tabpanel-${index}`,
            };
        };

        const handleChange = (event, newValue) => {
            this.setState({ tabValue: newValue });
        };

        return (
            <div>
                <Sidebar />
                <div className="wrapper homepage">
                    <HeaderDark />

                    <div className="container   pb-5 pt-5">
                        <div className="row no-gutters">
                            <div className="col">
                                <div className="">
                                    <Tabs
                                        value={this.state.tabValue}
                                        onChange={handleChange}
                                        aria-label="message-tabs"
                                        variant="fullWidth">
                                        <Tab label="Notifications" {...a11yProps(0)} />
                                        <Tab label="Messages" {...a11yProps(1)} />
                                    </Tabs>
                                    <TabPanel value={this.state.tabValue} index={0}>
                                        <Notifications />
                                    </TabPanel>
                                    <TabPanel value={this.state.tabValue} index={1}>
                                        <Messages />
                                    </TabPanel>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
