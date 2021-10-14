import React, { Component } from "react";
import CubeBlue from "../../img/icons/product-icon-big.png";
import { withStyles } from "@material-ui/core/styles/index";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout/Layout";
import Login from "../../views/login/Login";
import MessageLayout from "../../components/message/MessageLayout";

class MessagePage extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <Layout>
                <MessageLayout isPage={true} parentClass={"col-8"} />
            </Layout>
        );
    }
}

export default MessagePage;
