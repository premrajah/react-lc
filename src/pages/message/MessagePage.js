import React, {Component} from "react";
import Layout from "../../components/Layout/Layout";
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
