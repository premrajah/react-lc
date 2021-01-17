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
import { baseUrl, frontEndUrl } from "../Util/Constants";
import axios from "axios/index";
import moment from "moment";
import ImagesSlider from "./ImagesSlider";
import encodeUrl  from "encodeurl"
import { Tabs,Tab } from 'react-bootstrap';
import { withStyles } from "@material-ui/core/styles/index";
import ProductItemNew from './ProductItemNew'
import MatchItem from '../components/MatchItem'
import jspdf from 'jspdf'
import QrCodeBg from '../img/qr-code-bg.png';
import SearchItem from '../views/loop-cycle/search-item'
import ResourceItem from '../views/create-search/ResourceItem'

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
            listingLinked:null,
            searches:[],
            productQrCode:null
        }


        this.getSubProducts=this.getSubProducts.bind(this)
        this.getMatches=this.getMatches.bind(this)
        this.getSearches = this.getSearches.bind(this)
        this.getListing = this.getListing.bind(this)
        this.getQrCode=this.getQrCode.bind(this)

    }


    handlePrintPdf = (productItem, productQRCode) => {

        const { _key, name} = productItem;
        if(!_key || !productQRCode) { return; }

        const pdf = new jspdf()
        pdf.setTextColor(39,36,92)
        pdf.text(name, 10, 30);

        pdf.setDrawColor(7, 173, 136)
        pdf.line(0, 40, 1000, 40)

        pdf.addImage(productQRCode, 'PNG', 20, 40, 80, 80)
        pdf.addImage(productQRCode, 'PNG', 100, 60, 40, 40)
        pdf.addImage(productQRCode, 'PNG', 150, 70, 20, 20)

        pdf.setDrawColor(7, 173, 136)
        pdf.line(0, 120, 1000, 120)

        pdf.setTextColor(39,36,92)
        pdf.textWithLink("Loopcycle.io", 10, 160, {url: 'https://loopcycle.io/'})

        pdf.save(`Loopcycle_QRCode_${name}_${_key}.pdf`)
    }



    getQrCode() {

        // this.productQrCode = baseUrl+"product/"+this.props.item.product._key+"/code?u=" + frontEndUrl + "product-cycle-detail";



        this.setState({

            productQrCode: baseUrl+"product/"+this.props.item.product._key+"/code?u=" + frontEndUrl + "product-cycle-detail"

        })
        console.log("qr code")
        console.log(this.state.productQrCode)

    }


    

    getListing() {


        // var siteKey = (this.props.item.site_id).replace("Site/","")

        axios.get(baseUrl + "listing/" +this.props.item.listing.replace("Listing/","") ,
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


        var searches = this.props.item.searches

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






    componentWillMount() {


        if (this.props.item.sub_products&&this.props.item.sub_products.length>0)
            this.getSubProducts()

    }

    componentDidMount() {


        this.getQrCode()


        if (this.props.item.listing){

            this.getListing()

        }



        if (this.props.item.searches.length>0){

            this.getSearches()

        }



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



                                            <div className={"col-12 pb-5 mb-5"}>


                                                <div className="row justify-content-start pb-3 pt-3 ">

                                                    <div className="col-12 ">
                                                        <h5 className={"text-bold blue-text"}>Cycle Code</h5>
                                                    </div>

                                                    <div className="col-12">
                                                        <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                                                            Scan the QR code below to view this product
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="row justify-content-center ">

                                                    <div className="col-12 pt-4 border-box">


                                                        <div className={"qr-code-container"}>

                                                            <img className={"qr-code-bg"} src={QrCodeBg} alt=""/>
                                                            <img className={"qr-code"} src={this.state.productQrCode} alt=""/>

                                                        </div>

                                                        <p className={"green-text"}>
                                                            <Link className={"mr-3"} to={"/product-cycle-detail/" + this.props.item.product._key}> View product
                                                                provenance</Link>
                                                            <Link onClick={() => this.handlePrintPdf(this.props.item.product, this.stage.productQrCode)}>Print PDF</Link>
                                                        </p>


                                                    </div>
                                                </div>


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


                                    <Tabs defaultActiveKey="productinfo" id="uncontrolled-tab-example">
                                        <Tab eventKey="productinfo" title="Product Info">

                                            <div className="row  justify-content-start search-container  pb-2">

                                                <div className={"col-auto"}>

                                                    <p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Category</p>
                                                    <p style={{ fontSize: "18px" }} className="  mb-1">{this.props.item.product.category}, {this.props.item.product.type}, {this.props.item.product.state} {this.props.item.product.volume} {this.props.item.product.units} </p>

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


                                            {/*<div className="row  justify-content-start search-container  pb-2">*/}

                                                {/*<div className={"col-auto"}>*/}

                                                    {/*<p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Available From</p>*/}
                                                    {/*<p style={{ fontSize: "18px" }} className="  mb-1">{moment(this.props.item&&this.props.item.product.available_from_epoch_ms).format("DD MMM YYYY")} </p>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}


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

                                            {/*<div className="row  justify-content-start search-container  mt-4 mb-5 ">*/}
                                                {/*/!*<div className={"col-1"}>*!/*/}

                                                    {/*/!*<CalIcon  style={{ fontSize: 24, color: "#a8a8a8" }} />*!/*/}
                                                {/*/!*</div>*!/*/}

                                                {/*<div className={"col-auto"}>*/}
                                                    {/*<p style={{ fontSize: "18px" }} className="text-mute text-bold text-blue mb-1">Available Until</p>*/}
                                                    {/*<p style={{ fontSize: "18px" }} className="  mb-1"> {this.props.item && moment(this.props.item.product.expire_after_epoch_ms).format("DD MMM YYYY")}</p>*/}
                                                {/*</div>*/}


                                            {/*</div>*/}

                                        </Tab>


                                        {this.state.subProducts.length>0 &&
                                        <Tab eventKey="subproducts" title="Subproducts">
                                            {this.state.subProducts.map((item)=>
                                                <ProductItemNew item={item}/>
                                            )}
                                        </Tab>}


                                        {this.state.searches.length > 0 &&
                                        <Tab eventKey="search" title="Searches">



                                            {this.state.searches.map((item) =>

                                                <SearchItem item={item}/>
                                            )}

                                        </Tab>}

                                        {this.state.listingLinked &&
                                        <Tab eventKey="listing" title="Listing">
                                            {this.state.listingLinked && <ResourceItem item={this.state.listingLinked}/>}
                                        </Tab>}






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
