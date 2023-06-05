import React, { Component } from "react";
// import MarkerIcon from '../../img/icons/marker.png';
// import CalIcon from '../../img/icons/calender-dgray.png';
import PlaceholderImg from "../img/place-holder-lc.png";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { withStyles } from "@mui/styles/index";
import ProductExpandItem from "./Products/ProductExpandItem";
import OrgComponent from "./Org/OrgComponent";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import {Link} from "react-router-dom";
import {GoogleMap} from "./Map/MapsContainer";

class ItemDetailPreview extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp: false,
            matches: [],
        };
    }


    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }

    componentDidMount() {
        window.scrollTo(0, 0);

        this.setState({
            activeKey:"0"
        })

    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                <div className="container " style={{ padding: "0" }}>
                    <div className="row   justify-content-center">
                        <div className="col-md-4 col-sm-12 col-xs-12 ">
                            <div className="row stick-left-box  ">
                                <div className="col-12 text-center ">
                                    <img
                                        className={"img-fluid rad-8 bg-white p-2"}
                                        src={
                                            this.props.previewImage
                                                ? this.props.previewImage
                                                : PlaceholderImg
                                        }
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={"col-md-8 col-sm-12 col-xs-12 "}>
                            <div className="row justify-content-start pb-3  ">
                                <div className="col-12">
                                    <h4 className="text-capitalize product-title"> {this.props.item["title"]}</h4>
                                </div>

                                <div className="col-12">
                                    <div className="row">
                                        {/*<div className="col-7">*/}
                                        {/*    /!*<OrgComponent org={this.state.item.org} />*!/*/}
                                        {/*    <span className="sub-title-text-pink"> Parallelai New</span>*/}
                                        {/*    <p>*/}
                                        {/*        Sold By*/}
                                        {/*        <span className={"green-text"}>*/}
                                        {/*            @{this.props.userDetail.orgId}*/}
                                        {/*        </span>*/}
                                        {/*    </p>*/}
                                        {/*</div>*/}

                                        <div className="col-5 blue-text text-blue text-bold  text-left">
                                            {this.props.item["price"] ? (
                                                <>GBP {this.props.item["price"]}</>
                                            ) : (
                                                "Free"
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row justify-content-start pb-3 ">
                                <div className="col-auto">
                                    <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                                        {this.props.item["description"]}
                                    </p>
                                </div>
                            </div>

                            <div className={"listing-row-border "}></div>
                            {this.props.item &&
                            <div className="row justify-content-start pb-3  tabs-detail">
                                <div className="col-12 ">

                                    <Box sx={{ width: '100%', typography: 'body1' }}>
                                        <TabContext value={this.state.activeKey}>
                                            <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                                <TabList
                                                    variant="scrollable"
                                                    scrollButtons="auto"
                                                    TabIndicatorProps={{
                                                        style: {
                                                            backgroundColor: "#27245C",
                                                            padding: '2px',
                                                            color:"#27245C"
                                                        }
                                                    }}
                                                    onChange={this.setActiveKey}

                                                    aria-label="lab API tabs example">


                                                    <Tab label="Info" value="0"/>

                                                    <Tab label="Linked Product" value="1" />

                                                </TabList>
                                            </Box>

                                            <TabPanel value="0">

                                                <div className="bg-white p-3 mt-4 rad-8">

                                                    <div className="row justify-content-start search-container ">
                                                        <div className="col-auto"><p
                                                            className=" text-bold text-label text-blue mb-1">Available From</p>
                                                            <p className="text-gray-light mb "> {moment(this.props.item["startDate"]).format(
                                                                "DD MMM YYYY"
                                                            )}</p></div>
                                                    </div>
                                                    <div className="row justify-content-start search-container ">
                                                        <div className="col-auto"><p
                                                            className=" text-bold text-label text-blue mb-1">Available Until</p><p
                                                            className="text-gray-light mb "> {moment(this.props.item["endDate"]).format("DD MMM YYYY")}</p></div>
                                                    </div>
                                                    {this.props.site &&  <div className="row justify-content-start search-container ">
                                                        <div className="col-auto"><p
                                                            className=" text-bold text-label text-blue mb-1">Located At</p>
                                                            <p className="text-gray-light mb "> {this.props.site.name}</p>
                                                        </div>
                                                    </div>}

                                                </div>
                                            </TabPanel>

                                            {this.props.item["product"]&&  <TabPanel value="1">

                                                <>

                                                    <div className={"mt-4"}></div>


                                                        <ProductExpandItem
                                                            hideMoreMenu={true}
                                                            hideAddAll={true}
                                                            productId={this.props.item["product"]}
                                                        />
                                                </>

                                            </TabPanel>}




                                        </TabContext>
                                    </Box>

                                </div>
                            </div>}



                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const useStyles = makeStyles((theme) => ({
    text: {
        padding: theme.spacing(2, 2, 0),
    },
    paper: {
        paddingBottom: 50,
    },
    list: {
        marginBottom: theme.spacing(2),
    },
    subheader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: "auto",
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: "absolute",
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: "0 auto",
    },
}));

export default ItemDetailPreview;
