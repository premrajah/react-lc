import React, { Component } from 'react';
import { connect } from "react-redux";
import Paper from '../../img/paper.png';
import clsx from 'clsx';
import FilterImg from '../../img/icons/filter-icon.png';
import BuildingIcon from '../../img/icons/building-icon.png';
import { Link } from "react-router-dom";
import LangIcon from '../../img/icons/lang.png';
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import HandGreyIcon from '../../img/icons/hand-gray.png';
import EditGray from '../../img/icons/edit-gray.png';
import RingGray from '../../img/icons/ring-gray.png';
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchGray from '@material-ui/icons/Search';
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";


class CompanyPage extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }


        this.getResources = this.getResources.bind(this)

    }




    getResources() {




        axios.get(baseUrl + "resource",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {
                var response = response.data;




            },
                (error) => {
                    var status = error.response.status








                }
            );

    }






    interval


    componentWillMount() {

    }

    componentDidMount() {



    }

    intervalJasmineAnim





    render() {

        return (
            <div>

                <Sidebar />
                <div className="wrapper accountpage">
                    <HeaderDark />
                    <div className="container ">



                        <div className="row mb-5 container-blue justify-content-center company-header">

                            <div className="col-11  justify-content-center">
                                <div className="figure-profile account-figure shadow ">

                                    <figure>
                                        <Link to={"/company"}><img src={BuildingIcon} alt="" /></Link>
                                    </figure>

                                </div>
                            </div>
                        </div>

                        <div className="row mb-5 justify-content-center company-details">

                            <div className="col-10 mt-4  justify-content-start">

                                <h5 className={"text-blue text-bold"}>Company A</h5>
                                <p className={" text-mute small"}>Joined in 2010<br />
                                    Surrey, UK</p>

                            </div>

                            <div className="col-6   justify-content-center d-none">

                                <div className="figure-profile account-figure shadow ">

                                    <figure>
                                        <Link to={"/company"}><img src={BuildingIcon} alt="" /></Link>
                                    </figure>

                                </div>

                                <p className={"text-blue text-underline text-upload"}>

                                    Upload Photo

                                </p>

                            </div>
                        </div>



                    </div>
                    <div className={"tab-content-listing"}>

                        <NavTabs col />
                    </div>


                </div>



            </div>
        );
    }
}





const mapStateToProps = state => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        // loading: state.loading,
        // isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        // userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter




    };
};




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
            <AppBar position="static">
                <Tabs
                    style={{ backgroundColor: "#ffffff", color: "#07AD88!important" }}
                    indicatorColor="secondary"
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                >
                    <LinkTab label="Listings" href="/drafts" {...a11yProps(0)} />
                    <LinkTab label="Cycles" href="/trash" {...a11yProps(1)} />
                    <LinkTab label="About" href="/spam" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>

                <div className={"container"}>

                    <div className="row  justify-content-center search-container listing-row-border pb-4">
                        <div className={"col-12"}>

                            <TextField
                                label={"Search this seller’s listings"}
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
                        </div>
                    </div>

                    <div className="row  justify-content-center filter-row listing-row-border  mb-4 pt-4 pb-4">

                        <div className="col">
                            <p style={{ fontSize: "18px" }} className="text-mute mb-1">5 out of 5 Listings </p>

                        </div>
                        <div className="text-mute col-auto pl-0">

                            <span style={{ fontSize: "18px" }}>Filter</span>   <img src={FilterImg} className={"filter-icon"} alt="" />

                        </div>

                    </div>

                    <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">

                        <div className={"col-4"}>

                            <img className={"img-fluid"} src={Paper} alt="" />
                        </div>
                        <div className={"col-6 pl-3 content-box-listing"}>
                            <p style={{ fontSize: "18px" }} className=" mb-1">Paper and Card</p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">Loose / 14 kg</p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">@Tescos</p>
                        </div>
                        <div style={{ textAlign: "right" }} className={"col-2"}>
                            <p className={"green-text"}>£12</p>
                        </div>
                    </div>

                    <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">

                        <div className={"col-4"}>

                            <img className={"img-fluid"} src={Paper} alt="" />
                        </div>
                        <div className={"col-6 pl-3 content-box-listing"}>
                            <p style={{ fontSize: "18px" }} className=" mb-1">Metal</p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">Loose / 14 kg</p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">@Tescos</p>
                        </div>
                        <div style={{ textAlign: "right" }} className={"col-2"}>
                            <p className={"green-text"}>Free</p>
                        </div>
                    </div>

                </div>




            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className={"container"}>

                    <div className="row  justify-content-center search-container listing-row-border pb-4">
                        <div className={"col-12"}>

                            <TextField
                                label={"Search this seller’s Cycles"}
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
                        </div>
                    </div>

                    <div className="row  justify-content-center filter-row listing-row-border  mb-4 pt-4 pb-4">

                        <div className="col">
                            <p style={{ fontSize: "18px" }} className="text-mute mb-1">Cycles</p>

                        </div>
                        {/*<div className="text-mute col-auto pl-0">*/}

                        {/*<span style={{fontSize:"18px"}}>Filter</span>   <img src={FilterImg} className={"filter-icon"}  />*/}

                        {/*</div>*/}

                    </div>

                    <div className="row no-gutters justify-content-start mt-4 mb-4 listing-row-border pb-4">

                        {/*<div className={"col-4"}>*/}

                        {/*<img className={"img-fluid"} src={Paper}/>*/}
                        {/*</div>*/}
                        <div className={"col-11 content-box-listing"}>
                            <p style={{ fontSize: "18px" }} className=" mb-1">Tesco   →  Company B</p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">Paper and Cardboard</p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">bailed / 10 kg</p>
                        </div>
                        <div style={{ textAlign: "right" }} className={"col-1"}>
                            <p className={"gray-text"}><NavigateNextIcon /></p>
                        </div>
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

                            <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Surrey, UK</p>
                        </div>
                    </div>

                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={CalenderIcon} alt="" />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Joined in Jan 10, 2020
                            </p>
                        </div>
                    </div>
                    <div className="row  justify-content-start search-container listing-row-border pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={LangIcon} alt="" />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{ fontSize: "18px" }} className="forgot-password-link text-mute text-gray-light mb-1">www.tesco.co.uk</p>
                        </div>
                    </div>
                    <div className="row  justify-content-start filter-row listing-row-border  mb-4 pt-5 pb-5">

                        <div className={"col-1"}>
                            <img className={"icon-about"} src={EditGray} alt="" />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{ fontSize: "18px" }} className=" text-mute text-gray-light mb-1">Description</p>
                        </div>

                    </div>

                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={HandGreyIcon} alt="" />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{ fontSize: "18px" }} className=" text-mute text-gray-light mb-1">5 Listings</p>
                        </div>
                    </div>
                    <div className="row  justify-content-start search-container  pb-4">
                        <div className={"col-1"}>
                            <img className={"icon-about"} src={RingGray} alt="" />
                        </div>
                        <div className={"col-auto"}>

                            <p style={{ fontSize: "18px" }} className=" text-mute text-gray-light mb-1">Cycles</p>
                        </div>
                    </div>

                </div>
            </TabPanel>
        </div>
    );
}




const mapDispachToProps = dispatch => {
    return {





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(CompanyPage);
