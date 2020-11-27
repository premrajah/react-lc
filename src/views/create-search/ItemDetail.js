import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import GrayLoop from '../../img/icons/gray-loop.png';
import { Link } from "react-router-dom";
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import ListIcon from '../../img/icons/list.png';
import AmountIcon from '../../img/icons/amount.png';
import StateIcon from '../../img/icons/state.png';
import PaperImg from '../../img/paper-big.png';
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import { Modal, ModalBody } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import Moment from 'react-moment';
import { withStyles } from "@material-ui/core/styles/index";
import moment from "moment/moment";


class ItemDetail extends Component {

    slug;
    searchId

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp: false,
            loopError: null,
            site : null,
            showBottom : true,
        }

        this.slug = props.match.params.slug
        this.searchId = props.match.params.search

        this.getResources = this.getResources.bind(this)
        this.acceptMatch = this.acceptMatch.bind(this)
        this.declineMatch = this.declineMatch.bind(this)
        this.showPopUp = this.showPopUp.bind(this)
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

    showPopUp() {

        this.setState({
            showPopUp: !this.state.showPopUp
        })

    }


    declineMatch() {


    }


    acceptMatch() {


        console.log("create loop")


        axios.post(baseUrl + "search/convert/" + this.searchId + "/resource/" + this.slug,
            {}, {
            headers: {
                "Authorization": "Bearer " + this.props.userDetail.token
            }
        }
        )
            .then(res => {


                console.log(res.data.content)

                this.setState({

                    showPopUp: true
                })


                this.getResources()


            }).catch(error => {



                // console.log("loop convert error found ")
                console.log(error.response.data)


                this.setState({

                    showPopUp: true,
                    loopError: error.response.data.content.message
                })

            });


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

                    var status = error.response.status

                    console.log("resource error")

                    console.log(error)


                }
            );

    }



    componentWillMount() {

    }

    componentDidMount() {

        this.getResources()

        // alert(this.searchId)

    }





    render() {

        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <div>

                <Sidebar />
                <HeaderDark />
                {this.state.item && <div className="accountpage">

                    <div className="container-fluid " style={{ padding: "0" }}>


                        <div className="row no-gutters  justify-content-center">

                            <div className="floating-back-icon" style={{ margin: "auto" }}>

                                <NavigateBefore onClick={this.handleBack} style={{ fontSize: 32, color: "white" }}/>
                            </div>


                            <div className="col-auto ">

                                {this.state.item.images && this.state.item.images.length > 0 ?
                                    <img className={"resource-item-big img-fluid"} src={this.state.item.images[0]}
                                         alt=""/> : <img className={"img-fluid"} src={PaperImg} alt=""/>}


                                {/*<img className={"img-fluid"}  src={PaperImg} alt=""/>*/}

                            </div>
                        </div>
                    </div>
                    <div className="container ">
                        <div className="row justify-content-start pb-3 pt-4 listing-row-border">

                            <div className="col-12">
                                <p className={"green-text text-heading"}>@{this.state.item.tags}
                                </p>

                            </div>
                            <div className="col-12 mt-2">
                                <h5 className={"blue-text text-heading"}>{this.state.item.name}
                                </h5>
                            </div>
                        </div>


                        <div className="row justify-content-start pb-3 pt-3 listing-row-border">

                            <div className="col-auto">
                                <p style={{ fontSize: "16px" }}
                                   className={"text-gray-light "}>{this.state.item.description}
                                </p>

                            </div>

                        </div>

                        <div className="row justify-content-start pb-4 pt-3 ">
                            <div className="col-auto">
                                <h6 className={""}>Item Details
                                </h6>

                            </div>
                        </div>

                    </div>
                    <div className={"container"}>

                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={ListIcon} alt=""/>
                            </div>
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Category</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.category} ></p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.type}</p>
                            </div>
                        </div>
                        {/*<div className="row  justify-content-start search-container  pb-4">*/}
                            {/*<div className={"col-1"}>*/}
                                {/*<img className={"icon-about"} src={AmountIcon} alt=""/>*/}
                            {/*</div>*/}
                            {/*<div className={"col-auto"}>*/}

                                {/*<p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Amount</p>*/}
                                {/*<p style={{ fontSize: "18px" }}*/}
                                   {/*className="  mb-1"> {this.state.item.volume} {this.state.item.units}</p>*/}
                            {/*</div>*/}
                        {/*</div>*/}


                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={StateIcon} alt=""/>
                            </div>
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">State</p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.state} </p>
                            </div>
                        </div>


                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={CalenderIcon} alt=""/>
                            </div>
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Required
                                    From </p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">

                                    {moment(this.state.item.availableFrom.value).format("DD MMM YYYY")}
                                </p>
                            </div>
                        </div>

                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={CalenderIcon} alt=""/>
                            </div>
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Required
                                    by </p>
                                <p style={{ fontSize: "18px" }} className="  mb-1">

                                    {moment(this.state.item.expiry.value).format("DD MMM YYYY")}
                                </p>
                            </div>
                        </div>
                        <div className="row  justify-content-start search-container  pb-4">
                            <div className={"col-1"}>
                                <img className={"icon-about"} src={MarkerIcon} alt=""/>
                            </div>
                            <div className={"col-auto"}>

                                <p style={{ fontSize: "18px" }} className="text-mute text-gray-light mb-1">Delivery
                                    From</p>
                                {/*<p style={{ fontSize: "18px" }} className="  mb-1">Mapledown, Which Hill Lane,</p>*/}
                                {/*<p style={{ fontSize: "18px" }} className="  mb-1">Woking, Surrey, GU22 0AH</p>*/}


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
                                    <h5 className="mb-1">About the seller </h5>
                                </div>
                                <div className="col-auto ">
                                    <figure className="avatar avatar-60 border-0">


                                        <span className={"word-user-sellor"}>

                                       {this.state.item && this.state.item.org_id && this.state.item.org_id.substr(0, 2)}



                                </span>

                                    </figure>
                                </div>
                                <div className="col pl-2 align-self-center">
                                    <div className="row no-gutters">
                                        <div className="col-12">


                                            <p style={{ fontSize: "18px" }} className=" ">Seller Company</p>
                                            <p style={{ fontSize: "18px" }} className="">48 items listed | 4 cycles</p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {this.state.item.stage == "matched" && this.state.item.org_id != this.props.userDetail.orgId &&
                        <React.Fragment>

                            <CssBaseline/>

                            <AppBar position="fixed" color="#ffffff"
                                    className={classesBottom.appBar + "  custom-bottom-appbar"}>
                                <Toolbar>
                                    <div className="row  justify-content-center search-container "
                                         style={{ margin: "auto" }}>

                                        {/*<div className="col-auto">*/}
                                        {/*<button onClick={this.declineMatch} type="button"*/}
                                        {/*className="shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue">*/}
                                        {/*Decline Match*/}

                                        {/*</button>*/}
                                        {/*</div>*/}
                                        <div className="col-auto">
                                            <button onClick={this.acceptMatch} type="button"
                                                    className="shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue">
                                                Create Cycle

                                            </button>
                                        </div>
                                    </div>
                                </Toolbar>
                            </AppBar>
                        </React.Fragment>

                        }


                        <Modal className={"loop-popup"}
                               aria-labelledby="contained-modal-title-vcenter"
                               centered show={this.state.showPopUp} onHide={this.showPopUp} animation={false}>

                            <ModalBody>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-4 text-center"}>
                                        <img className={"ring-pop-pup"} src={GrayLoop} alt=""/>
                                    </div>
                                </div>


                                {this.state.loopError ?
                                    <>
                                        <div className={"row justify-content-center"}>
                                            <div className={"col-12 text-center"} >
                                                <p className={"text-bold "}>Failed</p>
                                                <p>  {this.state.loopError}</p>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={"row justify-content-center"}>
                                            <div className={"col-10 text-center"}>
                                                <p className={"text-bold"}>Match Accepted</p>
                                             <p>   A cycle has been created. Send a message to the seller to arrange a
                                                 delivery time.</p>
                                            </div>
                                        </div>
                                        <div className={"row justify-content-center"}>
                                            <div className={"col-6"} style={{textAlign:"center"}}>
                                                <p style={{minWidth:"120px"}} className={"shadow-sm mr-2 btn btn-link btn-green mt-2 mb-2 btn-blue"}> <Link onClick={this.showPopUp} to={"/message-seller/" + this.slug}>Chat</Link></p>

                                            </div>
                                            <div className={"col-6"} style={{textAlign:"center"}}>
                                                <p onClick={this.showPopUp} className={"shadow-sm mr-2 btn btn-link green-btn-border mt-2 mb-2 btn-blue"}>Ok</p>
                                            </div>
                                        </div>
                                    </>


                                }
                            </ModalBody>

                        </Modal>


                    </div>

                </div>

                }

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
