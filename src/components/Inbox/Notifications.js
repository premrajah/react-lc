import React, {Component} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import * as actionCreator from "../../store/actions/actions";
import reactStringReplace from "react-string-replace";
import {Card, CardContent, Snackbar} from "@material-ui/core";
import NotIcon from "@material-ui/icons/Notifications";
import moment from "moment/moment";
import Org from "../Org/Org";
import {Link} from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import _ from 'lodash';

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
    }

    messageRead = (messageId) => {
        if(!messageId) return;

        const payload = {
            "msg_id": messageId
        }

        axios.post(`${baseUrl}message/read`, payload)
            .then(response => {
                if(response.status === 200) {
                    this.setState({readNotificationAlert: true});
                }
            }, (error) => {})
            .catch(error => {
                this.setState({readNotificationAlert: false});
            })
    }

    handleTrackProduct = (message) => {
        if(!message) return;
        this.props.trackingCallback('')

        if(message.entity_as_json) {
            const payload = {
                "product_id": message.entity_as_json._key
            }
            this.trackProduct(payload);
        }
    }



    trackProduct = (payload) => {
        axios.post(`${baseUrl}product/track`, payload)
            .then(res => {
                if(res.status === 200) {
                    this.props.trackingCallback('success')
                }
            })
            .catch(error => {
                this.props.trackingCallback('fail')
            })
    }

    handleUnTrackProduct = (message) => {
        if(!message) return;
        this.props.trackingCallback('');

        if(message.entity_as_json) {
            this.unTrackProduct(message.entity_as_json._key);
        }
    }

    unTrackProduct = (productKey) => {
        if(!productKey) return;
        axios.delete(`${baseUrl}product/track/${productKey}`)
            .then(res => {
                if(res.status === 200) {
                    this.props.trackingCallback('un-track-success')
                }
            })
            .catch(error => {
                this.props.trackingCallback('un-track-fail')
            })
    }

    handleReadUnreadLength = (notifications) => {
        if(notifications.length > 0) {

            let isRead = [];
            _.forEach(notifications, function(item){
                let read_flag = item.orgs[0].read_flag;
                if(read_flag) {
                    isRead.push(read_flag.flag);
                }
            })
            return isRead.length;
        } else {
            return;
        }

    }


    checkNotifications = (item, index) => {
        if (!item) return;

        const { message, orgs } = item;
        let text;
        
        const flags = orgs.length > 0 && orgs.filter(org => org.read_flag).filter(org => org.org._id === this.props.userDetail.orgId).map(org => org.read_flag).map(f => f.flag)[0];
        const readTime = orgs.length > 0 && orgs.filter(org => org.read_flag).filter(org => org.org._id === this.props.userDetail.orgId).map(org => org.read_flag)[0];
        const messageId = item.message._id;



        text = reactStringReplace(message.text, ORG_REGEX, (match, i) => (
            <Org key={i + Math.random() * 100} orgId={match} />
        ));

        text = reactStringReplace(text, PRODUCT_REGEX, (match, i) => (
            <>
                <span>Product </span>
                <Link key={i + Math.random() * 101} to={`product/${match}`} onClick={() => this.messageRead(messageId)}>
                    <u className="blue-text">Link</u>
                </Link>
            </>
        ));

        text = reactStringReplace(text, CYCLE_REGEX, (match, i) => (
            <Link key={i + Math.random() * 102} to={`cycle/${match}`} onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">Cycle</u>
            </Link>
        ));

        text = reactStringReplace(text, MATCH_REGEX, (match, i) => (
            <Link key={i + Math.random() * 103} to={`match/${match}`} onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">Match</u>
            </Link>
        ));

        text = reactStringReplace(text, PRODUCT_RELEASE_REGEX, (match, i) => (
            <Link key={i + Math.random() * 104} to="/approve?tab=0" onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">To Approvals Page</u>
            </Link>
        ));

        text = reactStringReplace(text, SERVICE_AGENT_CHANGE_REGEX, (match, i) => (
            <Link key={i + Math.random() * 105} to="/approve?tab=2" onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">To Approvals Page</u>
            </Link>
        ));

        text = reactStringReplace(text, PRODUCT_REGISTRATION, (match, i) => (
            <Link key={i + Math.random() * 106} to="/approve?tab=1" onClick={() => this.messageRead(messageId)}>
                <u className="blue-text">To Approvals Page</u>
            </Link>
        ));



        return (
            <Card key={message._ts_epoch_ms} variant="outlined" className="mb-2" style={{opacity: `${flags ? '0.5' : '1'}` }}>
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
                                <span className="mr-4">{moment(message._ts_epoch_ms).fromNow()}</span>
                                <span className="">{readTime ? `Read: ${moment(readTime.ts_epoch_ms).fromNow()}` : ''}</span>
                                {!readTime ? <span onClick={() => this.messageRead(messageId)} style={{cursor: 'pointer'}}>Mark as read</span> : null}
                                { (item.options && !item.options.is_owned) && <React.Fragment>
                                    {
                                        (message.text.match(PRODUCT_REGEX) && !item.options.is_tracked)
                                        ? <span className="ml-4 blue-text" style={{cursor: 'pointer'}}
                                                onClick={() => this.handleTrackProduct(message)}><b>Track</b></span>
                                        : <span className="ml-4 text-danger" style={{cursor: 'pointer'}}
                                                onClick={() => this.handleUnTrackProduct(message)}><b>Un-track</b></span>
                                    }
                                </React.Fragment>

                                }
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
                <Snackbar open={this.state.readNotificationAlert} autoHideDuration={6000} onClick={() => this.setState({readNotificationAlert: false})} onClose={() => this.setState({readNotificationAlert: false})}>
                    <Alert  severity="success">Notification marked as read.</Alert>
                </Snackbar>

                <h5 className="blue-text mb-4">
                    <span className="mr-3">Total {this.props.notifications.length <= 0 ? "..." : this.props.notifications.length}</span>
                    <span className="text-muted">Read {this.props.notifications.length <= 0 ? "..." : this.handleReadUnreadLength(this.props.notifications)}</span>
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
