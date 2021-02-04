import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { baseUrl } from "../../Util/Constants";
import NotificationItem from "./NotificationItem";
import _ from "lodash";
import { Link } from "@material-ui/core";
import Org from "../Org/Org";
import * as url from "url";

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

                console.log(response.data.data)
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
                    console.log("deleted?");
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




        // text.replaceAll(REGEX_ID_ARRAY, (m, p1, p2, i, x) => {
        //     // NOTE: <Kind>/<_key> is the full <_id>. E.g. Cycle/cycle-12344
        //     // PI = <Kind>, P2 = <_key>, M = <_id>
        //     // If P1 == Org => Created Org Component.
        //     // If P1 is in selection list (Product, Cycle, Match) => create Link Component
        //     // Else => just return {m}
        //
        //     // return `${'/' + p1 + '/' + p2} -> ${m}`
        //
        // })





        return (
            // <NotificationItem
            //     editText={editedText}
            //     item={item}
            //     key={message._key}
            //     onClose={this.handleDeleteNotification}
            // />

               <div key={message._key}>

                   <SearchLinks text={message.text} />

               </div>

        );
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


function createMarkup(text) {
    return {__html: text};
}

function SearchLinks(props) {

    let text = props.text

    if (text.indexOf("Cycle/")>=0){

        let  start= text.indexOf("Cycle/")
        let end = text.indexOf(" ",start)>=0?text.indexOf(" ",start):text.length

        let replacementText = text.substr(start,end)
        let id = text.substr(start+6,end)


        text = text.replace(replacementText,"<a href='/cycle/"+id+"'>Visit</a>")

        console.log(start,end)


    }


    return (<div dangerouslySetInnerHTML={createMarkup(text)}/>);


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
