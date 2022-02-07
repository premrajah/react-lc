import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import { withStyles } from "@mui/styles/index";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import ResourceItem from "./ResourceItem";
import HeaderDark from "../../views/header/HeaderDark";
import Sidebar from "../../views/menu/Sidebar";
import { Link } from "react-router-dom";
import MatchItem from "../../components/MatchItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import InfoTabContent from "../../components/Sites/InfoTabContent";
import SubSitesTab from "../../components/Sites/SubSitesTab";
import SubProductsTab from "../../components/Sites/SubProductsTab";
import TabPanel from '@mui/lab/TabPanel';
const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));


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


class SearchMatches extends Component {
    slug;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
            categories: [],
            subCategories: [],
            catSelected: {},
            subCatSelected: {},
            stateSelected: null,
            states: [],
            page: 1,
            fields: {},
            errors: {},
            units: [],
            progressBar: 33,
            products: [],
            productSelected: null,
            nextBlue: false,
            nextBlueAddDetail: false,
            nextBlueViewSearch: false,
            unitSelected: null,
            volumeSelected: null,
            title: null,
            description: null,
            volume: null,
            createSearchData: null,
            matches: [],
            listingsForSearch: [],
        };

        this.slug = props.match.params.slug;

        this.loadMatches = this.loadMatches.bind(this);
        this.getListingForSearch = this.getListingForSearch.bind(this);
    }

        loadMatches() {
        axios
            .get(baseUrl + "match/search/" + this.slug, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        matches: responseAll,
                    });
                },
                (error) => {}
            );
    }

    getListingForSearch() {
        axios
            .get(baseUrl + "search/" + this.slug + "/listing", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    var matches = this.state.listingsForSearch;

                    for (var i = 0; i < responseAll.length; i++) {
                        matches.push({ listing: responseAll[i] });
                    }

                    this.setState({
                        listingsForSearch: matches,
                    });
                },
                (error) => {}
            );
    }


    componentDidMount() {
        this.setActiveKey(null,"1")
        this.loadMatches();
        this.getListingForSearch();
    }

    goToSignIn() {
        this.setState({
            active: 0,
        });
    }

    goToSignUp() {
        this.setState({
            active: 1,
        });
    }

    setActiveKey=(event,key)=>{

        this.setState({
            activeKey:key
        })


    }


    render() {


        return (
            <Layout>

                <div className="container  pb-4 pt-4">
                    <PageHeader pageTitle="Matches"
                                subTitle="Your search matches" />

                    <div className="row justify-content-start pb-3  tabs-detail">
                        <div className="col-12 mt-2">
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
                                            onChange={this.setActiveKey} >

                                            <Tab label="Suggested" value="1"/>

                                            <Tab label="Confirmed" value="2" />


                                        </TabList>
                                    </Box>


                                    <TabPanel value="1">

                                        {this.state.listingsForSearch.length==0&&
                                        <div className="row text-center">
                                            <div className={"col-12 pt-4"}>
                                                No results founds</div> </div>
                                        }
                                        {this.state.listingsForSearch.map((item) => (
                                            <>
                                                {/*<Link to={"/match/"+props.slug+"/"+item.listing.listing._key }>*/}

                                                <ResourceItem
                                                    history={this.props.history}
                                                    link={"/match/" + this.slug + "/" + item.listing.listing._key}
                                                    searchId={this.slug}
                                                    item={item}
                                                />

                                                {/* </Link>*/}
                                            </>
                                        ))}

                                    </TabPanel>
                                    <TabPanel value="2">
                                        {this.state.matches.length==0&&
                                        <div className="row text-center">
                                            <div className={"col-12 pt-4"}>
                                            No results founds</div> </div>
                                        }
                                        {this.state.matches.map((item) => (
                                            <>
                                                <Link to={"/matched/" + item.match._key}>
                                                    <MatchItem item={item} />
                                                </Link>
                                            </>
                                        ))}

                                    </TabPanel>




                                </TabContext>
                            </Box>

                        </div>
                    </div>
                    {/*<div className="row ">*/}
                    {/*    <div className={"tab-content-listing col-12"}>*/}
                    {/*        <NavTabs*/}
                    {/*            history={this.props.history}*/}
                    {/*            matches={this.state.matches}*/}
                    {/*            slug={this.slug}*/}
                    {/*            suggesstions={this.state.listingsForSearch}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </Layout>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SearchMatches);
