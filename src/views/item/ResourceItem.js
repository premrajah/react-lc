import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import PlaceholderImg from "../../img/place-holder-lc.png";

import { Link } from "react-router-dom";

class ResourceItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
        };
    }

    componentWillMount() {}

    componentDidMount() {}

    render() {
        return (
            <>
                {/*<Link to={"/match/" + this.props.item.id + "/" + this.props.searchId}>*/}

                <Link to={"/" + this.props.item.id}>
                    <div className="row no-gutters justify-content-center mt-4 mb-4 listing-row-border pb-4">
                        <div className={"col-2"}>
                            {this.props.item.images.length > 0 ? (
                                <img
                                    className={"resource-item-img  img-fluid"}
                                    src={this.props.item.images[0]}
                                    alt=""
                                />
                            ) : (
                                <img className={"img-fluid"} src={PlaceholderImg} alt="" />
                            )}
                        </div>
                        <div className={"col-6 pl-3 content-box-listing"}>
                            <p style={{ fontSize: "18px" }} className=" mb-1">
                                {this.props.item.name}
                            </p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                {this.props.item.state}
                                {/*/ {this.props.item.volume} {this.props.item.units}*/}
                            </p>
                            <p style={{ fontSize: "16px" }} className="text-mute mb-1">
                                @{this.props.item.tags}
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }} className={"col-2"}>
                            <p className={"green-text"}>
                                {this.props.item.price ? (
                                    <>
                                        {this.props.item.price.currency}{" "}
                                        {this.props.item.price.value}
                                    </>
                                ) : (
                                    "Free"
                                )}
                            </p>
                        </div>

                        <div style={{ textAlign: "right" }} className={"col-2"}>
                            <p className={"green-text"}>{this.props.item.stage}</p>
                        </div>
                    </div>
                </Link>
            </>
        );
    }
}

const mapStateToProps = (state) => {
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

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ResourceItem);
