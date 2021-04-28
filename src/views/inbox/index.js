import React, { Component } from "react";
import { connect } from "react-redux";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import Notifications from "../../components/Inbox/Notifications";
import Messages from "../../components/Inbox/Messages";
import { Box, Tab, Tabs } from "@material-ui/core";
import PropTypes from "prop-types";
import * as actionCreator from "../../store/actions/actions";

class Inbox extends Component {
    state = {
        tabValue: 0,
    };

    componentDidMount() {
        this.setState({tabValue: this.props.location.state ? this.props.location.state : 0});
        this.props.getNotifications();
        this.props.getMessages();
    }


    handleChange = (event, newValue) => {
        this.setState({ tabValue: newValue });
        if(newValue === 0) {
            this.props.getNotifications();
        } else if(newValue === 1) {
            this.props.getMessages();
        }
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
                            <div>{children}</div>
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
                                        value={this.props.location.state ? this.props.location.state : this.state.tabValue}
                                        onChange={this.handleChange}
                                        aria-label="message-tabs"
                                        variant="fullWidth">
                                        <Tab label="Notifications" {...a11yProps(this.props.location.state ? this.props.location.state : this.state.tabValue)} />
                                        <Tab label="Messages" {...a11yProps(this.props.location.state ? this.props.location.state :this.state.tabValue)} />
                                    </Tabs>
                                    <TabPanel value={this.props.location.state ? this.props.location.state : this.state.tabValue} index={0}>
                                        <Notifications />
                                    </TabPanel>
                                    <TabPanel value={this.props.location.state ? this.props.location.state :this.state.tabValue} index={1}>
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
    return {
        getMessages: (data) => dispatch(actionCreator.getMessages(data)),
        getNotifications: (data) => dispatch(actionCreator.getNotifications(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
