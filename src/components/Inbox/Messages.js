import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios'
import {baseUrl} from "../../Util/Constants";
import MessageItem from "./MessageItem";

class Messages extends Component {

    state = {
        allMessages: []
    }

    getMessages = (userDetails) => {
        if (!userDetails) return;
        const { token, orgId } = userDetails;

        axios
            .get(`${baseUrl}message/org/${encodeURIComponent(orgId)}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                this.setState({ allMessages: response.data.data });
                console.log('M => ', this.state.allMessages);
            })
            .catch((error) => {
                console.log("[Notifications] ", error);
            });
    }

    componentDidMount() {
        this.getMessages(this.props.userDetail)
    }

    render() {
        return <div>
            {this.state.allMessages.length > 0 ? this.state.allMessages.map(item => {
                return <Messages item={item} key={Date.now()} />
            }) : 'No messages ... '}
            <MessageItem />
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps)(Messages);
