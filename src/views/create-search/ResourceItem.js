import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import PlaceholderImg from '../../img/place-holder-lc.png';
import clsx from 'clsx';
import FilterImg from '../../img/icons/filter-icon.png';
import { Link } from "react-router-dom";
import LangIcon from '../../img/icons/lang.png';
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import HandGreyIcon from '../../img/icons/hand-gray.png';
import EditGray from '../../img/icons/edit-gray.png';
import RingGray from '../../img/icons/ring-gray.png';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchGray from '@material-ui/icons/Search';
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";



class ResourceItem extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            image:null
        }


    }

    componentWillMount() {

    }

    componentDidMount() {


        console.log(" recieved item")
        console.log(this.props.item)

    }
    
    





    render() {


        return (



<>

            {this.props.item.listing.listing?

                <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">


                    <div className={"col-2"}>

                        {this.props.item.artifacts&&this.props.item.artifacts.length>0? <img className={"img-fluid"} src={this.props.item.artifacts[0].blob_url} alt="" />: <img className={"img-fluid"} src={PlaceholderImg} alt="" />}

                    </div>
                    <div className={"col-6 pl-3 content-box-listing"}>

                        <p style={{ fontSize: "18px" }} className=" mb-1 list-title">Title: {this.props.item.listing.listing.name}</p>
                        <p style={{ fontSize: "16px" }} className=" mb-1 ">{this.props.item.product&& <>Product: {this.props.item.listing.product.name} </>}</p>
                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.listing.listing.state} / {this.props.item.listing.listing.volume} {this.props.item.listing.listing.units}</p>


                    </div>
                    {/*<div style={{ textAlign: "right" }} className={"col-2"}>*/}
                        {/*<p className={"green-text"}>*/}
                            {/*{this.props.item.price ? <>{this.props.item.price.currency} {this.props.item.price.value}</> : "Free"}*/}
                        {/*</p>*/}
                    {/*</div>*/}


                    <div className={"col-2 text-right"}>
                        <p className={"green-text"}>
                            {/*{this.props.item.price ? <>{this.props.item.price.currency} {this.props.item.price.value}</> : "Free"}*/}

                            {/*{this.props.item.listing.listing.price.value ? <> {this.props.item.listing.listing.price.value}</> : "Free"}*/}
                        </p>
                    </div>

                    <div className={"col-2 text-right"}>
                        <p className={"green-text"}>
                            {this.props.item.listing.listing.stage}
                        </p>
                    </div>



                </div>:

                <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">


                <div className={"col-2"}>

                    {this.props.item.artifacts&&this.props.item.artifacts.length>0? <img className={"img-fluid"} src={this.props.item.artifacts[0].blob_url} alt="" />: <img className={"img-fluid"} src={PlaceholderImg} alt="" />}

                </div>
                <div className={"col-6 pl-3 content-box-listing"}>

                    <p style={{ fontSize: "18px" }} className=" mb-1 list-title">Title: {this.props.item.listing.name}</p>
                    <p style={{ fontSize: "16px" }} className=" mb-1 ">{this.props.item.product&& <>Product: {this.props.item.product.name} </>}</p>

                    <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.listing.state} / {this.props.item.listing.volume} {this.props.item.listing.units}</p>


                </div>
                <div className={"col-2 text-right"}>
                    <p className={"green-text"}>
                        {/*{this.props.item.listing.price.value ? <> {this.props.item.listing.price.value}</> : "Free"}*/}
                    </p>
                </div>

                    <div className={"col-2 text-right"}>
                        <p className={"green-text"}>
                            {this.props.item.listing.stage}
                        </p>
                    </div>


            </div>
            }


            </>

        );
    }
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
)(ResourceItem);