import React, {Component} from "react";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {withStyles} from "@material-ui/core/styles/index";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout/Layout";
import Login from "../../views/login/Login";
import ForgotPassword from "../../views/login/ForgotPassword";


class ForgotPasswordPage extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }


    render() {


        return (
            <Layout>

                <PageHeader
                    pageIcon={CubeBlue}
                    pageTitle="Products"
                    subTitle="All your added products can be found here"
                />
               <ForgotPassword isPage={true} parentClass={"col-8"} />

            </Layout>
        );
    }
}



export default (ForgotPasswordPage);
