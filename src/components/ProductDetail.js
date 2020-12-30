import React, { Component } from 'react';
import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { Link } from "react-router-dom";
import PlaceholderImg from '../img/place-holder-lc.png';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import CalIcon from '@material-ui/icons/Today';
import MarkerIcon from '@material-ui/icons/RoomOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { baseUrl } from "../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import ImagesSlider from "./ImagesSlider";
import encodeUrl  from "encodeurl"
import { Tabs,Tab } from 'react-bootstrap';
import { withStyles } from "@material-ui/core/styles/index";
import ProductItemNew from './ProductItemNew'
import MatchItem from '../components/MatchItem'


class ProductDetail extends Component {

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


        var subProductIds = this.props.item.sub_products

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


        var siteKey = (this.props.item.site_id).replace("Site/","")

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
                    console.log("matchees error", error)
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
            
                    <>
                        <div className="container-fluid " style={{ padding: "0" }}>


                            <div className="row no-gutters  justify-content-center">

                                <div className="floating-back-icon" style={{ margin: "auto" }}>

                                    <NavigateBefore onClick={this.handleBack} style={{ fontSize: 32, color: "white" }} />
                                </div>

                                <div className="col-md-6 col-sm-12 col-xs-12 p-5">
                                    {this.props.item.artifacts.length > 0 ?
                                    <ImagesSlider images={this.props.item.artifacts} /> :
                                    <img className={"img-fluid"} src={PlaceholderImg} alt="" />}


                                </div>

                                <div className={"col-md-6 col-sm-12 col-xs-12 p-5"}>

                                    <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                                        <div className="col-12 mt-2">
                                            <h4 className={"blue-text text-heading"}>{this.props.item.product.name}
                                            </h4>

                                            {/*<p>Posted By <span className={"green-text"}>{this.props.item.org_id}</span></p>*/}
                                        </div>

                                        <div className="col-12">

                                            <div className="row">
                                                <div className="col-7">
                                                    <p>Sold By <span className={"green-text"}>@{this.props.item.org_id}</span></p>
                                                </div>

                                                <div className="col-3 green-text text-heading text-right">

                                                    {this.props.item.product.price ?<>"GBP "+ {this.props.item.product.price.value}</> : "Free"}

                                                </div>

                                            </div>

                                        </div>


                                    </div>


                                    <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                                        <div className="col-auto">
                                            <p style={{ fontSize: "16px" }} className={"text-bold text-blue "}>{this.props.item.product.description}
                                            </p>

                                        </div>

                                    </div>


                                </div>
                            </div>
                        </div>
                        <div className={"container "}>


                            <Tabs defaultActiveKey="product" id="uncontrolled-tab-example">
                                <Tab eventKey="product" title="Product Info">



                                    <div className="row  justify-content-start search-container  pb-4">

                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Category</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.product.category} ></p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.product.type}></p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.product.state}</p>
                                        </div>
                                    </div>

                                    <div className="row  justify-content-start search-container  pb-4">

                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Manufacturer</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.org_id} </p>
                                        </div>
                                    </div>



                                    <div className="row  justify-content-start search-container  pb-4">
                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Date Of Manufacturer</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1"> 01/01/2020</p>
                                        </div>
                                    </div>


                                    <div className="row  justify-content-start search-container  pb-4">

                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Available From</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{moment(this.props.item&&this.props.item.product.available_from_epoch_ms).format("DD MMM YYYY")} </p>
                                        </div>
                                    </div>


                                    <div className="row  justify-content-start search-container  pb-4">

                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Model Number</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item&&this.props.item.product.model} </p>


                                        </div>
                                    </div>

                                    <div className="row  justify-content-start search-container  pb-4">

                                        <div className={"col-auto"}>

                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Serial Number</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item&&this.props.item.product.serial} </p>

                                        </div>
                                    </div>


                                    <div className="row  justify-content-start search-container  pb-4 ">

                                        <div className={"col-auto"}>
                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Brand</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item&&this.props.item.product.brand} </p>


                                        </div>
                                    </div>


                                    <div className="row  justify-content-start search-container  pb-4 ">

                                        <div className={"col-auto"}>
                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">State</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.product.state} </p>
                                        </div>
                                    </div>

                                    <div className="row  justify-content-start search-container  mt-4 mb-5 ">
                                        <div className={"col-1"}>

                                            <CalIcon  style={{ fontSize: 24, color: "#a8a8a8" }} />
                                        </div>

                                        <div className={"col-auto"}>
                                            <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Available Until</p>
                                            <p style={{ fontSize: "18px" }} className="  mb-1"> {this.props.item && moment(this.props.item.product.expire_after_epoch_ms).format("DD MMM YYYY")}</p>
                                        </div>


                                    </div>

                                </Tab>
                                <Tab eventKey="profile" title="Subproducts">
                                    {this.state.subProducts.map((item)=>
                                        <ProductItemNew item={item}/>
                                    )}
                                </Tab>

                            </Tabs>


                            <div className="container  mt-4">
                                <div className="row">
                                </div>
                            </div>
                            <div className="container mt-4 mb-5 pb-5 ">
                                <div className="row no-gutters mb-5">
                                    <div className="col-12 mb-4">
                                        <h5 className="mb-1">About the seller</h5>
                                    </div>
                                    <div className="col-auto ">
                                        <figure className="avatar avatar-60 border-0">

                                        <span className={"word-user-sellor"}>
                                            {this.props.item&&this.props.item.org.name&&this.props.item.org.name.substr(0,2)}
                                       </span>

                                        </figure>
                                    </div>
                                    <div className="col pl-2 align-self-center">
                                        <div className="row no-gutters">
                                            <div className="col-12">
                                                <p style={{ fontSize: "18px" }} className=" ">{this.props.item.org_id}</p>
                                                {/*<p style={{ fontSize: "18px" }} className="">48 items listed | 4 cycles</p>*/}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>



                    </>
                  
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

function BottomAppBar(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <CssBaseline />

            <AppBar position="fixed" color="#ffffff" className={classes.appBar}>
                <Toolbar>
                    <div className="row  justify-content-center search-container " style={{ margin: "auto" }}>
                        <div className="col-auto">

                            <Link to={"/message-seller/" + props.slug} type="button" className=" mr-2 btn btn-link green-border-btn mt-2 mb-2 btn-blue">
                                Message Seller
                            </Link>

                        </div>
                        <div className="col-auto">

                            <Link to={"/make-offer/" + props.slug} type="button"
                                  className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                Make Offer

                            </Link>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        </React.Fragment>
    );


}






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
)(ProductDetail);
