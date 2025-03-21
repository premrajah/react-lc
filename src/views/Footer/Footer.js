import React, { Component } from "react";
import history from "../../History/history";
import FooterNew from "../../components/Footer/Footer";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";

class Footer extends Component {
    interval;


    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };
        this.goToInbox = this.goToInbox.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    goToInbox() {
        history.push("/inbox");
    }

    toggleMenu = (event) => {
        document.body.classList.add("sidemenu-open");
    };


    render() {
        return (
            <>
                <FooterNew />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Footer);
