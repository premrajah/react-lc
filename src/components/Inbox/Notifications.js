import React, {Component} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {baseUrl, createMarkup} from "../../Util/Constants";
import reactStringReplace from "react-string-replace";
import {Card, CardContent, Snackbar} from "@mui/material";
import NotIcon from "@mui/icons-material/HdrWeak";
import moment from "moment/moment";
import Org from "../Org/Org";
import {Link} from "react-router-dom";
import Alert from "@mui/material/Alert";
import _ from "lodash";
import PaginationLayout from "../IntersectionOserver/PaginationLayout";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import CustomPopover from "../FormsUI/CustomPopover";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import {CheckCircle} from "@mui/icons-material";


const REGEX_ID_ARRAY = /([\w\d]+)\/([\w\d-]+)/g;
const ORG_REGEX = /(Org\/[\w\d-]+)/g;
const PRODUCT_REGEX = /Product\/([\w\d]+)/g;
const CYCLE_REGEX = /Cycle\/([\w\d]+)/g;
const MATCH_REGEX = /Match\/([\w\d]+)/g;
const PRODUCT_RELEASE_REGEX = /ProductRelease\/([\w\d]+)/g;
const PRODUCT_REGISTRATION = /ProductRegistration\/([\w\d]+)/g;
const SERVICE_AGENT_CHANGE_REGEX = /ServiceAgentChange\/([\w\d]+)/g;
const BRACKETS_REGEX = /[(\[)(\])]/g;
const A_TAG_REGEX = /\<a(.*)\<\/a\>"/g;
const LISTING_REGEX = /Listing\/([\w\d]+)/g;
const SEARCH_REGEX = /Search\/([\w\d]+)/g;

class Notifications extends Component {
    state = {
        readNotificationAlert: false,
        allNotifications: [],
        allNotificationsCount: 0,
        lastPageReached: false,
        currentOffset: 0,
        productPageSize: 20,
        loadingResults: false,
        count: 0,
        activeReleaseTabKey:"1",
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
        this.setState({

            loadingResults: true
        })

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
    setActiveReleaseTabKey=(event,key)=>{


        this.setState({
            activeReleaseTabKey:key
        })


    }

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

                <Link
                    key={i + Math.random() * 101}
                    to={`product/${match}`}
                    onClick={() => this.messageRead(messageId)}>
                    View Product
                </Link>
            </>
        ));

        text = reactStringReplace(text, CYCLE_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 102}
                to={`cycle/${match}`}
                onClick={() => this.messageRead(messageId)}>
                Cycle
            </Link>
        ));

        text = reactStringReplace(text, MATCH_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 103}
                to={`matched/${match}`}
                onClick={() => this.messageRead(messageId)}>
                Match
            </Link>
        ));

        text = reactStringReplace(text, PRODUCT_RELEASE_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 104}
                to="/approve?tab=0"
                onClick={() => this.messageRead(messageId)}>
                To Approvals Page
            </Link>
        ));

        text = reactStringReplace(text, SERVICE_AGENT_CHANGE_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 105}
                to="/approve?tab=2"
                onClick={() => this.messageRead(messageId)}>
                To Approvals Page
            </Link>
        ));

        text = reactStringReplace(text, PRODUCT_REGISTRATION, (match, i) => (
            <Link
                key={i + Math.random() * 106}
                to="/approve?tab=1"
                onClick={() => this.messageRead(messageId)}>
                To Approvals Page
            </Link>
        ));

        text = reactStringReplace(text, A_TAG_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 107}
                to="/account?page=system-users"
                onClick={() => this.messageRead(messageId)}>
                User Approvals
            </Link>
        ))

        text = reactStringReplace(text, LISTING_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 108}
                to={`/${match}`}
                onClick={() => this.messageRead(messageId)}>
                Listing
            </Link>
        ));

        text = reactStringReplace(text, SEARCH_REGEX, (match, i) => (
            <Link
                key={i + Math.random() * 109}
                to={`/search/${match}`}
                onClick={() => this.messageRead(messageId)}>
                Search
            </Link>
        ));

        return (
            <Card
                key={index}
                variant="outlined"
                className="mb-3 rad-8  bg-white  "
                // style={{ opacity: `${flags ? "0.5" : "1"}` }}
            >


                <CardContent className={"hover-bg"}>
                    <div className="row ">
                        <div className="col-11">
                            <NotIcon
                                style={{
                                    color: flags ? "#eee" : "var(--lc-purple)",
                                    float: "left",
                                    marginRight: "15px",
                                    marginTop: "3px",
                                }}
                            />

                            {/*{text.includes("account") !== -1?*/}
                            {/*    <div*/}
                            {/*        className={"has-link"}*/}
                            {/*    dangerouslySetInnerHTML={createMarkup(*/}
                            {/*        text*/}
                            {/*    )} ></div>:*/}
                            <div >{text}</div>
                            {/*}*/}

                            <span className="text-gray-light time-text">
                                <span className="mr-4">
                                    {moment(message._ts_epoch_ms).fromNow()}
                                </span>
                                {/*<span className="">*/}
                                {/*    {readTime*/}
                                {/*        ? `Read: ${moment(readTime.ts_epoch_ms).fromNow()}`*/}
                                {/*        : ""}*/}
                                {/*</span>*/}
                                {/*{!readTime ? (*/}
                                {/*    <span*/}
                                {/*        onClick={() => this.messageRead(messageId)}*/}
                                {/*        style={{ cursor: "pointer" }}>*/}
                                {/*        Mark as read*/}
                                {/*    </span>*/}
                                {/*) : null}*/}
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
                                            item.options.is_tracked && <span
                                                className="ml-4 text-danger"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => this.handleUnTrackProduct(message)}>
                                                <b>Un-track</b>
                                            </span>
                                        )}
                                    </React.Fragment>
                                )}
                            </span>

                            {/*<Chip*/}

                            {/*    label={"Chip"}*/}

                            {/*/>*/}
                        </div>

                        {!flags &&  <div className="col-1 text-right">
                            <CustomPopover text={"Mark as read"}>

                                <ActionIconBtn
                                    className="ml-4"
                                    onClick={()=>this.messageRead(messageId)}>
                                    <CheckCircle style={{color:"#07AD89"}} />
                                </ActionIconBtn>
                            </CustomPopover>
                        </div>}
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
                    {/*<span className="mr-3">*/}
                    {/*    {this.state.allNotifications.length <= 0*/}
                    {/*        ? "..."*/}
                    {/*        : <span className="mr-1">{this.state.allNotifications.length}</span>}*/}
                    {/*    of {this.state.allNotificationsCount}*/}
                    {/*</span>*/}
                    {/*<span className="text-muted">*/}
                    {/*    <span className="mr-1">Read</span>*/}
                    {/*    {this.state.allNotifications.length <= 0*/}
                    {/*        ? "..."*/}
                    {/*        : this.handleReadUnreadLength(this.state.allNotifications)}*/}
                    {/*</span>*/}
                </h5>
                <div className="notification-content">
                    <div className={"row "}>
                        <div className={"col-12 "}>
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                <TabContext value={this.state.activeReleaseTabKey}>
                                    <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                        <TabList

                                            allowScrollButtonsMobile

                                            scrollButtons="auto"
                                            textColor={"#27245C"}
                                            TabIndicatorProps={{
                                                style: {
                                                    backgroundColor: "#27245C",
                                                    padding: '2px',
                                                }
                                            }}
                                            onChange={this.setActiveReleaseTabKey}

                                            aria-label="lab API tabs example">
                                            <Tab label="All" value="1" />
                                            {/*<Tab label={`Read `} value="2"/>*/}

                                        </TabList>
                                    </Box>

                                    <TabPanel value="1">
                                        <div className={"row  mt-4 "}>
                                            <div className={"col-12 "}>

                                                <PaginationLayout

                                                    visibleCount={this.state.allNotifications.length}
                                                    count={this.state.allNotificationsCount}
                                                    loadingResults={this.state.loadingResults}
                                                    lastPageReached={this.state.lastPageReached}
                                                    loadMore={this.getNotifications}
                                                    hideSearch
                                                >
                                                    <>
                                                        {this.state.allNotifications.length > 0
                                                            ? this.state.allNotifications.map((item, index) => {
                                                                return this.checkNotifications(item, index);
                                                            })
                                                            : "No notifications... "}
                                                    </>
                                                </PaginationLayout>

                                            </div>
                                        </div>

                                    </TabPanel>
                                    {/*<TabPanel value="2">*/}

                                    {/*    <div className={"row  mt-4 "}>*/}
                                    {/*        <div className={"col-12 "}>*/}



                                    {/*        </div>*/}
                                    {/*    </div>*/}

                                    {/*</TabPanel>*/}




                                </TabContext>
                            </Box>
                        </div>

                    </div>



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
