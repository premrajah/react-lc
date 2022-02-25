import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import * as actionCreator from "../../store/actions/actions";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout/Layout";
import CompanyDetails from "../../components/Account/CompanyDetails";

class CompanyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {



        };

    }



    render() {
        return (


                    <div className="container  ">

                        <PageHeader
                            pageTitle="Company Info"
                            subTitle="Add and change your company details here"

                        />

                     <CompanyDetails  showImage />
                    </div>


        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        orgImage: state.orgImage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setOrgImage: (data) => dispatch(actionCreator.setOrgImage(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfo);
