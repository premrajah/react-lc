import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "../../components/Layout/Layout";
import * as actionCreator from "../../store/actions/actions";
import HomeScreenInfo from './HomeScreenInfo';
import Dashboard from '../../components/Dashboard/Dashboard';

const Home = () => {

    return (
        <Layout>
            <div className="wrapper ">
                {/* <Dashboard /> */}
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
