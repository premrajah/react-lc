import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { Router, Route, Switch , Link} from "react-router-dom";
import history from "../../History/history";
import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';
import Close from '@material-ui/icons/Close';
import NavigateBefore from '@material-ui/icons/NavigateBefore';


class  HeaderWhiteBack extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count : 0,
            nextIntervalFlag: false
        }
        this.goToInbox=this.goToInbox.bind(this)
        this.toggleMenu=this.toggleMenu.bind(this)

    }

    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
        this.props.history.go(+1)
    }



goToInbox(){

        history.push("/inbox")

}


    toggleMenu = (event) => {


        document.body.classList.add('sidemenu-open');

    }



    interval


    componentWillMount(){

    }

    componentDidMount(){

    }





    render() {

        return (


<>


    <div className="container header-white listing-row-border">

        <div className="row no-gutters p-0">
            <div className="col-auto" style={{margin:"auto"}}>

                <NavigateBefore onClick={this.handleBack}  style={{ fontSize: 32 }}/>
            </div>

            <div className="col text-left blue-text text-center text-bold"  style={{margin:"auto"}}>
                <p>{this.props.heading} </p>
            </div>

            <div className="col-auto">

                <button className="btn   btn-link text-dark menu-btn">
                    <Close onClick={this.handleBack}  className="" style={{ fontSize: 32 }} />

                </button>
            </div>


        </div>
    </div>


</>





        );
    }
}




const mapStateToProps = state => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter




    };
};

const mapDispachToProps = dispatch => {
    return {





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(HeaderWhiteBack);
