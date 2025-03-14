import React, {Component} from "react";
import {connect} from "react-redux";
import history from "../../History/history";
import Close from "@mui/icons-material/Close";
import NavigateBefore from "@mui/icons-material/NavigateBefore";

class HeaderWhiteBack extends Component {
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

    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };

    goToInbox() {
        history.push("/inbox");
    }

    toggleMenu = (event) => {
        document.body.classList.add("sidemenu-open");
    };

    interval;


    render() {
        return (
            <>
                <div
                    className={
                        this.props.border
                            ? "container header-white listing-row-border"
                            : "container header-white "
                    }>
                    <div className="row no-gutters p-0">
                        {this.props.back && (
                            <div className="col-auto" style={{ margin: "auto" }}>
                                <NavigateBefore
                                    onClick={this.handleBack}
                                    style={{ fontSize: 32 }}
                                />
                            </div>
                        )}

                        <div
                            className="col text-left blue-text text-center text-bold"
                            style={{ margin: "auto" }}>
                            <p>{this.props.heading} </p>
                        </div>

                        <div className="col-auto">
                            <button className="btn   btn-link text-dark menu-btn">
                                <Close
                                    onClick={this.handleBack}
                                    className=""
                                    style={{ fontSize: 32 }}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
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

const mapDispachToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispachToProps)(HeaderWhiteBack);
