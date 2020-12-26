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

import ProImg from '../../img/img-product.png';


class SubProductView extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            subProducts: []
        }


        // this.slug = props.match.params.slug

        this.getResources = this.getResources.bind(this)
        this.setProduct = this.setProduct.bind(this)
        this.getSite = this.getSite.bind(this)
        this.showProductSelection=this.showProductSelection.bind(this)


    }

    showProductSelection() {




        this.props.showProductPopUp({type:"create_sub_product",show:true})


    }


    getSite() {

        axios.get(baseUrl + "site/" + this.state.item.site_id,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var response = response.data.content;
                    console.log("resource response")
                    console.log(response)

                    this.setState({

                        site: response

                    })

                },
                (error) => {

                    var status = error.response.status
                    console.log("resource error")
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


    setProduct(){


        // this.setState({
        //
        //     item: this.props.product
        // })


        this.getResources(this.props.product)
    }

    getResources(productId) {


        axios.get(baseUrl + "product/" + productId,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data;
                    console.log("detail resource response")
                    console.log(responseAll)


                    this.setState({

                        item: responseAll.data
                    })


                    // this.getSite()


                    if (responseAll.data.sub_product_ids.length > 0) {
                        this.getSubProducts()
                    }

                },
                (error) => {
                    console.log("resource error", error)
                }
            );

    }


    getSubProducts() {


        var subProductIds = this.state.item.sub_product_ids

        for (var i = 0; i < subProductIds.length; i++) {



        axios.get(baseUrl + "product/" + subProductIds[i].replace('Product/',''),
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                    var responseAll = response.data;
                    console.log("detail resource response")
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

    
    
    
    componentWillMount() {

    }

    componentDidMount() {

        this.setProduct()

    }




    render() {

        return (
            <div>
                {this.state.item &&
                    <>
                        <div className="container-fluid " style={{ padding: "0" }}>



                            <div className="row no-gutters  justify-content-center">

                                <div className="floating-back-icon" style={{ margin: "auto" }}>

                                    <NavigateBefore onClick={this.handleBack} style={{ fontSize: 32, color: "white" }} />
                                </div>


                                <div className="col-12">
                                    <h3 className={"blue-text text-heading"}>Products Details
                                    </h3>

                                </div>

                                <div className="col-md-6 col-sm-12 col-xs-12 p-5">
                                    <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                                </div>

                                <div className={"col-md-6 col-sm-12 col-xs-12 p-5"}>

                                    <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                                        <div className="col-12 mt-2">
                                            <h4 className={"blue-text text-heading"}>{this.state.item.product.name}
                                            </h4>

                                            {/*<p>Posted By <span className={"green-text"}>{this.state.item.org_id}</span></p>*/}
                                        </div>

                                        <div className="col-12">

                                            <div className="row">
                                                <div className="col-7">
                                                    <p>Sold By <span className={"green-text"}>@
                                                        {/*{this.state.item.org_id}*/}
                                                        </span></p>
                                                </div>

                                                <div className="col-3 green-text text-heading text-right">

                                                    {/*{this.state.item.price ?<>{this.state.item.price.currency} {this.state.item.price.value}</> : "Free"}*/}

                                                </div>

                                            </div>

                                        </div>


                                    </div>


                                    <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                                        <div className="col-auto">
                                            <p style={{ fontSize: "16px" }} className={"text-bold text-blue "}>{this.state.item.description}
                                            </p>

                                        </div>

                                    </div>


                                </div>
                            </div>
                        </div>


                        <div className="col-12">
                            <h3 className={"blue-text text-heading"}>Sub Products
                            </h3>

                        </div>



                        <div className={"container "}>

                            <div className="row no-gutters  justify-content-center">

                                <p style={{ margin: "10px 0" }} className={"green-text forgot-password-link text-mute small"}>


                                    <span onClick={this.showProductSelection} >Add Sub Product  </span>

                                </p>



                            </div>





                </div>



                        {this.state.subProducts.length>0 &&

                        <>


                            {this.state.subProducts.map((item)=>

                                <>

                                    <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">


                                        <div className={"col-2"}>

                                            <img className={"img-fluid"} src={PlaceholderImg} alt="" />

                                        </div>
                                        <div className={"col-8 pl-3 content-box-listing"}>

                                            <p style={{ fontSize: "18px" }} className=" mb-1">{item.product.name}</p>
                                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">{item.product.state} / {item.product.volume} {item.product.units}</p>
                                            {/*<p style={{ fontSize: "16px" }} className="text-mute mb-1">@{this.props.item.tags}</p>*/}

                                        </div>
                                        <div style={{ textAlign: "right" }} className={"col-2"}>
                                            <p className={"green-text"}>

                                                {/*{this.props.item.price ? <>{this.props.item.price.currency} {this.props.item.price.value}</> : "Free"}*/}

                                            </p>


                                        </div>



                                    </div>

                                </>

                            )}
                        </>
                        }

                  </>}

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
        // product:state.product,
        parentProduct:state.parentProduct,
        showProductPopUp:state.parentProduct,


    };
};

const mapDispachToProps = dispatch => {
    return {

        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),

    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(SubProductView);
