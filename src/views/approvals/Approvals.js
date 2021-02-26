import React, {Component} from 'react';
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import {connect} from "react-redux";
import { makeStyles } from "@material-ui/core/styles/index";
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchGray from '@material-ui/icons/Search';
import clsx from 'clsx';
import { Link } from "react-router-dom";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import RequestReleaseItem from '../../components/RequestReleaseItem'
import RequestRegisterItem from '../../components/RequestRegisterItem'
import RequestServiceAgentItem from '../../components/RequestServiceAgentItem'






class Approvals extends Component {



    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            releaseRequests: [],
            registerRequests: [],
            serviceAgentRequests: []
        }


        this.fetchReleaseRequest = this.fetchReleaseRequest.bind(this)
        this.fetchRegisterRequest = this.fetchRegisterRequest.bind(this)
        this.fetchServiceAgentRequest = this.fetchServiceAgentRequest.bind(this)




    }


    fetchReleaseRequest(){

        axios.get(baseUrl + "release" ,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.data;


                    this.setState({

                        releaseRequests: responseAll
                    })



                },
                (error) => {




                }
            );

    }
    fetchRegisterRequest(){

        axios.get(baseUrl + "register" ,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.data;

                    this.setState({

                        registerRequests: responseAll
                    })



                },
                (error) => {




                }
            );

    }


    fetchServiceAgentRequest(){

        axios.get(baseUrl + "service-agent" ,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data.data;

                    console.log(responseAll)

                    this.setState({

                        serviceAgentRequests: responseAll
                    })



                },
                (error) => {




                }
            );

    }


    componentDidMount(){

        this.fetchReleaseRequest()
        this.fetchRegisterRequest()
        this.fetchServiceAgentRequest()
    }




    render(){
        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />


                    <div className="container  pb-4 pt-4">

                        <PageHeader  pageTitle="Approvals" subTitle="Approve" />

                        <div className={"tab-content-listing col-12"}>

                            <NavTabs
                                      releases={this.state.releaseRequests}
                                      registers={this.state.registerRequests}
                                      serviceAgents={this.state.serviceAgentRequests}
                            />

                        </div>

                    </div>


                </div>
            </div>
        )
    }
}



function NavTabs(props) {
    const classes = useStylesTabs();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{boxShadhow:"none"}} elevation={0}>
                <Tabs
                    style={{ backgroundColor: "#ffffff", color: "#07AD88!important" ,boxShadow:"none"}}
                    indicatorColor="secondary"
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"

                >

                    {/*{props.releases.length>0 &&*/}
                    <LinkTab label={"Product Release Requests ("+props.releases.length+")"} href="/drafts" {...a11yProps(0)} />
                    {/*}*/}

                    {/*{props.suggesstions.length > 0 &&*/}

                    {/*{props.registers.length>0 &&*/}
                    <LinkTab label={"Product Register Requests ("+props.registers.length+")"} href="/drafts" {...a11yProps(1)} />
                    {/*}*/}


                    {/*{props.serviceAgents.length>0 &&*/}
                    <LinkTab label={"Change Service Agent Requests  ("+props.serviceAgents.length+")"} href="/drafts" {...a11yProps(2)} />
                    {/*}*/}

                    {/*}*/}


                </Tabs>
            </AppBar>


            <TabPanel value={value} index={0}>
                <div className={"container"}>

                    {props.releases.map((item) =>
                        <>

                            <RequestReleaseItem history={props.history}  item={item}  />

                        </>

                    )}

                    { props.releases.length === 0 &&
                    <div className={" column-empty-message"}>
                        <p>This search currently has no results</p>
                    </div>
                    }


                </div>
            </TabPanel>


            <TabPanel value={value} index={1}>
                <div className={"container"}>

                    {props.registers.map((item) =>
                        <>

                            <RequestRegisterItem history={props.history}  item={item}  />

                        </>

                    )}

                    { props.releases.length === 0 &&
                    <div className={" column-empty-message"}>
                        <p>This search currently has no results</p>
                    </div>
                    }


                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div className={"container"}>

                    {props.serviceAgents.map((item) =>
                        <>
                            <RequestServiceAgentItem history={props.history}  item={item}  />

                        </>

                    )}

                    { props.serviceAgents.length === 0 &&
                    <div className={" column-empty-message"}>
                        <p>This search currently has no results</p>
                    </div>
                    }


                </div>
            </TabPanel>

        </div>
    );
}


function SearchField() {

    const classes = useStylesTabs();

    return (
        <TextField
            variant="outlined"
            className={clsx(classes.margin, classes.textField) + " full-width-field"}
            id="input-with-icon-textfield"

            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchGray style={{ fontSize: 24, color: "#B2B2B2" }} />
                    </InputAdornment>
                ),
            }}
        />

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
            {...other}
        >
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
        'aria-controls': `nav-tabpanel-${index}`,
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
        paddingRight:"0",
        paddingLight:"0",
        backgroundColor: theme.palette.background.paper,

    },
}));

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        test: null
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Approvals);