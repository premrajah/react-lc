import React, {Component} from "react";
import PageHeader from "../../components/PageHeader";
import {connect} from "react-redux";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import RequestReleaseItem from "../../components/Approvals/RequestReleaseItem";
import RequestRegisterItem from "../../components/Approvals/RequestRegisterItem";
import RequestServiceAgentItem from "../../components/Approvals/RequestServiceAgentItem";
import {Link} from "react-router-dom";
import * as actionCreator from "../../store/actions/actions";
import Layout from "../../components/Layout/Layout";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from '@mui/lab/TabPanel';
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import RequestSiteReleaseItem from "../../components/Approvals/RequestSiteReleaseItem";
import RequestRentalReleaseItem from "../../components/Approvals/RequestRentalReleaseItem";
import RentalRequestItem from "../../components/Approvals/RentalRequestItem";


class Approvals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            releaseRequests: [],
            registerRequests: [],
            rentalRequests: [],
            rentalReleases: [],
            serviceAgentRequests: [],
            value: 0,
            loading: false,
            tabQuery: 0,
            activeKey:"1",
            siteReleases:[]
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


     fetchSiteReleaseRequests = () => {

         axios.get(baseUrl + "site-release").then(
             (response) => {

                 let responseAll = response.data.data;

                 this.setState({
                     siteReleases:responseAll
                 })

             },
             (error) => {
                 // let status = error.response.status
                 // dispatch({ type: "PRODUCT_LIST", value: [] })
             }
         )
             .catch(error => {});
    };

    componentDidMount() {

        if (this.props.location.search.includes("tab=")){

            if (this.props.location.search.includes("tab=0"))
            this.setActiveKey(null,"1")

           else if (this.props.location.search.includes("tab=1"))
                this.setActiveKey(null,"2")

           else if (this.props.location.search.includes("tab=2"))
                this.setActiveKey(null,"3")

            else if (this.props.location.search.includes("tab=3"))
                this.setActiveKey(null,"4")

            else if (this.props.location.search.includes("tab=4"))
                this.setActiveKey(null,"5")

            else if (this.props.location.search.includes("tab=5"))
                this.setActiveKey(null,"6")
        }

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
        this.fetchSiteReleaseRequests()
        // this.fetchRentalRequests()
        // this.fetchRentalReleases()

    this.interval = setInterval(() => {
        this.props.fetchReleaseRequest();
        this.props.fetchRegisterRequest();
        this.props.fetchServiceAgentRequest()
        this.fetchSiteReleaseRequests()
        this.fetchRentalRequests()
    }, 30000);
}


     fetchRentalRequests = () => {

        axios.get(baseUrl + "rental-request").then(
            (response) => {

                let responseAll = response.data.data;

                this.setState({
                    rentalRequests:responseAll
                })

                // dispatch()
            },
            (error) => {
                // let status = error.response.status
                // dispatch({ type: "PRODUCT_LIST", value: [] })
            }
        )
            .catch(error => {});

        // dispatch({ type: "PRODUCT_LIST", value: [] })
    };
    fetchRentalReleases = () => {

        axios.get(baseUrl + "rental-release").then(
            (response) => {

                let responseAll = response.data.data;

                this.setState({
                    rentalReleases:responseAll
                })

                // dispatch()
            },
            (error) => {
                // let status = error.response.status
                // dispatch({ type: "PRODUCT_LIST", value: [] })
            }
        )
            .catch(error => {});

        // dispatch({ type: "PRODUCT_LIST", value: [] })
    };

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
                                            allowScrollButtonsMobile
                                            TabIndicatorProps={{
                                                style: {
                                                    backgroundColor: "#27245C",
                                                    padding: '2px',
                                                }
                                            }}
                                            onChange={this.setActiveKey}

                                            aria-label="lab API tabs example">

                                            <Tab label="Product Release " value="1" />
                                            <Tab label="Product Register" value="2"/>
                                            <Tab label="Change Service Agent" value="3" />
                                            <Tab label="Site Release " value="4" />
                                            {/*<Tab label="Rental Release " value="5" />*/}
                                            {/*<Tab label="Rental Requests " value="6" />*/}
                                            <Tab label="Event Release " value="7" />
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
                                                <div className="col-12" key={item.product_id.replace("Product/","")} id={item.product_id.replace("Product/","")}>

                                                    <RequestReleaseItem

                                                        refresh={()=>{

                                                            this.props.fetchReleaseRequest();
                                                        }}

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
                                                <div className={"col-12"} key={item.product_id+"_reg"} id={item.product_id+"_reg"}>

                                                    <RequestRegisterItem
                                                        history={this.props.history}
                                                        item={item}

                                                        refresh={()=>{

                                                            this.props.fetchRegisterRequest();
                                                        }}
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
                                                <div className={"col-12"} key={item.product_id+"_sg"} id={item.product_id+"_sg"} >
                                                    <RequestServiceAgentItem
                                                        history={this.props.history}
                                                        item={item}
                                                        refresh={()=>{
                                                            this.props.fetchServiceAgentRequest();
                                                        }}
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

                                            {/*{*/}
                                            {/*    this.props.serviceAgentRequests.filter(r => (*/}
                                            {/*        r.Release.stage !== "complete" &&*/}
                                            {/*        r.Release.stage !== "cancelled")*/}
                                            {/*    ).length === 0 && (*/}
                                            {/*        <div className={" column--message"}>*/}
                                            {/*            <p>*/}
                                            {/*                {this.state.loading*/}
                                            {/*                    ? "Loading..."*/}
                                            {/*                    : "This currently has no active results"}*/}
                                            {/*            </p>*/}
                                            {/*        </div>*/}
                                            {/*    )*/}
                                            {/*}*/}

                                        </div>

                                    </TabPanel>
                                    <TabPanel value="4">
                                        <div className={"row"} >
                                            <div className="col-12 mt-3 mb-3">
                                                <div className="col d-flex justify-content-end">
                                                    <Link to="/approved" className="btn btn-sm blue-btn"
                                                          style={{color: "#fff"}}>
                                                       Site Release  Records
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className={"listing-row-border "}></div>


                                            {this.state.siteReleases.filter(r =>
                                                r.Release.stage !== "complete" &&
                                                r.Release.stage !== "cancelled" &&
                                                r.Release.stage !== "invalidated").map((item, index) =>
                                                <>
                                                <div className="col-12"
                                                     key={item.Site_id.replace("Site/","")}
                                                     id={item.Site_id.replace("Site/","")}>

                                                    <RequestSiteReleaseItem
                                                        refresh={()=>{
                                                            this.fetchSiteReleaseRequests();
                                                        }}
                                                        history={this.props.history}
                                                        item={item}
                                                    />

                                                </div>

                                                </>
                                            )}


                                            {this.state.siteReleases.length === 0 && (
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

                                    <TabPanel value="5">
                                        <div className={"row"} >
                                            <div className="col-12 mt-3 mb-3">
                                                <div className="col d-flex justify-content-end">
                                                    <Link to="/rental-records" className="btn btn-sm blue-btn"
                                                          style={{color: "#fff"}}>
                                                        Rental Release Records
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className={"listing-row-border "}></div>


                                            {this.state.rentalReleases.filter(r =>
                                                r.Release.stage !== "complete" &&
                                                r.Release.stage !== "cancelled" &&
                                                r.Release.stage !== "invalidated").map((item, index) =>
                                                <>
                                                    <div className="col-12"
                                                         key={item.Release._key}
                                                         id={item.Release._key}
                                                         >

                                                        <RequestRentalReleaseItem
                                                            refresh={()=>{
                                                                this.fetchRentalReleases();
                                                            }}
                                                            history={this.props.history}
                                                            item={item}
                                                        />

                                                    </div>

                                                </>
                                            )}


                                            {this.state.siteReleases.length === 0 && (
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
                                    <TabPanel value="6">
                                        <div className={"row"} >
                                            <div className="col-12 mt-3 mb-3">
                                                <div className="col d-flex justify-content-end">
                                                    <Link to="/rental-request-records" className="btn btn-sm blue-btn"
                                                          style={{color: "#fff"}}>
                                                        Rental Request Records
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className={"listing-row-border "}></div>


                                            {this.state.rentalRequests.filter(r =>
                                                r.registration.stage !== "complete" &&
                                                r.registration.stage !== "cancelled" &&
                                                r.registration.stage !== "invalidated").map((item, index) =>
                                                <>
                                                    <div className="col-12"
                                                         key={item.registration._key}
                                                         id={item.registration._key}
                                                    >

                                                        <RentalRequestItem
                                                            refresh={()=>{
                                                                this.fetchRentalRequests();
                                                            }}
                                                            history={this.props.history}
                                                            item={item}
                                                        />
                                                    </div>
                                                </>
                                            )}


                                            {this.state.siteReleases.length === 0 && (
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

                                    <TabPanel value="7">
                                        <div className={"row"} >
                                            <div className="col-12 mt-3 mb-3">
                                                <div className="col d-flex justify-content-end">
                                                    <Link to="/rental-request-records" className="btn btn-sm blue-btn"
                                                          style={{color: "#fff"}}>
                                                        Event Release Records
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className={"listing-row-border "}></div>


                                            {this.state.rentalRequests.filter(r =>
                                                r.registration.stage !== "complete" &&
                                                r.registration.stage !== "cancelled" &&
                                                r.registration.stage !== "invalidated").map((item, index) =>
                                                <>
                                                    <div className="col-12"
                                                         key={item.registration._key}
                                                         id={item.registration._key}
                                                    >

                                                        <RentalRequestItem
                                                            refresh={()=>{
                                                                this.fetchRentalRequests();
                                                            }}
                                                            history={this.props.history}
                                                            item={item}
                                                        />
                                                    </div>
                                                </>
                                            )}


                                            {this.state.siteReleases.length === 0 && (
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
