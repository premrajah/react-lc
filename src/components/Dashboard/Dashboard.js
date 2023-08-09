import React from 'react'
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";

const Dashboard = ({ isLoggedIn }) => {
    return (
        <div className="container-fluid">

            <section className='org-dashboard'>
                <div className="row">
                    <div className="col">
                        Dashboard
                    </div>
                </div>
            </section>

            <section className='portal-dashboard'>
                <div className="row">
                    <div className="col">
                        Global Dashboard
                    </div>
                </div>
            </section>

        </div>
    )
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
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)