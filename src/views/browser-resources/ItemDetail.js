import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { Link } from "react-router-dom";
import MarkerIcon from '../../img/icons/marker.png';
import StateIcon from '../../img/icons/state.png';
import FabricatingImg from '../../img/components/Main_Fabricating_Station_1400.png';
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import NavigateBefore from '@material-ui/icons/NavigateBefore';



import { makeStyles } from '@material-ui/core/styles';

import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";

class ItemDetail extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: {}
        }

        this.slug = props.match.params.slug

        this.getResources = this.getResources.bind(this)
        this.getSite = this.getSite.bind(this)

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



    getResources() {


        axios.get(baseUrl + "resource/" + this.slug,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                var response = response.data;
                console.log("detail resource response")
                console.log(response)


                this.setState({

                    item: response.content
                })


                this.getSite()

            },
                (error) => {
                    console.log("resource error", error)
                }
            );

    }



    componentWillMount() {

    }

    componentDidMount() {

        this.getResources()

    }

    intervalJasmineAnim



    render() {

        return (
            <div>

                <Sidebar />
                <div className="accountpage">

                    <HeaderDark />
                    <div className="container-fluid " style={{ padding: "0" }}>


                        <div className="row no-gutters  justify-content-center">

                            <div className="floating-back-icon" style={{ margin: "auto" }}>

                                <NavigateBefore onClick={this.handleBack} style={{ fontSize: 32, color: "white" }} />
                            </div>


                            <div className="col-auto ">
                                <img className={"img-fluid"} src={FabricatingImg} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="container ">
                        <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                            <div className="col-12">

                                <div className="row">
                                    <div className="col-7">
                                        <p className={"green-text text-heading"}>@{this.state.item.tags}
                                        </p>
                                    </div>

                                    <div className="col-3 green-text text-heading text-right">
                                        {this.state.item.price ? <>{this.state.item.price.currency} {this.state.item.price.value}</> : "Free"}

                                    </div>

                                </div>

                            </div>
                            <div className="col-12 mt-2">
                                <h5 className={"blue-text text-heading"}>{this.state.item.name}
                                </h5>

                                <p>Sold By <span className={"green-text"}>{this.state.item.org_id}</span></p>
                            </div>
                        </div>


                        <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                            <div className="col-auto">
                                <p style={{ fontSize: "16px" }} className={"text-gray-light "}>{this.state.item.description}
                                </p>

                            </div>

                        </div>

                        <div className="row justify-content-start pb-4 pt-3 ">
                            <div className="col-auto">
                                <h6 className={""}>Product Info</h6>
                            </div>
                        </div>

                    </div>
                    <div className={"container"}>

                        <div className="row  justify-content-start search-container  pb-4">
                            {/*<div className={"col-1"}>*/}
                            {/*<img className={"icon-about"} src={ListIcon} alt=""/>*/}
                            {/*</div>*/}
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Category</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.category} ></p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.type}</p>
                            </div>
                        </div>

                        <div className="row  justify-content-start search-container  pb-4">
                            {/*<div className={"col-1"}>*/}
                            {/*<img className={"icon-about"} src={ListIcon} alt=""/>*/}
                            {/*</div>*/}
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Manufacturer</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.org_id} </p>
                            </div>
                        </div>



                        <div className="row  justify-content-start search-container  pb-4">
                            {/*<div className={"col-1"}>*/}
                            {/*<img className={"icon-about"} src={ListIcon} alt=""/>*/}
                            {/*</div>*/}
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Date Of Manufacturer</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1"> 01/01/2020</p>
                            </div>
                        </div>




                        <div className="row  justify-content-start search-container  pb-4">
                            {/*<div className={"col-1"}>*/}
                            {/*<img className={"icon-about"} src={ListIcon} alt=""/>*/}
                            {/*</div>*/}
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Model Number</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">ECF1212 </p>
                            </div>
                        </div>

                        <div className="row  justify-content-start search-container  pb-4">
                            {/*<div className={"col-1"}>*/}
                            {/*<img className={"icon-about"} src={ListIcon} alt=""/>*/}
                            {/*</div>*/}
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Serial Number</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">1245780 </p>
                            </div>
                        </div>


                        {/*<div className="row  justify-content-start search-container  pb-4">*/}
                        {/*<div className={"col-1"}>*/}
                        {/*<img className={"icon-about"} src={AmountIcon} alt=""/>*/}
                        {/*</div>*/}
                        {/*<div className={"col-auto"}>*/}

                        {/*<p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Amount</p>*/}
                        {/*<p style={{fontSize:"18px"}} className="  mb-1"> {this.state.item.volume} {this.state.item.units}</p>*/}
                        {/*</div>*/}
                        {/*</div>*/}


                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={StateIcon} alt="" />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">State</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.state} </p>
                            </div>
                        </div>

                        {/*<div className="row  justify-content-start search-container  pb-4">*/}
                        {/*<div className={"col-1"}>*/}
                        {/*<img className={"icon-about"} src={CalenderIcon} alt=""/>*/}
                        {/*</div>*/}
                        {/*<div className={"col-auto"}>*/}

                        {/*<p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Required by </p>*/}
                        {/*<p style={{fontSize:"18px"}} className="  mb-1">*/}
                        {/*<Moment   unix  >*/}
                        {/*{this.state.item.availableFrom}*/}
                        {/*</Moment>*/}
                        {/*</p>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={MarkerIcon} alt="" />
                            </div>
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Delivery From</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.site && this.state.site.name}</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.site && this.state.site.address}</p>
                            </div>
                        </div>

                        <div className="container container-divider">
                            <div className="row">
                            </div>
                        </div>
                        <div className="container mt-4 mb-5 pb-5 ">

                            <div className="row no-gutters mb-5">
                                <div className="col-12 mb-4">
                                    <h5 className="mb-1">About the seller  </h5>
                                </div>
                                <div className="col-auto ">
                                    <figure className="avatar avatar-60 border-0">


                                        {/*<span className={"word-user-sellor"}>M</span>*/}

                                        {/*{this.state.item&&this.state.item.org_id&&this.state.item.org_id.substr(0,2)}*/}

                                        <span className={"word-user-sellor"}>

                                       {this.state.item&&this.state.item.org_id&&this.state.item.org_id.substr(0,2)}



                                </span>



                                    </figure>
                                </div>
                                <div className="col pl-2 align-self-center">
                                    <div className="row no-gutters">
                                        <div className="col-12">


                                            <p style={{ fontSize: "18px" }} className=" ">{this.state.item.org_id}</p>
                                            <p style={{ fontSize: "18px" }} className="">48 items listed | 4 cycles</p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {this.state.item.id && (this.props.userDetail.orgId !== this.state.item.org_id) &&
                            <BottomAppBar slug={this.slug} />

                        }


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
)(ItemDetail);
