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
import ProductDetailCycle from '../../components/ProductDetailCycle'
import moment from "moment";
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';


class ItemCycleDetail extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
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
        this.showSignUpPopUp = this.showSignUpPopUp.bind(this)



    }


    showSignUpPopUp = (event) => {
        this.props.setLoginPopUpStatus(1);
        this.props.showLoginPopUp(true);
    };


    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {

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



                this.setState({

                    codeImg: response
                })

            },
                (error) => {

                    var status = error.response.status




                }
            );


    }



    getResources() {



        var url = baseUrl + "code/" + this.slug+"/expand";




        axios.get(url
            // {
            //     headers: {
            //         "Authorization" : "Bearer "+this.props.userDetail.token
            //     }
            // }
        )
            .then((response) => {

                var responseData = response.data.data;



                this.setState({

                    item: responseData
                })

                //
                // this.loadSearches()
                // this.getQrCode()

            },
                (error) => {




                }
            );

    }


    componentWillMount() {
        window.scrollTo(0, 0)
    }


    componentDidMount() {

        this.getResources()

    }



    render() {



        return (
            <div>

                <Sidebar />
                <div className="accountpage">

                    <HeaderDark />

                    <div className="container ">


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

                                        <p >To register your product with Loopcycle, please sign in below or <span onClick={this.showSignUpPopUp} className={"blue-text forgot-password-link"}>sign up</span>.

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

                            <div className={"row"}>
                            <div className="col-12 mt-2 mb-2" >

                                <h3 className={"blue-text text-heading"}>Product Details
                                </h3>

                            </div>
                            </div>


                            {this.state.item &&
                            <>
                                <ProductDetailCycle showRegister={true} item={this.state.item} />

                            </>
                            }



                        </div>

                        <div className="row justify-content-start pb-3 pt-3 ">

                            <div className="col-12">
                                <h5 className={"text-bold blue-text"}>Product Provenance </h5>
                            </div>

                            <div className="col-12">
                                <p style={{ fontSize: "16px" }} className={"text-gray-light "}>
                                    See where this product has travelled since the day it was created.
                                </p>

                            </div>

                        </div>



                        {this.state.item && <CustomizedTimeline   item={this.state.item} />}



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

function CustomizedTimeline(props) {
    const classes = useStyles();

    return (

        <Timeline >



            {props.item.transitions.filter((item)=>  item.relation==="belongs_to").map((item,index)=>

                <TimelineItem>
                    <TimelineOppositeContent>
                        <Typography>
                            <p className={"text-blue"}>{moment(item._ts_epoch_ms).format("DD MMM YYYY")}</p>
                        </Typography>
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                        <TimelineDot style={{ backgroundColor:"#27245C", width:"25px",height:"25px"}}>
                            {/*<BusinessIcon />*/}
                        </TimelineDot>


                        <TimelineConnector style={{ backgroundColor: "#05AD88", height: "100px" }}/>
                    </TimelineSeparator>

                    <TimelineContent>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography variant="h6" component="h1" style={{ color:"#05AD88"}}>
                                {item.org.name}, {item.org.description}
                            </Typography>

                        </Paper>
                    </TimelineContent>
                </TimelineItem>

            )}

            {props.item.transitions.filter((item)=>  item.relation==="past_owner").map((item,index)=>

                <TimelineItem>
                    <TimelineOppositeContent>
                        <Typography>
                            <p className={"text-blue"}>{moment(item._ts_epoch_ms).format("DD MMM YYYY")}</p>
                        </Typography>
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                        <TimelineDot style={{ backgroundColor:"#05AD88", width:"25px",height:"25px"}}>
                            {/*<BusinessIcon />*/}
                        </TimelineDot>


                        <TimelineConnector style={{ backgroundColor: "#05AD88", height: "100px" }}/>

                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography variant="h6" component="h1" style={{ color:"#05AD88"}}>
                                {item.org.name}, {item.org.description}
                            </Typography>

                        </Paper>
                    </TimelineContent>
                </TimelineItem>

            )}

            {props.item.transitions.filter((item)=>  item.relation==="service_agent_for").map((item,index)=>

                <TimelineItem>
                    <TimelineOppositeContent>
                        <Typography>
                            <p className={"text-blue"}>{moment(item._ts_epoch_ms).format("DD MMM YYYY")}</p>
                        </Typography>
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                        <TimelineDot style={{ backgroundColor:"#05AD88", width:"25px",height:"25px"}}>
                            {/*<BusinessIcon />*/}
                        </TimelineDot>

                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper elevation={0} className={classes.paper}>
                            <Typography variant="h6" component="h1" style={{ color:"#05AD88"}}>
                                {item.org.name}, {item.org.description}
                            </Typography>
                           
                        </Paper>
                    </TimelineContent>
                </TimelineItem>

            )}




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
