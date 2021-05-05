import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { baseUrl } from "../../Util/Constants";
import NotificationItem from "./NotificationItem";
import _ from "lodash";
import * as actionCreator from "../../store/actions/actions";
import reactStringReplace from "react-string-replace";
import {Card, CardContent} from "@material-ui/core";
import NotIcon from "@material-ui/icons/Notifications";
import moment from "moment/moment";
import Org from "../Org/Org";
import {Link} from "react-router-dom";

const REGEX_ID_ARRAY = /([\w\d]+)\/([\w\d-]+)/g;
const ORG_REGEX = /(Org\/[\w\d-]+)/g;
const PRODUCT_REGEX = /Product\/([\w\d]+)/g;
const CYCLE_REGEX = /Cycle\/([\w\d]+)/g;
const MATCH_REGEX = /Match\/([\w\d]+)/g;
const PRODUCT_RELEASE_REGEX = /ProductRelease\/([\w\d]+)/g;
const BRACKETS_REGEX = /[(\[)(\])]/g;

class Notifications extends Component {

    checkNotifications = (item, index) => {
        if (!item) return;

        const { message } = item;
        let text;

        text = reactStringReplace(message.text, ORG_REGEX, (match, i) => (
            <Org key={i + Math.random() * 100} orgId={match} />
        ));

        text = reactStringReplace(text, PRODUCT_REGEX, (match, i) => (
            <Link key={i + Math.random() * 101} to={`product/${match}`}><u className="blue-text">Product</u></Link>
        ));

        text = reactStringReplace(text, CYCLE_REGEX, (match, i) => (
            <Link key={i + Math.random() * 102} to={`cycle/${match}`}><u className="blue-text">Cycle</u></Link>
        ));

        text = reactStringReplace(text, MATCH_REGEX, (match, i) => (
            <Link key={i + Math.random() * 102} to={`match/${match}`}><u className="blue-text">Match</u></Link>
        ));

        text = reactStringReplace(text, PRODUCT_RELEASE_REGEX, (match, i) => (
            <Link key={i + Math.random() * 102} to="/approve"><u className="blue-text">Approvals</u></Link>
        ));




        return (
        <Card  variant="outlined" className="mb-2">
            <CardContent>
                <div className="row">
                    <div className="col-12">
                        <NotIcon
                            style={{
                                color: "#eee",
                                float: "left",
                                marginRight: "15px",
                                marginTop: "3px",
                            }}
                        />
                        <div style={{ float: "left", marginBottom: "0" }}>{text}</div>

                        <span className="text-mute time-text">
                            {moment(message._ts_epoch_ms).fromNow()}
                        </span>

                    </div>
                </div>
            </CardContent>
        </Card>
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
