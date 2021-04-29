import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { baseUrl } from "../../Util/Constants";
import NotificationItem from "./NotificationItem";
import _ from "lodash";
import * as actionCreator from "../../store/actions/actions";

const REGEX_ID_ARRAY = /([\w\d]+)\/([\w\d-]+)/g;

class Notifications extends Component {

    checkNotifications = (item, index) => {
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

            <div key={index}>
                <NotificationItem
                    item={item}
                    editText={text}
                />
            </div>
        );
    };

    componentDidMount() {
        this.props.getNotifications();
        this.timer = setInterval(this.props.getNotifications, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <div>
                <h5 className="blue-text mb-4">
                    Notifications (
                    {this.props.notifications.length <= 0
                        ? "..."
                        : this.props.notifications.length}
                    )
                </h5>
                <div className="notification-content">
                    {this.props.notifications.length > 0
                        ? this.props.notifications.map((item, index) => {
                              return this.checkNotifications(item, index);
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
        notifications: state.notifications,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNotifications: (data) => dispatch(actionCreator.getNotifications(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
