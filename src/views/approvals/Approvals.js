import React, {Component, useEffect, useState} from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import {connect} from "react-redux";
import {makeStyles,withStyles} from "@material-ui/core/styles/index";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import RequestReleaseItem from "../../components/RequestReleaseItem";
import RequestRegisterItem from "../../components/RequestRegisterItem";
import RequestServiceAgentItem from "../../components/RequestServiceAgentItem";
import {Link} from "react-router-dom";
import * as actionCreator from "../../store/actions/actions";
import ErrorBoundary from "../../components/ErrorBoundary";


const StyledTabs = withStyles({
    root: {
        borderBottom: '1px solid #70707062',
    },
    indicator: {
        backgroundColor: '#07AD88',
    },

})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
    root: {
        minWidth: 290,
        textTransform: 'none',
        color: '#3C3972',

        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),

        '&:hover': {
            color: '#3C3972',
            opacity: 1,
        },
        '&$selected': {
            color: '#3C3972',
            fontWeight: 500,
        },
        '&:focus': {
            color: '#3C3972',
        },
    },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        padding: theme.spacing(3),
    },
    demo1: {
        backgroundColor: theme.palette.background.paper,
    },
    demo2: {
        backgroundColor: '#2e1534',
    },
}));


class Approvals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            releaseRequests: [],
            registerRequests: [],
            serviceAgentRequests: [],
            value: 0,
            loading: false,
        };

        // this.fetchReleaseRequest = this.fetchReleaseRequest.bind(this);
        // this.fetchServiceAgentRequest = this.fetchServiceAgentRequest.bind(this);
        // this.fetchRegisterRequest = this.fetchRegisterRequest.bind(this);
    }

    handleChange = (event, newValue) => {


        this.setState({
            // loading: true,
            value: newValue,
        });

// alert(newValue);

        //
        // if (newValue === 0) {
        //     this.setState({
        //         releaseRequests: [],
        //     });
        //
        //     this.fetchReleaseRequest();
        // } else if (newValue === 1) {
        //     this.setState({
        //         registerRequests: [],
        //     });
        //
        //     this.fetchRegisterRequest();
        // } else if (newValue === 2) {
        //     this.setState({
        //         serviceAgentRequests: [],
        //     });
        //
        //     this.fetchServiceAgentRequest();
        // }
    };



    componentDidMount() {


        this.refreshItems()
        this.props.loadSites()

    }

    refreshProductReleaseCallback = () => {
        // this.fetchReleaseRequest()
    }



    interval

    refreshItems(){

        this.props.fetchReleaseRequest();
        this.props.fetchRegisterRequest();
        this.props.fetchServiceAgentRequest()


    this.interval = setInterval(() => {
        this.props.fetchReleaseRequest();
        this.props.fetchRegisterRequest();
        this.props.fetchServiceAgentRequest()
    }, 30000);
}

componentWillUnmount() {
    clearInterval(this.interval);
}






render() {

        return (
            <div>
                <Sidebar />
                <div className="wrapper approval-page">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <PageHeader pageTitle="Approvals" subTitle="Approve" />

                        <div className={"tab-content-listing col-12"}>
                            <div>
                                <AppBar
                                    position="static"
                                    style={{ boxShadhow: "none" , backgroundColor:"white"}}
                                    elevation={0}
                                >



                                    <StyledTabs
                                        value={this.state.value}
                                        onChange={this.handleChange.bind(this)}
                                        aria-label="nav tabs example"
                                        scrollButtons="auto"
                                    >
                                        <StyledTab
                                            label={
                                                this.props.productReleaseRequested.length > 0
                                                    ? "Product Release Requests (" +
                                                    this.props.productReleaseRequested.length +
                                                    ")"
                                                    : "Product Release Requests"
                                            }
                                            {...a11yProps(0)}
                                        />
                                        <StyledTab
                                            label={
                                                this.props.productRegisterRequests.length > 0
                                                    ? "Product Register Requests (" +
                                                    this.props.productRegisterRequests.length +
                                                    ")"
                                                    : "Product Register Requests"
                                            }
                                            {...a11yProps(1)}
                                        />
                                        <StyledTab
                                            label={
                                                this.props.serviceAgentRequests.length > 0
                                                    ? "Change Service Agent Requests (" +
                                                    this.props.serviceAgentRequests.length +
                                                    ")"
                                                    : "Change Service Agent Requests"
                                            }
                                            {...a11yProps(2)}
                                        />
                                    </StyledTabs>
                                </AppBar>

                                {this.state.value == 0 &&
                                <div className={"row"} value={this.state.value} index={0}>


                                        <div className="col-12 mt-3 mb-3">
                                            <div className="col d-flex justify-content-end">
                                                <Link to="/approved" className="btn btn-sm blue-btn"
                                                      style={{color: "#fff"}}>
                                                    Release Request Record
                                                </Link>
                                            </div>
                                        </div>
                                        <div className={"listing-row-border "}></div>

                                        {this.props.productReleaseRequested.map((item, index) => (
                                            <div className="col-12" key={item.product.product._id} id={item.product.product._id}>

                                                    <RequestReleaseItem
                                                        history={this.props.history}
                                                        item={item}
                                                        // refreshPageCallback={this.refreshProductReleaseCallback}
                                                    />

                                            </div>
                                        ))}
                                        {this.props.productReleaseRequested.length === 0 && (
                                            <div className={" column--message"}>
                                                <p>
                                                    {this.state.loading
                                                        ? "Loading..."
                                                        : "This search currently has no results"}
                                                </p>
                                            </div>
                                        )}

                                </div>
                                }
                                {this.state.value == 1 &&
                                <div className={"row"} value={this.state.value} index={1}>

                                        {this.props.productRegisterRequests.map((item, index) => (
                                            <div className={"col-12"} key={item.product.product._id+"_reg"} id={item.product.product._id+"_reg"}>

                                                <RequestRegisterItem
                                                    history={this.props.history}
                                                    item={item}
                                                />

                                            </div>
                                        ))}

                                        {this.props.productRegisterRequests.length === 0 && (
                                            <div className={" column--message"}>
                                                <p>
                                                    {this.state.loading
                                                        ? "Loading..."
                                                        : "This search currently has no results"}
                                                </p>
                                            </div>
                                        )}

                                </div>}
                                {this.state.value == 2 &&
                                <div className={"row"} value={this.state.value} index={2}>

                                        {this.props.serviceAgentRequests.map((item, index) => (
                                            <div className={"col-12"} key={item.product.product._id+"_sg"} id={item.product.product._id+"_sg"} >
                                                <RequestServiceAgentItem
                                                    history={this.props.history}
                                                    item={item}
                                                />
                                            </div>
                                        ))}

                                        {this.props.serviceAgentRequests.length === 0 && (
                                            <div className={" column--message"}>
                                                <p>
                                                    {this.state.loading
                                                        ? "Loading..."
                                                        : "This search currently has no results"}
                                                </p>
                                            </div>
                                        )}

                                </div>}




                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function NavTabs(props) {
    const classes = useStylesTabs();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [releases, setReleases] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [serviceAgents, setServiceAgents] = useState([]);

    const getReleases = () => {
        axios
            .get(baseUrl + "release")
            .then(
                (response) => {
                    let responseAll = response.data.data;
                    setReleases(responseAll);
                }
            ).catch(error => {});
    };

    const getRegisters = () => {
        axios
            .get(baseUrl + "register")
            .then(
                (response) => {
                    let responseAll = response.data.data;
                    setRegisters(responseAll);
                }
            ).catch(error => {});
    };

    const getServiceAgents = () => {
        axios
            .get(baseUrl + "service-agent")
            .then(
                (response) => {
                    let responseAll = response.data.data;
                    setRegisters(responseAll);
                }
            ).catch(error => {

        });
    };

    useEffect(() => {
        getReleases();
        getRegisters();
        getServiceAgents();
    });

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ boxShadhow: "none" }} elevation={0}>
                <Tabs
                    style={{
                        backgroundColor: "#ffffff",
                        color: "#07AD88!important",
                        boxShadow: "none",
                    }}
                    indicatorColor="secondary"
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example">
                    <LinkTab
                        label={"Product Release Requests (" + releases.length + ")"}
                        {...a11yProps(0)}
                    />
                    <LinkTab
                        label={"Product Register Requests (" + registers.length + ")"}
                        {...a11yProps(1)}
                    />
                    <LinkTab
                        label={"Change Service Agent Requests  (" + serviceAgents.length + ")"}
                        {...a11yProps(2)}
                    />
                </Tabs>
            </AppBar>

            <TabPanel value={value} index={0}>
                <div className={"container"}>
                    {releases.map((item, index) => (
                        <React.Fragment key={index}>
                            <RequestReleaseItem history={props.history} item={item} />
                        </React.Fragment>
                    ))}

                    {releases.length === 0 && (
                        <div className={" column-empty-message"}>
                            <p>This search currently has no results</p>
                        </div>
                    )}
                </div>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <div className={"container"}>
                    {registers.map((item, index) => (
                        <React.Fragment key={index}>
                            <RequestRegisterItem history={props.history} item={item} />
                        </React.Fragment>
                    ))}

                    {releases.length === 0 && (
                        <div className={" column-empty-message"}>
                            <p>This search currently has no results</p>
                        </div>
                    )}
                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div className={"container"}>
                    {serviceAgents.map((item, index) => (
                        <React.Fragment key={index}>
                            <RequestServiceAgentItem history={props.history} item={item} />
                        </React.Fragment>
                    ))}

                    {serviceAgents.length === 0 && (
                        <div className={" column-empty-message"}>
                            <p>This search currently has no results</p>
                        </div>
                    )}
                </div>
            </TabPanel>
        </div>
    );
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
                    <Typography component="div">{children}</Typography>
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
        paddingRight: "0",
        paddingLight: "0",
        backgroundColor: theme.palette.background.paper,
    },
}));

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        serviceAgentRequests: state.serviceAgentRequests,
        productReleaseRequested: state.productReleaseRequested,
        productRegisterRequests: state.productRegisterRequests,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        test: null,

        fetchReleaseRequest: () => dispatch(actionCreator.fetchReleaseRequest()),
        fetchServiceAgentRequest: () => dispatch(actionCreator.fetchServiceAgentRequest()),
        fetchRegisterRequest: () => dispatch(actionCreator.fetchRegisterRequest()),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Approvals);
