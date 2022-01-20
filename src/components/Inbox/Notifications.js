import React, {Component} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import reactStringReplace from "react-string-replace";
import {Card, CardContent, Snackbar} from "@mui/material";
import NotIcon from "@mui/icons-material/Notifications";
import moment from "moment/moment";
import Org from "../Org/Org";
import {Link} from "react-router-dom";
import Alert from "@mui/material/Alert";
import _ from "lodash";
import PaginationLayout from "../IntersectionOserver/PaginationLayout";

const REGEX_ID_ARRAY = /([\w\d]+)\/([\w\d-]+)/g;
const ORG_REGEX = /(Org\/[\w\d-]+)/g;
const PRODUCT_REGEX = /Product\/([\w\d]+)/g;
const CYCLE_REGEX = /Cycle\/([\w\d]+)/g;
const MATCH_REGEX = /Match\/([\w\d]+)/g;
const PRODUCT_RELEASE_REGEX = /ProductRelease\/([\w\d]+)/g;
const PRODUCT_REGISTRATION = /ProductRegistration\/([\w\d]+)/g;
const SERVICE_AGENT_CHANGE_REGEX = /ServiceAgentChange\/([\w\d]+)/g;
const BRACKETS_REGEX = /[(\[)(\])]/g;

class Notifications extends Component {
    state = {
        readNotificationAlert: false,
        allNotifications: [],
        allNotificationsCount: 0,
        lastPageReached: false,
        currentOffset: 0,
        productPageSize: 50,
        loadingResults: false,
        count: 0,
    };

    getAllNotificationsCount = () => {
        axios
            .get(`${baseUrl}message/notif/count`)
            .then((res) => {
                this.setState({ allNotificationsCount: res.data.data });
            })
            .catch((error) => {
                console.log("count error ", error.message);
            });
    };

    getNotifications = () => {
        let newOffset = this.state.currentOffset;
        axios
            .get(
                `${baseUrl}message/notif?offset=${this.state.currentOffset}&size=${this.state.productPageSize}`
            )
            .then((res) => {
                this.setState({
                    allNotifications: this.state.allNotifications.concat(res.data.data),
                    loadingResults: false,
                    lastPageReached: res.data.data.length === 0 ? true : false,
                });
            })
            .catch((error) => {
                console.log("notif error ", error.message);
            });

        this.setState({
            currentOffset: newOffset + this.state.productPageSize,
        });
    };

    messageRead = (messageId) => {
        if (!messageId) return;

        const payload = {
            msg_id: messageId,
        };

        axios
            .post(`${baseUrl}message/read`, payload)
            .then(
                (response) => {
                    if (response.status === 200) {
                        this.setState({ readNotificationAlert: true });
                    }
                },
                (error) => {}
            )
            .catch((error) => {
                this.setState({ readNotificationAlert: false });
            });
    };

    handleTrackProduct = (message) => {
        if (!message) return;
        this.props.trackingCallback("");

        if (message.entity_as_json) {
            const payload = {
                product_id: message.entity_as_json._key,
            };
            this.trackProduct(payload);
        }
    };

    trackProduct = (payload) => {
        axios
            .post(`${baseUrl}product/track`, payload)
            .then((res) => {
                if (res.status === 200) {
                    this.props.trackingCallback("success");
                }
            })
            .catch((error) => {
                this.props.trackingCallback("fail");
            });
    };

    handleUnTrackProduct = (message) => {
        if (!message) return;
        this.props.trackingCallback("");

        if (message.entity_as_json) {
            this.unTrackProduct(message.entity_as_json._key);
        }
    };

    unTrackProduct = (productKey) => {
        if (!productKey) return;
        axios
            .delete(`${baseUrl}product/track/${productKey}`)
            .then((res) => {
                if (res.status === 200) {
                    this.props.trackingCallback("un-track-success");
                }
            })
            .catch((error) => {
                this.props.trackingCallback("un-track-fail");
            });
    };

    handleReadUnreadLength = (notifications) => {
        if (notifications.length > 0) {
            let isRead = [];
            _.forEach(notifications, function (item) {
                let read_flag = item.orgs[0].read_flag;
                if (read_flag) {
                    isRead.push(read_flag.flag);
                }
            });
            return isRead.length;
        } else {
            return;
        }
    };

    checkNotifications = (item, index) => {
        if (!item) return;

        const { message, orgs } = item;
        let text;

        let flags;
        orgs.forEach((e, i) => {
            if(e.actor === "message_to") {
                if(e.org.org._id === this.props.userDetail.orgId) {
                    if(e.read_flag && e.read_flag !== null) {
                        if(e.read_flag.flag && e.read_flag.flag !== null) {
                            flags = e.read_flag.flag;
                        }
                    }
                }
            }
        });

        const readTime =
            orgs.length > 0 &&
            orgs
                .filter((org) => org.read_flag)
                .filter((org) => org.org._id === this.props.userDetail.orgId)
                .map((org) => org.read_flag)[0];
        const messageId = item.message._id;

        text = reactStringReplace(message.text, ORG_REGEX, (match, i) => (
            <Org key={i + Math.random() * 100} orgId={match} />
        ));

        text = reactStringReplace(text, PRODUCT_REGEX, (match, i) => (
            <>
                <span>Product </span>
                <Link
                    key={i + Math.random() * 101}
                    to={`product/${match}`}
                    onClick={() => this.messageRead(messageId)}>
                    <u className="blue-text">Link</u>
                </Link>
            </>
        ));

        text = reactStringReplace(text, CYCLE_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 102}
                to={`cycle/${match}`}
                onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">Cycle</u>
            </Link>
        ));

        text = reactStringReplace(text, MATCH_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 103}
                to={`matched/${match}`}
                onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">Match</u>
            </Link>
        ));

        text = reactStringReplace(text, PRODUCT_RELEASE_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 104}
                to="/approve?tab=0"
                onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">To Approvals Page</u>
            </Link>
        ));

        text = reactStringReplace(text, SERVICE_AGENT_CHANGE_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 105}
                to="/approve?tab=2"
                onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">To Approvals Page</u>
            </Link>
        ));

        text = reactStringReplace(text, PRODUCT_REGISTRATION, (match, i) => (
            <Link
                key={i + Math.random() * 106}
                to="/approve?tab=1"
                onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">To Approvals Page</u>
            </Link>
        ));

        return (
            <Card
                key={index}
                variant="outlined"
                className="mb-2"
                style={{ opacity: `${flags ? "0.5" : "1"}` }}>
                <CardContent>
                    <div className="row">
                        <div className="col-12">
                            <NotIcon
                                style={{
                                    color: flags ? "#eee" : "var(--lc-pink)",
                                    float: "left",
                                    marginRight: "15px",
                                    marginTop: "3px",
                                }}
                            />
                            <div style={{ float: "left", marginBottom: "0" }}>{text}</div>

                            <span className="text-mute time-text">
                                <span className="mr-4">
                                    {moment(message._ts_epoch_ms).fromNow()}
                                </span>
                                <span className="">
                                    {readTime
                                        ? `Read: ${moment(readTime.ts_epoch_ms).fromNow()}`
                                        : ""}
                                </span>
                                {!readTime ? (
                                    <span
                                        onClick={() => this.messageRead(messageId)}
                                        style={{ cursor: "pointer" }}>
                                        Mark as read
                                    </span>
                                ) : null}
                                {item.options && !item.options.is_owned && (
                                    <React.Fragment>
                                        {message.text.match(PRODUCT_REGEX) &&
                                        !item.options.is_tracked ? (
                                            <span
                                                className="ml-4 blue-text"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => this.handleTrackProduct(message)}>
                                                <b>Track</b>
                                            </span>
                                        ) : (
                                            <span
                                                className="ml-4 text-danger"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => this.handleUnTrackProduct(message)}>
                                                <b>Un-track</b>
                                            </span>
                                        )}
                                    </React.Fragment>
                                )}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    componentDidMount() {
        // this.props.getNotifications();
        this.setState({ allNotifications: [] });
        this.getAllNotificationsCount();
        // this.getNotifications();
        // this.timer = setInterval(this.getNotifications, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <div>
                <Snackbar
                    open={this.state.readNotificationAlert}
                    autoHideDuration={6000}
                    onClick={() => this.setState({ readNotificationAlert: false })}
                    onClose={() => this.setState({ readNotificationAlert: false })}>
                    <Alert severity="success">Notification marked as read.</Alert>
                </Snackbar>

                <h5 className="blue-text mb-4">
                    <span className="mr-3">
                        {this.state.allNotifications.length <= 0
                            ? "..."
                            : this.state.allNotifications.length}{" "}
                        of {this.state.allNotificationsCount}
                    </span>
                    <span className="text-muted">
                        Read{" "}
                        {this.state.allNotifications.length <= 0
                            ? "..."
                            : this.handleReadUnreadLength(this.state.allNotifications)}
                    </span>
                </h5>
                <div className="notification-content">
                    <PaginationLayout
                        loadingResults={this.state.loadingResults}
                        lastPageReached={this.state.lastPageReached}
                        loadMore={this.getNotifications}>
                        {this.state.allNotifications.length > 0
                            ? this.state.allNotifications.map((item, index) => {
                                  return this.checkNotifications(item, index);
                              })
                            : "No notifications... "}
                    </PaginationLayout>
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
        // getNotifications: (data) => dispatch(actionCreator.getNotifications(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
