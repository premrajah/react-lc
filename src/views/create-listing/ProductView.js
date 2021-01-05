import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { Link } from "react-router-dom";
// import MarkerIcon from '../../img/icons/marker.png';
// import CalIcon from '../../img/icons/calender-dgray.png';
import PlaceholderImg from '../../img/place-holder-lc.png';
import StateIcon from '../../img/icons/state.png';
import FabricatingImg from '../../img/components/Main_Fabricating_Station_1400.png';
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import CalIcon from '@material-ui/icons/Today';
import MarkerIcon from '@material-ui/icons/RoomOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { baseUrl, frontEndUrl } from "../../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import ImagesSlider from "../../components/ImagesSlider";
import encodeUrl  from "encodeurl"
import GrayLoop from '../../img/icons/gray-loop.png';
import { withStyles } from "@material-ui/core/styles/index";
import ProductItemNew from '../../components/ProductItemNew'
import ProductDetail from '../../components/ProductDetail'
import ResourceItem from '../create-search/ResourceItem'
import { Tabs,Tab } from 'react-bootstrap';
import SearchItem from '../loop-cycle/search-item'
import QrCodeBg from '../../img/qr-code-bg.png';



import MatchItem from '../../components/MatchItem'


class ProductView extends Component {

    slug;
    search;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp:false,
            subProducts:[],
            listingLinked:null,
            searches:[]

        }


        this.slug = props.match.params.slug
        this.search = props.match.params.search

        this.getResources = this.getResources.bind(this)
        this.getSearches = this.getSearches.bind(this)
        this.getListing = this.getListing.bind(this)
        this.getMatches=this.getMatches.bind(this)
        this.getQrCode=this.getQrCode.bind(this)

    }


    getQrCode() {

        this.productQrCode = baseUrl+"product/"+this.slug+"/code?u=" + frontEndUrl + "product-cycle-detail";

    }


    getListing() {


        // var siteKey = (this.props.item.site_id).replace("Site/","")

        axios.get(baseUrl + "listing/" +this.state.item.listing.replace("Listing/","") ,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseData = response.data.data;
                    console.log("product listing response")
                    console.log(responseData)

                    this.setState({

                        listingLinked: responseData

                    })

                },
                (error) => {

                    // var status = error.response.status
                    console.log("product listing error")
                    console.log(error)

                }
            );

    }


    getSearches() {


        var searches = this.state.item.searches

        for (var i = 0; i < searches.length; i++) {


            axios.get(baseUrl + "search/" + searches[i].replace("Search/", ""),
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseData = response.data.data;
                        console.log("product search response")
                        console.log(responseData)

                    var searches = this.state.searches

                    searches.push(responseData)

                        this.setState({

                            searches: searches

                        })

                    },
                    (error) => {

                        // var status = error.response.status
                        console.log("product search error")
                        console.log(error)

                    }
                );


        }

    }



    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
        this.props.history.go(+1)
    }



    getMatches() {


        axios.get(baseUrl + "match/listing/" + encodeUrl(this.slug),
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {


                    var response = response.data;

                    console.log("matches resource response")
                    console.log(response)


                    this.setState({

                        matches: response.data

                    })




                },
                (error) => {
                    console.log("matches error", error)
                }
            );

    }



    getResources() {


        axios.get(baseUrl + "product/" + encodeUrl(this.slug)+"/expand",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data;
                    console.log("product detail")
                    console.log(responseAll)

                    this.setState({

                        item: responseAll.data
                    })


                    if (responseAll.data.listing){

                        this.getListing()

                    }



                    if (responseAll.data.searches.length>0){

                        this.getSearches()

                    }





                },
                (error) => {
                    console.log("listing error", error)
                }
            );

    }








    componentWillMount() {

    }

    componentDidMount() {


        this.getQrCode()
        this.getResources()

    }




    render() {

        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <div>

                <Sidebar />
                <div className="accountpage">

                    <HeaderDark />


                    {this.state.item &&
                    <>

                        <ProductDetail  item={this.state.item} />

                    </>
                    }


                    <div className={"container pb-5 mb-5"}>


                        <div className="row justify-content-start pb-3 pt-3 ">

                            <div className="col-12">
                                <h5 className={"text-bold blue-text"}>Cycle Code</h5>
                            </div>

                            <div className="col-12">
                                <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                                    Scan the QR code below to view this product
                                </p>

                            </div>

                        </div>

                        <div className="row justify-content-start pb-3 pt-4 border-box">

                            <div className="col-12">

                                <div className={"qr-code-container"}>

                                    <img className={"qr-code-bg"} src={QrCodeBg} alt="" />
                                   <img className={"qr-code"} src={this.productQrCode} alt="" />

                                </div>

                                <p className={"green-text"}>  {this.state.item && <Link to={"/product-cycle-detail/" + this.state.item.product._key}> View product provenance</Link>}</p>



                            </div>
                        </div>


                    </div>

                    <div className={"container pb-5 mb-5"}>


                        <Tabs defaultActiveKey="product" id="uncontrolled-tab-example">

                            <Tab eventKey="product" title="Searches">


                                {this.state.searches.map((item) =>

                                    <SearchItem item={item} />

                                )}

                            </Tab>

                            <Tab eventKey="profile" title="Listing">
                                {this.state.listingLinked && <ResourceItem  item={this.state.listingLinked}/> }
                            </Tab>

                        </Tabs>



                    </div>



                </div>



            </div>
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
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
}));







const mapStateToProps = state => {
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

const mapDispachToProps = dispatch => {
    return {

        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ProductView);
