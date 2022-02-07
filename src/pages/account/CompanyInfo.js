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
            <Layout>

                    <div className="container pb-4 pt-4">
                        <div>
                            <Link to={"/account"}>Account </Link> > Company Info
                        </div>

                        <PageHeader
                            pageTitle="Company Info"
                            subTitle="Add and change your company details here"

                        />

                     <CompanyDetails  showImage />
                    </div>

            </Layout>
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
