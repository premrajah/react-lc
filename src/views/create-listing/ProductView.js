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
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import ImagesSlider from "../../components/ImagesSlider";
import encodeUrl  from "encodeurl"
import { Tabs,Tab } from 'react-bootstrap';
import GrayLoop from '../../img/icons/gray-loop.png';
import { withStyles } from "@material-ui/core/styles/index";
import ProductItemNew from '../../components/ProductItemNew'
import ProductDetail from '../../components/ProductDetail'


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
            subProducts:[]
        }


        this.slug = props.match.params.slug
        this.search = props.match.params.search

        this.getResources = this.getResources.bind(this)
        this.getSite = this.getSite.bind(this)
        this.getSubProducts=this.getSubProducts.bind(this)
        this.getMatches=this.getMatches.bind(this)

    }



    getSubProducts() {


        var subProductIds = this.state.item.sub_products

        for (var i = 0; i < subProductIds.length; i++) {



            axios.get(baseUrl + "product/" + subProductIds[i]._key,
                {
                    headers: {
                        "Authorization": "Bearer " + this.props.userDetail.token
                    }
                }
            )
                .then((response) => {

                        var responseAll = response.data;
                        console.log("sub product response")
                        console.log(responseAll)


                        var subProducts = this.state.subProducts

                        subProducts.push(responseAll.data)

                        this.setState({

                            subProducts: subProducts
                        })




                    },
                    (error) => {
                        console.log("resource error", error)
                    }
                );

        }
    }




    getSite() {


        var siteKey = (this.state.item.site_id).replace("Site/","")

        axios.get(baseUrl + "site/" +siteKey ,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var response = response.data.data;
                    console.log("site response")
                    console.log(response)

                    this.setState({

                        site: response

                    })

                },
                (error) => {

                    // var status = error.response.status
                    console.log("site error")
                    console.log(error)

                }
            );

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

                    var response = response.data;
                    console.log("product detail")
                    console.log(response)

                    this.setState({

                        item: response.data
                    })


                    // this.getSite()
                    this.getSubProducts()


                },
                (error) => {
                    console.log("listing error", error)
                }
            );

    }

    getProduct() {


        axios.get(baseUrl + "product/" + encodeUrl(this.slug)+"/expand",
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var response = response.data;
                    console.log("product detail")
                    console.log(response)

                    this.setState({

                        item: response.data
                    })


                    // this.getSite()
                    this.getSubProducts()


                },
                (error) => {
                    console.log("listing error", error)
                }
            );

    }






    componentWillMount() {

    }

    componentDidMount() {

        this.getResources()

        // this.getMatches()

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
