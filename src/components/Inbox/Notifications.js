import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {baseUrl, frontEndUrl} from "../../Util/Constants";
import NotificationItem from "./NotificationItem";
import _ from 'lodash'


const REGEX_ID_ARRAY = /([\w\d]+)\/([\w\d-]+)/

class Notifications extends Component {
    state = {
        allNotifications: [],
    };


    getNotifications = (userDetails) => {
        if (!userDetails) return;
        const { token, orgId } = userDetails;
//?u=${frontEndUrl}p
        axios
            .get(`${baseUrl}message/notif`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                this.setState({ allNotifications: _.orderBy(response.data.data, ['message._ts_epoch_ms'], ['desc']) });
            })
            .catch((error) => {
                console.log("[Notifications] ", error);
            });
    };

    componentDidMount() {
        this.getNotifications(this.props.userDetail);
    }

    render() {
        return <div>
            <h5 className="blue-text mb-4">Notifications ({this.state.allNotifications.length <= 0 ? '...' : this.state.allNotifications.length})</h5>
            <div className="notification-content">
                {this.state.allNotifications.length > 0 ? this.state.allNotifications.map(item => {
                    return <NotificationItem item={item} key={item._key} />
                }) : 'No notifications... '}
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
