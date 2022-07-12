import React from "react";
import { Route, Redirect } from "react-router-dom";

import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";

const PromptLoginRoute = ({ component: Component, isLoggedIn, ...rest }) =>

    {
 if(!isLoggedIn){
     rest.setLoginPopUpStatus(0);
     rest.showLoginPopUp(true);
 }


  return  <Route
        {...rest}
        render={(props) => <Component {...props} />}
    />
};

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
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(PromptLoginRoute);
