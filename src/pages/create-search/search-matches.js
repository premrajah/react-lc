import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import ResourceItem from "./ResourceItem";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from '@mui/lab/TabPanel';


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

        // this.slug = props.match.params.slug;

        this.getListingForSearch = this.getListingForSearch.bind(this);
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

                    var matches = [];

                    for (var i = 0; i < responseAll.length; i++) {
                        if (responseAll[i].listing.stage==="active") {
                            matches.push({listing: responseAll[i]});
                        }
                    }

                    this.setState({
                        listingsForSearch: matches,
                        // matches:matches
                    });
                },
                (error) => {}
            );
    }


    componentDidMount() {

        if (this.props.suggesstions&&this.props.suggesstions.length>0) {
            this.setState({
                // matches: this.props.suggesstions,
                listingsForSearch: this.props.suggesstions
            });
        }else{

            this.setState({
                // matches: this.props.suggesstions,
                listingsForSearch: []
            });
        }

        if (this.props.slug){
            this.slug=this.props.slug

            this.setActiveKey(null,"1")

        }

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props) {

            if (this.props.suggesstions&&this.props.suggesstions.length>0) {
                this.setState({
                    // matches: this.props.suggesstions,
                    listingsForSearch: this.props.suggesstions
                });

            }else{
                this.setState({
                listingsForSearch: []

                });
            }
            this.slug=this.props.slug
            this.setActiveKey(null,"1")
            // this.loadMatches();
            // this.getListingForSearch();


        }
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

                <div className="container ">
                    <div className="row justify-content-start pb-3  tabs-detail">
                        <div className="col-12 ">
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={this.state.activeKey}>
                                    <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                        <TabList
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            allowScrollButtonsMobile
                                            TabIndicatorProps={{
                                                style: {
                                                    backgroundColor: "#27245C",
                                                    padding: '2px',
                                                    color:"#27245C"
                                                }
                                            }}
                                            onChange={this.setActiveKey} >

                                            <Tab label="Suggested" value="1"/>

                                            {!this.props.hideConfirmed &&
                                            <Tab label="Confirmed" value="2" />}


                                        </TabList>
                                    </Box>


                                    <TabPanel value="1">
                                        <div className="row mt-3">
                                            <div className="col-12 ">
                                        {this.state.listingsForSearch.length===0&&
                                        <div className="row text-center">
                                            <div className={"col-12 pt-4"}>
                                                No results founds</div> </div>
                                        }
                                        {this.state.listingsForSearch.map((item) => (
                                            <>
                                                {/*<Link to={"/match/"+props.slug+"/"+item.listing.listing._key }>*/}
                                                <ResourceItem
                                                    showDetails={this.props.showDetails}
                                                    requestMatch={this.props.requestMatch}
                                                    fromSearch
                                                    smallImage
                                                    history={this.props.history}
                                                    disableLink
                                                    searchId={this.slug}
                                                    item={item}
                                                    hideMoreMenu
                                                />

                                                {/* </Link>*/}
                                            </>
                                        ))}
                                        </div>
                                        </div>
                                    </TabPanel>
                                    {!this.props.hideConfirmed &&  <TabPanel value="2">
                                        <div className="row mt-3">
                                            <div className="col-12 ">
                                        {this.state.matches.length===0&&
                                        <div className="row text-center">
                                            <div className={"col-12 pt-4"}>
                                            No results founds</div> </div>
                                        }
                                        {this.state.matches.map((item) => (
                                            <>
                                                {/*<Link to={"/matched/" + item.match._key}>*/}
                                                {/*    <MatchItem item={item} />*/}
                                                {/*</Link>*/}


                                                <ResourceItem
                                                    hideCategory
                                                    showDetails={this.props.showDetails}
                                                    smallImage
                                                    matchedItem
                                                    stage={item.match.stage}
                                                    history={this.props.history}
                                                    disableLink
                                                    searchId={this.slug}
                                                    item={item.listing}
                                                    hideMoreMenu
                                                    onClick={()=> this.props.requestMatch(this.props.item.listing)}
                                                />


                                            </>
                                        ))}
                                            </div>
                                        </div>

                                    </TabPanel>}
                                </TabContext>
                            </Box>

                        </div>
                    </div>

                </div>

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
