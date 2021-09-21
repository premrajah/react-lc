import React, { Component } from "react";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import MessageItem from "./MessageItem";
import _ from "lodash";
import SendMessage from "./SendMessage";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";


class Messages extends Component {
    state = {
        allOrgs: [],
        sendMessageModal: false,
    };

    getAllOrgs = () => {

        axios
            .get(`${baseUrl}org/all`)
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
        this.getAllOrgs();
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
                            {this.props.messages.length <= 0
                                ? "..."
                                : this.props.messages.length }
                            )
                        </h5>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="messages-content">
                            {this.props.messages.length > 0
                                ? this.props.messages.map((item, index) => {
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
        getMessages: () => dispatch(actionCreator.getMessages()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
