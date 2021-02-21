import React, {Component} from 'react';
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import {connect} from "react-redux";

class Approvals extends Component {
    render(){
        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />
                    <div className="container  pb-4 pt-4">

                        <PageHeader pageTitle="Approvals" subTitle="Approve registered products" />

                        <div className="row">
                            <div className="col">
                                Apologies, page under construction
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        test: null
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Approvals);