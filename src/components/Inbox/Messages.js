import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import MessageItem from "./MessageItem";
import _ from "lodash";
import SendMessage from "./SendMessage";
import { getUserDetail } from "../../store/actions/actions";

class Messages extends Component {
    state = {
        allMessages: [],
        allOrgs: [],
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
                this.setState({allOrgs: response.data})
            })
            .catch((error) => {});
    };

    handleDeleteMessage = (key) => {
        // console.log("[Messages.js] ", key);
    };

    interval;
    updateMessages() {
        this.interval = setInterval(() => {
            this.getMessages(this.props.userDetail);
        }, 10000);
    }

    componentDidMount() {
        this.getMessages(this.props.userDetail);
        this.getAllOrgs(this.props.userDetail);
        this.updateMessages();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <>
                <SendMessage />

                <hr/>

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
                </div>
            </>
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
