import React from "react";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import IndexNavbar from "../Navbars/IndexNavbar";
import history from "../../History/history";
import Sidebar from "../Sidebar/Sidebar";

class Header extends React.Component {
    constructor(props) {
        super(props);



        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };
        this.goToInbox = this.goToInbox.bind(this);
        this.showLoginPopUp = this.showLoginPopUp.bind(this);

    }

    goToInbox() {
        history.push("/inbox");
    }

    toggleMenu = (event) => {
        document.body.classList.add("sidemenu-open");
    };



    showLoginPopUp() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        }
    }

    render() {
        return (
            <>
                <Sidebar/>
               <IndexNavbar/>
               </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        // loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        // userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Header);
