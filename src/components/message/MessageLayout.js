import React, { Component } from "react";
import Messages from "./Messages";
import Sidebar from "../../views/menu/Sidebar";
import HeaderDark from "../../views/header/HeaderDark";
import PageHeader from "../PageHeader";
import "./messages.css";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import { unreadMessages } from "../../store/actions/actions";
import { GET_MESSAGES, LOCAL_STORAGE_MESSAGE_TIMESTAMP } from "../../store/types";
import { getMessages } from "../../store/actions/actions";
import { messageAlert } from "../../store/actions/actions";
import SendMessage from "@material-ui/icons/Send";

class MessageLayout extends Component {

    state = {
        allOrgs: [],
        sendMessageModal: false,
        openedChat:null
    };

    getAllOrgs = () => {

        axios
            .get(`${baseUrl}org/all`)
            .then((response) => {
                this.setState({ allOrgs: response.data });
            })
            .catch((error) => {});
    };

    handleHideMessageModal = () => this.setState({ sendMessageModal: false });
    handleShowMessageModal = () => this.setState({ sendMessageModal: true });

    handleDeleteMessage = (key) => {
        // console.log("[Messages.js] ", key);
    };


    componentDidMount() {
        this.props.getMessages();

        this.timer = setInterval(this.props.getMessages, 10000);

        this.getAllOrgs();

        console.log( "old msghs")
        console.log( this.props.messages)

    }


    chats=[

        { "id":1,"from":"xyz",messages:[

                {"id":12121,content:"How are you", time:"11:47 pm", type:"sent"},
                {"id":1121,content:"I am good. What about you", time:"12:47 am", type:"recieved"},
                {"id":34,content:"I am good. What about you", time:"12:47 am", type:"recieved"},


            ]  },
        { "id":2,"from":"abce",messages:[

                {"id":12121,content:"Hey WhatsUp", time:"11:47 pm", type:"sent"},
                {"id":1121,content:"I am good. What about you", time:"12:47 am", type:"recieved"},
                {"id":34,content:"I am good. What about you", time:"12:47 am", type:"recieved"},


            ]  },

    ]






    getAllMsgs(){


        axios.get(`${baseUrl}message`)
            .then(response => {

                // dispatch({type: GET_MESSAGES, value: response.data.data})


            }, error => {

            })
            .catch(error => {

            })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }
    selectChat(event){


        let chat=this.chats.filter((item)=>  item.id==event.currentTarget.dataset.id)[0]

        console.log(chat)

        this.setState({

            openedChat:chat
        })





    }

    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper homepage">
                    <HeaderDark />

                    <div className="container container-message   pb-4 pt-4">
                        <div className="row">
                            <div className="col">
                                <PageHeader pageTitle={"Messages ("+ this.props.messages.length+")"} subTitle="Send or receive messages here" />
                            </div>
                        </div>

                        <div className="row no-gutters">
                            <div className="col">

                                <div className="messaging">
                                    <div className="inbox_msg">
                                        <div className="inbox_people">
                                            <div className="headind_srch">

                                                <div className="srch_bar">
                                                    <div className="stylish-input-group">
                                                        <input type="text" className="search-bar"  placeholder="Search" />
                                                        <span className="input-group-addon">
                <button type="button">
                    <i className="fa fa-search" aria-hidden="true"></i> </button>
                </span> </div>
                                                </div>
                                            </div>
                                            <div className="inbox_chat">


                                                {this.chats.map((item, index) =>

                                                    <div data-id={item.id} onClick={this.selectChat.bind(this)}
                                                         className={this.state.openedChat&&this.state.openedChat.id===item.id?"chat_list active_chat":"chat_list"}>
                                                        <div className="chat_people">
                                                            <div className="chat_img">
                                                                <figure className="avatar avatar-chat border-0">
                                                                <span className={"word-user"}>
                                                                    {item.from.substr(0, 2)}
                                                                </span>
                                                                </figure>
                                                            </div>
                                                            <div className="chat_ib">
                                                                <h5>{item.from} <span className="chat_date">{item.messages[0].time}</span>
                                                                </h5>
                                                                <p>{item.messages[0].content}</p>

                                                            </div>
                                                        </div>

                                                    </div>
                                                ) }


                                            </div>
                                        </div>
                                        {this.state.openedChat &&
                                        <div className="mesgs">
                                            <div className="msg_history">


                                                {this.state.openedChat.messages.map((item)=>
                                                    <>


                                                        {item.type === "recieved" ?
                                                            <div className="incoming_msg">
                                                                <div className="incoming_msg_img">
                                                                    <figure className="avatar avatar-chat border-0">
                                                                <span className={"word-user"}>
                                                                    {this.state.openedChat.from.substr(0, 2)}
                                                                </span>
                                                                    </figure>
                                                                </div>
                                                                <div className="received_msg">
                                                                    <div className="received_withd_msg">
                                                                        <p>{item.content}</p>
                                                                        <span
                                                                            className="time_date"> {item.time}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : <div className="outgoing_msg">
                                                                <div className="sent_msg">
                                                                    <p>{item.content}</p>
                                                                    <span
                                                                        className="time_date">{item.time}</span>
                                                                </div>
                                                            </div>
                                                        }

                                                    </>
                                                )}
                                            </div>
                                            <div className="type_msg">
                                                <div className="input_msg_write">
                                                    <input type="text" className="write_msg" placeholder="Type a message"/>
                                                    <button className="msg_send_btn" type="button">
                                                        <SendMessage />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        }
                                    </div>



                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>

        )}
}


const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        messages: state.messages,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMessages: () => dispatch(actionCreator.getMessages()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageLayout);
