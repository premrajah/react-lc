import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "../../components/Layout/Layout";
import * as actionCreator from "../../store/actions/actions";
import HomeScreenInfo from '../../components/Home/HomeScreenInfo';
import Dashboard from '../../components/Home/Dashboard/Dashboard';

const Home = ({isLoggedIn}) => {

    return (
        <Layout>
            <div className="wrapper ">
                <HomeScreenInfo />
            </div>
        </Layout>
    );
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
