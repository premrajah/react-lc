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
            .get(`${baseUrl}message`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                this.setState({ allMessages: response.data.data });

            })
            .catch((error) => {

            });
    }

    handleDeleteMessage = (key) => {

    }

    componentDidMount() {
        this.getMessages(this.props.userDetail)
    }

    render() {
        return <div>
            <h5 className="blue-text mb-4">Messages ({this.state.allMessages.length <= 0 ? '...' : this.state.allMessages.length})</h5>
            <div className="messages-content">
                {this.state.allMessages.length > 0 ? this.state.allMessages.map(item => {
                    return <MessageItem item={item} key={Date.now()} onDelete={this.handleDeleteMessage} />
                }) : 'No messages ... '}
            </div>
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
    return {
        test: null
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
