import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import MessageItem from "./MessageItem";
import _ from "lodash";
import SendMessage from "./SendMessage";
import { Modal } from "react-bootstrap";
import * as actionCreator from "../../store/actions/actions";


class Messages extends Component {
    state = {
        allMessages: [],
        allOrgs: [],
        sendMessageModal: false,
    };

    getAllOrgs = (userDetails) => {
        if (!userDetails) {
            return;
        }
        const { token } = userDetails;

        axios
            .get(`${baseUrl}org/all`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                this.setState({ allOrgs: response.data });
            })
            .catch((error) => {});
    };

    handleHideMessageModal = () => this.setState({ sendMessageModal: false });
    handleShowMessageModal = () => this.setState({ sendMessageModal: true });

    handleDeleteMessage = (key) => {
        // console.log("[Messages.js] ", key);
    };


    componentDidMount() {
        this.props.getMessages();
        this.timer = setInterval(this.props.getMessages, 10000);
        this.getAllOrgs(this.props.userDetail);
        this.setState({allMessages: this.props.messages})
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }


    render() {
        return (
            <>
                <div className="row">
                    <div className="col">
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-green" onClick={this.handleShowMessageModal}>
                                Send Messages
                            </button>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col">
                        <h5 className="blue-text mb-4">
                            Messages (
                            {this.state.allMessages.length <= 0
                                ? "..."
                                : this.state.allMessages.length}
                            )
                        </h5>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="messages-content">
                            {this.state.allMessages.length > 0
                                ? this.state.allMessages.map((item, index) => {
                                      return (
                                          <MessageItem
                                              item={item}
                                              key={index}
                                              onDelete={this.handleDeleteMessage}
                                          />
                                      );
                                  })
                                : "No messages ... "}
                        </div>
                    </div>
                </div>

                <Modal
                    show={this.state.sendMessageModal}
                    onHide={this.handleHideMessageModal}
                    backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Send Message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SendMessage apiPath="chat" />
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        messages: state.messages,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMessages: (data) => dispatch(actionCreator.getMessages(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
