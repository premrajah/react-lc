import React, { Component } from "react";
import TruckBlue from "../../img/icons/truck-blue.png";
import LangIcon from "../../img/icons/lang.png";
import MarkerIcon from "../../img/icons/marker.png";
import CalenderIcon from "../../img/icons/calender.png";
import HandGreyIcon from "../../img/icons/hand-gray.png";
import EditGray from "../../img/icons/edit-gray.png";
import RingGray from "../../img/icons/ring-gray.png";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";

class MyDeliveries extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };

        this.getResources = this.getResources.bind(this);
    }

    getResources() {
        axios
            .get(baseUrl + "resource", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data;
                },
                (error) => {
                    var status = error.response.status;
                }
            );
    }

    interval;



    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper accountpage">
                    <HeaderDark />

                    <div className="container   pb-4 pt-4">
                        <div className="row justify-content-center">
                            <div className="col-auto pb-4 pt-4">
                                <img className={"search-icon-middle"} src={TruckBlue} alt="" />
                            </div>
                        </div>
                        <div className="row justify-content-center pb-2 pt-4 ">
                            <div className="col-auto">
                                <h3 className={"blue-text text-heading"}>My Deliveries</h3>
                            </div>
                        </div>

                        <div className="row justify-content-center pb-4 pt-2 ">
                            <div className="col-auto">
                                <p className={"text-gray-light small"}>
                                    Accept or decline upcoming assignments.
                                </p>
                            </div>
                        </div>
                    </div>

                    <NavTabs />
                </div>
            </div>
        );
    }
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}>
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        "aria-controls": `nav-tabpanel-${index}`,
    };
}

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function NavTabs() {
    const classes = useStylesTabs();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar className={"custom-tabs-blue"} position="static">
                <Tabs
                    style={{ backgroundColor: "#ffffff", color: "#151142" }}
                    indicatorColor="secondary"
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example">
                    <LinkTab label="Upcoming" href="/drafts" {...a11yProps(0)} />
                    <LinkTab label="In Progress" href="/trash" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <div className="row no-gutters justify-content-start mt-4 mb-4 listing-row-border pb-4">
                    {/*<div className={"col-4"}>*/}

                    {/*<img className={"img-fluid"} src={Paper} alt=""/>*/}
                    {/*</div>*/}
                    <div className={"col-11 content-box-listing"}>
                        <p style={{ fontSize: "18px" }} className=" mb-1">
                            Surrey → London
                        </p>
                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                            Paper and Cardboard
                        </p>
                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                            bailed / 10 kg
                        </p>
                    </div>
                    <div style={{ textAlign: "right" }} className={"col-1"}>
                        <p className={"gray-text"}>
                            <NavigateNextIcon />
                        </p>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className="row no-gutters justify-content-start mt-4 mb-4 listing-row-border pb-4">
                    {/*<div className={"col-4"}>*/}

                    {/*<img className={"img-fluid"} src={Paper} alt=""/>*/}
                    {/*</div>*/}
                    <div className={"col-11 content-box-listing"}>
                        <p style={{ fontSize: "18px" }} className=" mb-1">
                            Tesco → Company B
                        </p>
                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                            Paper and Cardboard
                        </p>
                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                            bailed / 10 kg
                        </p>
                    </div>
                    <div style={{ textAlign: "right" }} className={"col-1"}>
                        <p className={"gray-text"}>
                            <NavigateNextIcon />
                        </p>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div className={"container"}>
                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={MarkerIcon} alt="" />
                        </div>
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-gray-light mb-1">
                                Surrey, UK
                            </p>
                        </div>
                    </div>

                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={CalenderIcon} alt="" />
                        </div>
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-gray-light mb-1">
                                Joined in Jan 10, 2020
                            </p>
                        </div>
                    </div>
                    <div className="row  justify-content-start search-container listing-row-border pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={LangIcon} alt="" />
                        </div>
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="forgot-password-link text-mute text-gray-light mb-1">
                                www.tesco.co.uk
                            </p>
                        </div>
                    </div>
                    <div className="row  justify-content-start filter-row listing-row-border  mb-4 pt-5 pb-5">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={EditGray} alt="" />
                        </div>
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className=" text-mute text-gray-light mb-1">
                                Description
                            </p>
                        </div>
                    </div>

                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={HandGreyIcon} alt="" />
                        </div>
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className=" text-mute text-gray-light mb-1">
                                5 Listings
                            </p>
                        </div>
                    </div>
                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={RingGray} alt="" />
                        </div>
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className=" text-mute text-gray-light mb-1">
                                Cycles
                            </p>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </div>
    );
}

export default MyDeliveries;
