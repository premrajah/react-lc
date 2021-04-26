import React, {Component, useEffect, useState} from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles/index";
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

        this.fetchReleaseRequest = this.fetchReleaseRequest.bind(this);
        this.fetchServiceAgentRequest = this.fetchServiceAgentRequest.bind(this);
        this.fetchRegisterRequest = this.fetchRegisterRequest.bind(this);
    }

    handleChange = (event, newValue) => {
        this.setState({
            loading: true,
            value: newValue,
        });

        if (newValue === 0) {
            this.setState({
                releaseRequests: [],
            });

            this.fetchReleaseRequest();
        } else if (newValue === 1) {
            this.setState({
                registerRequests: [],
            });

            this.fetchRegisterRequest();
        } else if (newValue === 2) {
            this.setState({
                serviceAgentRequests: [],
            });

            this.fetchServiceAgentRequest();
        }
    };

    fetchReleaseRequest() {
        console.log('>> rr >> ')
        axios
            .get(baseUrl + "release")
            .then((response) => {
                    let responseAll = response.data.data;

                    this.setState({
                        releaseRequests: responseAll,
                        loading: false
                    });
                }
            ).catch(error =>{
                this.setState({
                    loading: false,
                });
        });
    }

    fetchRegisterRequest() {
        console.log('>> fr >> ');
        axios
            .get(baseUrl + "register")
            .then(
                (response) => {
                    let responseAll = response.data.data;
                    this.setState({
                        loading: false,
                        registerRequests: responseAll,
                    });
                }
            ).catch(error => {
            this.setState({
                loading: false,
            });
        });
    }

    fetchServiceAgentRequest() {
        console.log('>> sa >> ')
        axios
            .get(baseUrl + "service-agent")
            .then(
                (response) => {
                    let responseAll = response.data.data;

                    this.setState({
                        loading: false,
                        serviceAgentRequests: responseAll,
                    });
                }
            ).catch(error => {
            this.setState({
                loading: false,
            });
        });
    }

    componentDidMount() {
        this.fetchReleaseRequest();
    }

    refreshProductReleaseCallback = () => {
        this.fetchReleaseRequest()
    }

    render() {

        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <PageHeader pageTitle="Approvals" subTitle="Approve" />

                        <div className={"tab-content-listing col-12"}>
                            <div>
                                <AppBar
                                    position="static"
                                    style={{ boxShadhow: "none" }}
                                    elevation={0}>
                                    <Tabs
                                        style={{
                                            backgroundColor: "#ffffff",
                                            color: "#07AD88!important",
                                            boxShadow: "none",
                                        }}
                                        indicatorColor="secondary"
                                        variant="fullWidth"
                                        value={this.state.value}
                                        onChange={this.handleChange.bind(this)}
                                        aria-label="nav tabs example">
                                        <LinkTab
                                            label={
                                                this.state.releaseRequests.length > 0
                                                    ? "Product Release Requests (" +
                                                      this.state.releaseRequests.filter((item) => item.Release.stage === "requested" ).length +
                                                      ")"
                                                    : "Product Release Requests"
                                            }
                                            {...a11yProps(0)}
                                        />
                                        <LinkTab
                                            label={
                                                this.state.registerRequests.length > 0
                                                    ? "Product Register Requests (" +
                                                      this.state.registerRequests.length +
                                                      ")"
                                                    : "Product Register Requests"
                                            }
                                            {...a11yProps(1)}
                                        />
                                        <LinkTab
                                            label={
                                                this.state.serviceAgentRequests.length > 0
                                                    ? "Change Service Agent Requests  (" +
                                                      this.state.serviceAgentRequests.length +
                                                      ")"
                                                    : "Change Service Agent Requests"
                                            }
                                            {...a11yProps(2)}
                                        />
                                    </Tabs>
                                </AppBar>

                                <TabPanel value={this.state.value} index={0}>
                                    <div className={"container"}>

                                        <div className="row mb-3">
                                            <div className="col d-flex justify-content-end">
                                                <Link to="/approved" className="btn btn-sm blue-btn" style={{color: "#fff"}}>
                                                    Release Request Record
                                                </Link>
                                            </div>
                                        </div>

                                        {this.state.releaseRequests.filter((item) => item.Release.stage === "requested" ).map((item, index) => (
                                            <div className="row" key={index}>
                                                <div className="col">
                                                    <RequestReleaseItem
                                                        history={this.props.history}
                                                        item={item}
                                                        refreshPageCallback={this.refreshProductReleaseCallback}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {this.state.releaseRequests.filter((item) => item.Release.stage === "requested" ).length === 0 && (
                                            <div className={" column-empty-message"}>
                                                <p>
                                                    {this.state.loading
                                                        ? "Loading..."
                                                        : "This search currently has no results"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </TabPanel>

                                <TabPanel value={this.state.value} index={1}>
                                    <div className={"container"}>
                                        {this.state.registerRequests.map((item) => (
                                            <>
                                                <RequestRegisterItem
                                                    history={this.props.history}
                                                    item={item}
                                                />
                                            </>
                                        ))}

                                        {this.state.registerRequests.length === 0 && (
                                            <div className={" column-empty-message"}>
                                                <p>
                                                    {this.state.loading
                                                        ? "Loading..."
                                                        : "This search currently has no results"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </TabPanel>
                                <TabPanel value={this.state.value} index={2}>
                                    <div className={"container"}>
                                        {this.state.serviceAgentRequests.map((item) => (
                                            <>
                                                <RequestServiceAgentItem
                                                    history={this.props.history}
                                                    item={item}
                                                />
                                            </>
                                        ))}

                                        {this.state.serviceAgentRequests.length === 0 && (
                                            <div className={" column-empty-message"}>
                                                <p>
                                                    {this.state.loading
                                                        ? "Loading..."
                                                        : "This search currently has no results"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </TabPanel>
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
                    {releases.map((item) => (
                        <>
                            <RequestReleaseItem history={props.history} item={item} />
                        </>
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
                    {registers.map((item) => (
                        <>
                            <RequestRegisterItem history={props.history} item={item} />
                        </>
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
                    {serviceAgents.map((item) => (
                        <>
                            <RequestServiceAgentItem history={props.history} item={item} />
                        </>
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
        paddingRight: "0",
        paddingLight: "0",
        backgroundColor: theme.palette.background.paper,
    },
}));

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        test: null,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Approvals);
