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
            subProducts:[],
        }


        // this.slug = props.match.params.slug
        // this.search = props.match.params.search

        this.getResources = this.getResources.bind(this)
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


                    // this.getListing()
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


                    // this.getListing()
                    this.getSubProducts()


                },
                (error) => {
                    console.log("listing error", error)
                }
            );

    }


    componentWillMount() {


        if (this.props.item.sub_products&&this.props.item.sub_products.length>0)
            this.getSubProducts()

    }

    componentDidMount() {

        // this.getResources()

        // this.getMatches()

    }




    render() {

        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            
                    <>


                            <div className="row no-gutters  justify-content-center">




                                <div className="col-md-4 col-sm-12 col-xs-12 ">

                                    <div className="row stick-left-box  ">
                                        <div className="col-12 text-center ">
                                    {this.props.item.artifacts&&this.props.item.artifacts.length > 0 ?
                                    <ImagesSlider images={this.props.item.artifacts} /> :
                                    <img className={"img-fluid"} src={PlaceholderImg} alt="" />}

                                        </div>
                                    </div>

                                </div>

                                <div className={"col-md-8 col-sm-12 col-xs-12 pl-5"}>

                                    <div className="row justify-content-start pb-3  listing-row-border">

                                        <div className="col-12 mt-2">

                                            <h4 className={"blue-text text-heading"}>{this.props.item.product.name}
                                            </h4>

                                        </div>

                                        <div className="col-12">

                                            <div className="row">
                                                <div className="col-7">
                                                    <p>Sold By <span className={"green-text"}>@{this.props.item.org.name}</span></p>
                                                </div>



                                            </div>

                                        </div>


                                    </div>


                                    <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                                        <div className="col-auto">
                                            <p style={{ fontSize: "16px" }} className={"text-gray-light  "}>{this.props.item.product.description}
                                            </p>

                                        </div>

                                    </div>
                                    <div className="row justify-content-start pb-3 pt-3 ">

                                    <div className="col-12 mt-2">


                                    <Tabs defaultActiveKey="product" id="uncontrolled-tab-example">
                                        <Tab eventKey="product" title="Product Info">

                                            <div className="row  justify-content-start search-container  pb-2">

                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Category</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.product.category} > {this.props.item.product.type}> > {this.props.item.product.state} </p>
                                                    {/*<p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.product.type}></p>*/}
                                                    {/*<p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.product.state}</p>*/}
                                                </div>
                                            </div>

                                            <div className="row  justify-content-start search-container  pb-2">

                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Manufacturer</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.org_id} </p>
                                                </div>
                                            </div>



                                            <div className="row  justify-content-start search-container  pb-2">
                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Year Of Manufacturer</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1"> {this.props.item.product.year_of_making}</p>
                                                </div>
                                            </div>


                                            <div className="row  justify-content-start search-container  pb-2">

                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Available From</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{moment(this.props.item&&this.props.item.product.available_from_epoch_ms).format("DD MMM YYYY")} </p>
                                                </div>
                                            </div>


                                            <div className="row  justify-content-start search-container  pb-2">

                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Model Number</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item&&this.props.item.product.sku.model} </p>


                                                </div>
                                            </div>

                                            <div className="row  justify-content-start search-container  pb-2">

                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Serial Number</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item&&this.props.item.product.sku.serial} </p>

                                                </div>
                                            </div>


                                            <div className="row  justify-content-start search-container  pb-2 ">

                                                <div className={"col-auto"}>
                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Brand</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item&&this.props.item.product.sku.brand} </p>


                                                </div>
                                            </div>


                                            <div className="row  justify-content-start search-container  pb-2 ">

                                                <div className={"col-auto"}>
                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">State</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.product.state} </p>
                                                </div>
                                            </div>

                                            <div className="row  justify-content-start search-container  mt-4 mb-5 ">
                                                {/*<div className={"col-1"}>*/}

                                                    {/*<CalIcon  style={{ fontSize: 24, color: "#a8a8a8" }} />*/}
                                                {/*</div>*/}

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
