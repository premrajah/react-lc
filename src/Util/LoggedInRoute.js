import React from "react";
import { Route, Redirect } from "react-router-dom";

import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";

const LoggedInRoute = ({ component: Component, isLoggedIn, ...rest }) => (
    <Route
        {...rest}
        render={(props) => (isLoggedIn === true ? <Component {...props} /> : <Redirect to="/" />)}
    />
);

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        loginPopUp: (item) => dispatch(actionCreator.loginPopUp(item)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(LoggedInRoute);
