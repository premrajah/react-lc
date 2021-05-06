import React, { Component } from "react";
import { connect } from "react-redux";
import history from "../../History/history";
import IndexNavbar from "../../components/Navbars/IndexNavbar";

class HeaderDark extends Component {
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
        return <IndexNavbar />;
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(HeaderDark);
