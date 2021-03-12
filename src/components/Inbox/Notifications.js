import React, {Component} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import NotificationItem from "./NotificationItem";
import _ from "lodash";

const REGEX_ID_ARRAY = /([\w\d]+)\/([\w\d-]+)/g;

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
            .catch((error) => {});
    };

    deleteNotificationCall = (key) => {
        if (!key) return;

        axios
            .delete(`${baseUrl}message/${key}`, {
                headers: { Authorization: `Bearer ${this.props.userDetail.token}` },
            })
            .then((response) => {
                if (response.status === 200) {
                    this.getNotifications(this.props.userDetail);
                }
            })
            .catch((error) => {});
    };

    checkNotifications = (item) => {
        if (!item) return;

        const { message } = item;
        let text;

        text = message.text.replaceAll(REGEX_ID_ARRAY, (match) => {
            if (match.startsWith("Product/")) {
                return `<a href="/${match}" class="green-link-url" style={{color: 'red'}}>Product</a>`;
            } else if (match.startsWith("Org/")) {
                return `<span class="blue-text"><b>${match.substr(4)}</b></span>`;
            } else if (match.startsWith("Cycle/")) {
                return `<a href="/${match}" class="green-link-url">Cycle</a>`;
            } else if (match.startsWith("Match/")) {
                return `<a href="/${match}" class="green-link-url">Match</a>`;
            } else {
                return match;
            }
        });

        return (
            // <div key={message._ts_epoch_ms} dangerouslySetInnerHTML={{ __html: text }} />

            <div key={message._ts_epoch_ms}>
                <NotificationItem
                    item={item}
                    editText={text}
                    onClose={this.deleteNotificationCall}
                />
            </div>
        );
    };

    componentDidMount() {
        this.getNotifications(this.props.userDetail);
        this.updateNotifications();
    }

    interval;
    updateNotifications() {
        this.interval = setInterval(() => {
            this.getNotifications(this.props.userDetail);
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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
