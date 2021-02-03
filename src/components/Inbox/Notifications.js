import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { baseUrl, frontEndUrl } from "../../Util/Constants";
import NotificationItem from "./NotificationItem";
import _ from "lodash";
import { Link } from "@material-ui/core";

const REGEX_ID_ARRAY = /([\w\d]+)\/([\w\d-]+)/;

class Notifications extends Component {
    state = {
        allNotifications: [],
    };

    getNotifications = (userDetails) => {
        if (!userDetails) return;
        const { token, orgId } = userDetails;

        axios
            .get(`${baseUrl}message/notif`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                this.setState({
                    allNotifications: _.orderBy(
                        response.data.data,
                        ["message._ts_epoch_ms"],
                        ["desc"]
                    ),
                });
            })
            .catch((error) => {
                console.log("[Notifications] ", error);
            });
    };

    deleteNotificationCall = (key, userDetails) => {
        if (!key) return;

        axios
            .delete(`${baseUrl}message/${key}`, {
                headers: { Authorization: `Bearer ${userDetails.token}` },
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log('deleted?')
                    this.getNotifications(this.props.userDetail);
                }
            })
            .catch((error) => {
                console.log("Delete notification error ", error);
            });
    };

    handleDeleteNotification = (key) => {
        this.deleteNotificationCall(key, this.props.userDetail);
    };

    checkNotifications = (item) => {
        if (!item) return;

        const { message } = item;
        const returnedRegexArray =
            message.text !== null ? message.text.match(REGEX_ID_ARRAY) : message.text;

        let editedText = message.text;
        let link = null;
        let linkText = null;

        if (returnedRegexArray !== null) {
            switch (returnedRegexArray[1]) {
                case "Cycle":
                    link = `/cycle/${returnedRegexArray[0]}`;
                    linkText = "Cycle";
                    break;
                case "Product":
                    link = `/product/${returnedRegexArray[0]}`;
                    linkText = "Product";
                    break;
                default:
                    return;
            }

            return (
                <NotificationItem
                    editText={editedText}
                    link={link}
                    linkText={linkText}
                    item={item}
                    key={message._key}
                    onClose={this.handleDeleteNotification}
                />
            );
        }
    };

    componentDidMount() {
        this.getNotifications(this.props.userDetail);
    }

    render() {
        return (
            <div>
                <h5 className="blue-text mb-4">
                    Notifications (
                    {this.state.allNotifications.length <= 0
                        ? "..."
                        : this.state.allNotifications.length}
                    )
                </h5>
                <div className="notification-content">
                    {this.state.allNotifications.length > 0
                        ? this.state.allNotifications.map((item) => {
                              return this.checkNotifications(item);
                          })
                        : "No notifications... "}
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
