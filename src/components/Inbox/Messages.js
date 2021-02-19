import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import MessageItem from "./MessageItem";
import _ from "lodash";

class Messages extends Component {
    state = {
        allMessages: [],
    };

    getMessages = (userDetails) => {
        if (!userDetails) return;
        const { token, orgId } = userDetails;

        axios
            .get(`${baseUrl}message`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                this.setState({
                    allMessages: _.orderBy(response.data.data, ["message._ts_epoch_ms"], ["desc"]),
                });
            })
            .catch((error) => {});
    };

    handleDeleteMessage = (key) => {
        console.log('[Messages.js] ', key)
    };

    interval;
    updateMessages() {
        this.interval = setInterval(() => {
            this.getMessages(this.props.userDetail);
        }, 10000);
    }

    componentDidMount() {
        this.getMessages(this.props.userDetail);
        this.updateMessages();
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return (
            <div>
                <h5 className="blue-text mb-4">
                    Messages (
                    {this.state.allMessages.length <= 0 ? "..." : this.state.allMessages.length})
                </h5>
                <div className="messages-content">
                    {this.state.allMessages.length > 0
                        ? this.state.allMessages.map((item) => {
                              return (
                                  <MessageItem
                                      item={item}
                                      key={item.message._ts_epoch_ms + Math.random()}
                                      onDelete={this.handleDeleteMessage}
                                  />
                              );
                          })
                        : "No messages ... "}
                </div>
            </div>
        );
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
        test: null,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
