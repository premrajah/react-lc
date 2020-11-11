import React, { Component } from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import MarkerIcon from '../../img/icons/marker.png';

import BottomDetail from '../../img/bottom-detail.png';

import ProImg from '../../img/img-product.png';
import StateIcon from '../../img/icons/state.png';
import HeaderDark from '../header/HeaderDark'
import Sidebar from '../menu/Sidebar'

import { Spinner, Alert } from 'react-bootstrap';


import { makeStyles } from '@material-ui/core/styles';

import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

import BusinessIcon from '@material-ui/icons/Business';
import TextField from '@material-ui/core/TextField';


class ItemCycleDetail extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: {},
            codeImg: null,
            searches: [],
            fields: {},
            errors: {},
            active: 0, //0 logn. 1- sign up , 3 -search,
            formValid: false
        }

        this.slug = props.match.params.slug

        this.getResources = this.getResources.bind(this)
        this.getQrCode = this.getQrCode.bind(this)
        this.loadSearches = this.loadSearches.bind(this)



    }



    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
        this.props.history.go(+1)
    }




    handleValidationSubmitGreen() {

        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["password"]) {
            formIsValid = false;
            // errors["password"] = "Required";
        }


        if (!fields["email"]) {
            formIsValid = false;
            // errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                // errors["email"] = "Invalid email address";
            }
        }


        this.setState({ formValid: formIsValid });


    }



    handleValidation() {

        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (!fields["password"]) {
            formIsValid = false;
            errors["password"] = "Required";
        }


        if (!fields["email"]) {
            formIsValid = false;
            errors["email"] = "Required";
        }

        if (typeof fields["email"] !== "undefined") {

            let lastAtPos = fields["email"].lastIndexOf('@');
            let lastDotPos = fields["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Invalid email address";
            }
        }

        this.setState({ errors: errors });
        return formIsValid;
    }



    handleChange(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

        this.handleValidationSubmitGreen()
    }


    handleSubmit = event => {

        event.preventDefault();


        const form = event.currentTarget;

        if (this.handleValidation()) {
            this.setState({
                btnLoading: true
            })

            const data = new FormData(event.target);

            const username = data.get("email")
            const password = data.get("password")


            this.props.logIn({ "email": username, "password": password })

        } else {

        }


    }



    loadSearches() {






    }

    getQrCode() {



        axios.get(baseUrl + "product/" + this.slug + "/code")
            .then((response) => {

                var response = response.data;
                console.log("qr code", response);


                this.setState({

                    codeImg: response
                })

            },
                (error) => {

                    var status = error.response.status

                    console.log("resource error ", error)


                }
            );


    }



    getResources() {



        var url = baseUrl + "code/" + this.slug;

        console.log(url)

        // baseUrl+"product/"+this.slug


        axios.get(url
            // {
            //     headers: {
            //         "Authorization" : "Bearer "+this.props.userDetail.token
            //     }
            // }
        )
            .then((response) => {

                var response = response.data;
                console.log("qr code detail resource response ", response)


                this.setState({

                    item: response.content
                })


                this.loadSearches()
                this.getQrCode()

            },
                (error) => {

                    var status = error.response.status

                    console.log("product detail  error ", error)


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

                    <div className="container mt-5 pt-5 ">



                        {!this.props.isLoggedIn && <>

                            <div className="row justify-content-start pb-3 pt-4 listing-row-border ">

                                <div className="col-12">
                                    <h3 className={"blue-text text-heading"}>Register my product
                                </h3>

                                </div>

                            </div>
                            <div className="row   ">
                                <div className="row no-gutters">
                                    <div className="col-12 p-3">
                                        <p >Congratulations on your recent purchase!
                                    </p>

                                        <p >To register your product with Loopcycle, please sign in below or <span className={"blue-text forgot-password-link"}>sign up</span>.

                                    </p>

                                        <p >Register your product and we’ll give you back 5% of the product’s original cost if you eventually sell it on the platform.

                                    </p>

                                    </div>
                                </div>

                                <div className="row no-gutters">




                                    <div className="col-12 p-3">

                                        <form onSubmit={this.handleSubmit}>
                                            <div className="row no-gutters justify-content-center">
                                                <div className="col-12">

                                                    <TextField
                                                        type={"email"}
                                                        onChange={this.handleChange.bind(this, "email")}
                                                        id="outlined-basic" label="Email" variant="outlined" fullWidth={true} name={"email"} />

                                                    {this.state.errors["email"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["email"]}</span>}



                                                </div>

                                                <div className="col-12 mt-4">

                                                    <TextField type={"password"} onChange={this.handleChange.bind(this, "password")} id="outlined-basic" label="Password" variant="outlined" fullWidth={true} name={"password"} />

                                                    {this.state.errors["password"] && <span className={"text-mute small"}><span style={{ color: "red" }}>* </span>{this.state.errors["password"]}</span>}

                                                </div>

                                                <div className="col-12 mt-4">
                                                    <p onClick={this.forGotPass} className={"forgot-password-link text-mute small"}>Forgot your password? </p>
                                                </div>


                                                {this.props.loginFailed &&

                                                    <div className="col-12 mt-4">
                                                        <Alert key={"alert"} variant={"danger"}>
                                                            {this.props.loginError}
                                                        </Alert>
                                                    </div>
                                                }

                                                <div className="col-12 mt-4">

                                                    <button type={"submit"} className={this.state.formValid ? "btn-green btn btn-default btn-lg btn-rounded shadow btn-block login-btn" : "btn btn-default btn-lg btn-rounded shadow btn-block btn-gray login-btn"}>
                                                        {this.props.loading && <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"

                                                        />}

                                                        {this.props.loading ? "Wait.." : "Log In"}

                                                    </button>
                                                </div>


                                            </div>

                                        </form>
                                    </div>

                                </div>

                            </div>

                        </>}



                        <div>

                            <div className="col-12 mt-5 mb-4" >
                                <h3 className={"blue-text text-heading"}>Product Details
                                </h3>

                            </div>

                            <div className="col-12 mt-5 mb-4" >

                                <img src={ProImg} alt="" />
                            </div>

                        </div>


                        <div className="row justify-content-start pb-3 pt-4 ">



                            <div className="col-12">
                                <h3 className={"blue-text text-bold"}>{this.state.item.title}</h3>
                            </div>

                            <div className="col-12  pb-3 listing-row-border">
                                <p>Manufactured by  By <span className={"green-text"}> {this.state.item.org_id}</span></p>
                            </div>

                            <div className="col-12 mt-3 pb-3 listing-row-border">
                                <p>{this.state.item.description}</p>
                            </div>
                            {/*<div className="col-12 mt-3 pb-3 ">*/}
                            {/*<p style={{width:"auto",padding: "2px 10px"}} className={" btn-select-free green-bg"}>{this.state.item.purpose  }</p>*/}

                            {/*<p style={{width:"auto",padding: "2px 10px"}} className={" btn-select-free green-bg"}>{"Shelving" }</p>*/}
                            {/*<p style={{width:"auto",padding: "2px 10px"}} className={" btn-select-free green-bg"}>{"PP" }</p>*/}

                            {/*</div>*/}

                        </div>


                        {/*<div className="row justify-content-start pb-3 pt-4 border-box">*/}

                        {/*<div className="col-12">*/}

                        {/*/!*{this.state.codeImg && <img src={this.state.codeImg} alt="" />}*!/*/}

                        {/*/!*{this.state.codeImg && <img src={"base64,"+this.state.codeImg} alt=""/> }*!/*/}

                        {/*/!*{this.state.codeImg && <img src={this.state.codeImg} alt=""/> }*!/*/}


                        {/*<img src={"http://api.makealoop.io/api/1/product/"+this.state.item.id+"/code"} alt=""/>*/}



                        {/*</div>*/}
                        {/*</div>*/}

                        <div className="container justify-content-start pb-4 pt-3 ">


                            <div className="row justify-content-start pb-4 pt-3 ">
                                <div className="col-auto">
                                    <h5 className={"text-bold"}>Product Info
                                </h5>

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



                                    {this.state.item.searches && this.state.item.searches.length > 0 &&
                                        <>
                                            <p style={{ fontSize: "18px" }} className="  mb-1">{this.state.item.searches[0].tags} </p>
                                            {/*<p style={{fontSize:"18px"}} className="  mb-1"></p>*/}
                                        </>
                                    }


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

                            {/*<div className="row  justify-content-start search-container  pb-4">*/}
                            {/*/!*<div className={"col-1"}>*!/*/}
                            {/*/!*<img className={"icon-about"} src={ListIcon} alt=""/>*!/*/}
                            {/*/!*</div>*!/*/}
                            {/*<div className={"col-auto"}>*/}

                            {/*<p style={{fontSize:"18px"}} className="text-mute text-gray-light mb-1">Purpose</p>*/}
                            {/*<p style={{fontSize:"18px"}} className="  mb-1">{this.state.item.purpose} </p>*/}
                            {/*</div>*/}
                            {/*</div>*/}


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

                                            {/*<img src={TescoImg} alt="" />*/}

                                            <span className={"word-user word-user-sellor"}>
                                                M

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





                        </div>


                        {/*<div className="row justify-content-start pb-3 pt-3 ">*/}

                        {/*<div className="col-12">*/}
                        {/*<h5 className={"text-bold blue-text"}>Product Journey</h5>*/}
                        {/*</div>*/}

                        {/*<div className="col-12">*/}
                        {/*<p  style={{fontSize:"16px"}} className={"text-gray-light "}>*/}
                        {/*Click on an icon to see more information.*/}
                        {/*</p>*/}

                        {/*</div>*/}

                        {/*</div>*/}


                        {/*<div className="row justify-content-center pb-3 pt-4 ">*/}

                        {/*<div style={{textAlign:"center"}} className="col-12">*/}


                        {/*<img style={{width:"98%"}} src={BottomDetailInfo} alt=""/>*/}
                        {/*</div>*/}
                        {/*</div>*/}



                        <div className="row justify-content-start pb-3 pt-3 ">

                            <div className="col-12">
                                <h5 className={"text-bold blue-text"}>Product Provenance (Illustration)</h5>
                            </div>

                            <div className="col-12">
                                <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                                    See where this product has travelled since the day it was created.
                                </p>

                            </div>

                        </div>


                        <div className="row justify-content-center pb-3 pt-4 border-box">

                            <div style={{ textAlign: "center" }} className="col-12">


                                <img style={{ width: "90%" }} src={BottomDetail} alt="" />

                            </div>
                        </div>





                        {/*<div className="row justify-content-start pb-3 pt-3 ">*/}

                        {/*<div className="col-12">*/}
                        {/*<h5 className={"text-bold blue-text"}>Searches</h5>*/}
                        {/*</div>*/}

                        {/*<div className="col-12">*/}
                        {/*<p  style={{fontSize:"16px"}} className={"text-gray-light "}>*/}
                        {/*All searches assigned to this product.*/}
                        {/*</p>*/}

                        {/*</div>*/}

                        {/*</div>*/}



                        {/*<div className="row justify-content-start pb-3 pt-4 border-box">*/}

                        {/*<div className="col-12">*/}




                        {/*{this.state.searches.map((item)=>*/}
                        {/*<div  style={{border:"none"}} data-name={item.title}  className="row mr-2 ml-2 selection-row selected-row p-3 mb-3  " onClick={this.selectProduct}>*/}

                        {/*<div  className="col-10">*/}
                        {/*/!*<Link to={"/search"}>*!/*/}
                        {/*<p className={"blue-text "} style={{fontSize:"16px"}}>{item.name}</p>*/}
                        {/*/!*</Link>*!/*/}
                        {/*</div>*/}
                        {/*<div className="col-2">*/}
                        {/*<NavigateNextIcon/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        {/*)}*/}



                        {/*</div>*/}
                        {/*</div>*/}




                    </div>


                </div>



            </div>
        );
    }
}



const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

function CustomizedTimeline() {
    const classes = useStyles();

    return (
        <Timeline align="alternate">
            <TimelineItem>
                {/*<TimelineOppositeContent>*/}
                {/*<Typography variant="body2" color="textSecondary">*/}
                {/*9:30 am*/}
                {/*</Typography>*/}
                {/*</TimelineOppositeContent>*/}
                <TimelineSeparator>
                    <TimelineDot>
                        <BusinessIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Company A
                        </Typography>
                        <Typography>
                            <p className={"text-blue"}>Plastics</p>
                            <p>4 Kgs</p>
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                {/*<TimelineOppositeContent>*/}
                {/*<Typography variant="body2" color="textSecondary">*/}
                {/*10:00 am*/}
                {/*</Typography>*/}
                {/*</TimelineOppositeContent>*/}
                <TimelineSeparator>
                    <TimelineDot color="primary">
                        <BusinessIcon />
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Company B
                        </Typography>
                        <Typography>
                            <p className={"text-blue"}>Paper and Card </p>
                            <p>5 Kgs</p>

                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="primary" variant="outlined">
                        <BusinessIcon />
                    </TimelineDot>
                    <TimelineConnector className={classes.secondaryTail} />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" component="h1">
                            Company C
                        </Typography>
                        <Typography>
                            <p className={"text-blue"}>Other </p>
                            <p>9 Kgs</p>

                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>

        </Timeline>
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
)(ItemCycleDetail);
