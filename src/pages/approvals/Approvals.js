import React, {Component} from "react";
import PageHeader from "../../components/PageHeader";
import {connect} from "react-redux";
import {makeStyles, withStyles} from "@mui/styles/index";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import RequestReleaseItem from "../../components/RequestReleaseItem";
import RequestRegisterItem from "../../components/RequestRegisterItem";
import RequestServiceAgentItem from "../../components/RequestServiceAgentItem";
import {Link} from "react-router-dom";
import * as actionCreator from "../../store/actions/actions";
import Layout from "../../components/Layout/Layout";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from '@mui/lab/TabPanel';

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
            tabQuery: 0,
            activeKey:"1",
        };

    }

    handleChange = (event, newValue) => {
        this.setState({value: newValue, tabQuery: newValue});
    };

    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }


    componentDidMount() {

        this.setActiveKey(null,"1")

        const query = new URLSearchParams(this.props.location.search);
        query
            ? this.setState({tabQuery: query.get('tab')})
            : this.setState({tabQuery: 0});


        this.refreshItems()
        this.props.loadSites()
        this.props.loadProductsWithoutParent({offset:this.props.productPageOffset,size:this.props.productPageSize});

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
            <Layout>
                <div className="container  pb-4 pt-4">
                        <PageHeader pageTitle="Approvals" subTitle="You can approve or decline a new product someone has released to you here" />

                    <div className={"listing-row-border "}></div>

                    <div className={"row"}>
                        <div className={" col-12"}>

                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={this.state.activeKey}>
                                    <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                        <TabList
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            textColor={"#27245C"}
                                            TabIndicatorProps={{
                                                style: {
                                                    backgroundColor: "#27245C",
                                                    padding: '2px',
                                                }
                                            }}
                                            onChange={this.setActiveKey}

                                            aria-label="lab API tabs example">

                                            <Tab label="Product Release Request" value="1" />
                                            <Tab label="Product Release Request" value="2"/>
                                            <Tab label="Change Service Agent Request" value="3" />

                                        </TabList>
                                    </Box>

                                    <TabPanel value="1">
                                        <div className={"row"} >
                                            <div className="col-12 mt-3 mb-3">
                                                <div className="col d-flex justify-content-end">
                                                    <Link to="/approved" className="btn btn-sm blue-btn"
                                                          style={{color: "#fff"}}>
                                                        Release Request Records
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className={"listing-row-border "}></div>
                                            {this.props.productReleaseRequests.filter(r =>
                                                r.Release.stage !== "complete" &&
                                                r.Release.stage !== "cancelled" &&
                                                r.Release.stage !== "invalidated").map((item, index) => (
                                                <div className="col-12" key={item.product.product._id} id={item.product.product._id}>

                                                    <RequestReleaseItem
                                                        history={this.props.history}
                                                        item={item}
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
                                    </TabPanel>
                                    <TabPanel value="2">
                                        <div className={"row"} >

                                            <div className="col-12 mt-3 mb-3">
                                                <div className="col d-flex justify-content-end">
                                                    <Link to="/register-record" className="btn btn-sm blue-btn"
                                                          style={{color: "#fff"}}>
                                                        Register Request Records
                                                    </Link>
                                                </div>
                                            </div>

                                            {this.props.productRegisterRequests.filter(r => (
                                                r.registration.stage !== "complete" &&
                                                r.registration.stage !== "cancelled" &&
                                                r.registration.stage !== "invalidated")
                                            ).map((item, index) => (
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


                                            {
                                                this.props.productRegisterRequests.filter(r => (
                                                    r.registration.stage !== "complete" &&
                                                    r.registration.stage !== "cancelled" &&
                                                    r.registration.stage !== "invalidated")
                                                ).length === 0 && (
                                                    <div className={" column--message"}>
                                                        <p>
                                                            {this.state.loading
                                                                ? "Loading..."
                                                                : "This currently has no active results"}
                                                        </p>
                                                    </div>
                                                )
                                            }


                                        </div>
                                    </TabPanel>
                                    <TabPanel value="3">
                                        <div className={"row"} >

                                            <div className="col-12 mt-3 mb-3">
                                                <div className="col d-flex justify-content-end">
                                                    <Link to="/service-agent-record" className="btn btn-sm blue-btn"
                                                          style={{color: "#fff"}}>
                                                        Service Agent Request Records
                                                    </Link>
                                                </div>
                                            </div>

                                            {this.props.serviceAgentRequests.filter(r => (r.Release.stage !== "complete" && r.Release.stage !== "cancelled")).map((item, index) => (
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

                                            {
                                                this.props.serviceAgentRequests.filter(r => (
                                                    r.Release.stage !== "complete" &&
                                                    r.Release.stage !== "cancelled")
                                                ).length === 0 && (
                                                    <div className={" column--message"}>
                                                        <p>
                                                            {this.state.loading
                                                                ? "Loading..."
                                                                : "This currently has no active results"}
                                                        </p>
                                                    </div>
                                                )
                                            }

                                        </div>

                                    </TabPanel>


                                </TabContext>
                            </Box>

                        </div>
                    </div>
                </div>

            </Layout>
        );
    }
}




const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        serviceAgentRequests: state.serviceAgentRequests,
        productReleaseRequests: state.productReleaseRequests,
        productReleaseRequested: state.productReleaseRequested,
        productRegisterRequests: state.productRegisterRequests,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchReleaseRequest: () => dispatch(actionCreator.fetchReleaseRequest()),
        fetchServiceAgentRequest: () => dispatch(actionCreator.fetchServiceAgentRequest()),
        fetchRegisterRequest: () => dispatch(actionCreator.fetchRegisterRequest()),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Approvals);
