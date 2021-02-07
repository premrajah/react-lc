import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { baseUrl } from "../../Util/Constants";
import NotificationItem from "./NotificationItem";
import _ from "lodash";
import Org from "../Org/Org";
import * as url from "url";
import { Link } from "react-router-dom";
import NotIcon from '@material-ui/icons/Notifications';
import moment from "moment";
import { Alert ,Card} from 'react-bootstrap';


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
            .catch((error) => {

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

                    this.getNotifications(this.props.userDetail);
                }
            })
            .catch((error) => {

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

                   <div className={"row list-group-item list-group-item-action mt-2 "} style={{display:"flex"}}>

                       <div className={"col-9  "}>
                           <NotIcon className={"text-left mr-2"} style={{color:"#eee",float:"left"}}/>

                           <SearchLinks text={message.text} />

                       </div>

                       <div className={"col-3  text-right"}>
                           {/*{moment(message._ts_epoch_ms).format("h:mm:ss a DD MMM YYYY")}*/}

                           {moment(message._ts_epoch_ms).fromNow()}


                       </div>

                       </div>

               </div>

        );
    };

    componentDidMount() {
        this.getNotifications(this.props.userDetail);
        this.updateNotifications()
    }



    interval
    updateNotifications(){

    this.interval = setInterval(() => {



        this.getNotifications(this.props.userDetail)

    }, 10000);



}



componentWillUnmount() {

    clearInterval(this.interval)
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

    let startText;
    let endText;
    let id
    let changed=false

    if (text.indexOf("Cycle/")>=0){

        let  start= text.indexOf("Cycle/")
        let end = text.indexOf(" ",start)>=0?text.indexOf(" ",start):text.length

        let replacementText = text.substr(start-6,end)
         id = text.substr(start+6,end)


         // startText = text.substr(0,start-7)
         // endText = text.substr(end,text.length)

        text = text.replace(replacementText,"<a  class='green-link-url' href='/cycle/"+id+"'>Cycle</Link>")

        //

        changed=true

    }


    // if (text.indexOf("Product/")>=0){
    //
    //     let  start= text.indexOf("Product/")
    //     let end = text.indexOf(" ",start)
    //
    //     let replacementText = text.substr(start,end)
    //     id = text.substr(start,end)
    //
    //
    //     // startText = text.substr(0,start-8)
    //     // endText = text.substr(end,text.length)
    //
    //     text = text.replace(replacementText,"<a class='green-link-url' href='/product/"+id+"'>Product</Link>")
    //
    //
    //
    //     changed=true
    //
    // }


    return (<div dangerouslySetInnerHTML={createMarkup(text)}/>);

    // return (<>
    //
    //
    //     </>
    //     );



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
