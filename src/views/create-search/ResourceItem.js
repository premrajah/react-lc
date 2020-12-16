import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Paper from '../../img/place-holder-lc.png';
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



class ResourceItem extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }

    }

    componentWillMount() {

    }

    componentDidMount() {

    }





    render() {


        return (

         <Link to={"/"+ this.props.item.listing._key }>

            <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">


                <div className={"col-2"}>


                        {this.props.item.images ? <img className={"resource-item-img  img-fluid"} src={this.props.item.images[0]} alt="" /> : <img className={"img-fluid"} src={Paper} alt="" />}


                </div>
                <div className={"col-8 pl-3 content-box-listing"}>

                        <p style={{ fontSize: "18px" }} className=" mb-1 list-title">{this.props.item.listing.name}</p>
                        <p style={{ fontSize: "16px" }} className="text-mute mb-1">{this.props.item.listing.state} / {this.props.item.listing.volume} {this.props.item.listing.units}</p>
                        {/*<p style={{ fontSize: "16px" }} className="text-mute mb-1">@{this.props.item.tags}</p>*/}

                </div>
                <div style={{ textAlign: "right" }} className={"col-2"}>
                    <p className={"green-text"}>

                        {this.props.item.price ? <>{this.props.item.price.currency} {this.props.item.price.value}</> : "Free"}

                    </p>


                </div>



            </div>
        </Link>
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