import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import HeaderWhiteBack from "../header/HeaderWhiteBack";
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import ResourceItem from "../item/ResourceItem";

import { ChatController, MuiChat } from "chat-ui-react";

class MessageSeller extends Component {
    slug;

    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
        };

        this.slug = props.match.params.slug;
        this.getResource = this.getResource.bind(this);
    }

    getResource() {
        axios
            .get(baseUrl + "resource/" + this.slug, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var response = response.data;

                    this.setState({
                        item: response.content,
                    });
                },
                (error) => {
                    var status = error.response.status;
                }
            );
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };

    componentWillMount() {}

    componentDidMount() {
        this.getResource();
    }

    render() {
        return (
            <div>
                <HeaderWhiteBack
                    history={this.props.history}
                    heading={this.state.item && this.state.item.name}
                />

                <div className="container   pb-4 ">
                    {this.state.item && <ResourceItem item={this.state.item} />}
                    <div className="row   ">
                        <div className={"message-container col-12"}>
                            <ChatBox />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function ChatBox(props) {
    const [chatCtl] = React.useState(new ChatController());

    React.useMemo(async () => {
        // Chat content is displayed using ChatController

        // await chatCtl.addMessage({
        //     type: 'text',
        //     content: `Select a message or write your own below.`,
        //     self: false,
        // });
        // const name1 = await chatCtl.setActionRequest({ type: 'text',always:true });
        //
        const response = await chatCtl.setActionRequest({
            type: "text",
            always: true,
        });

        // const response = await chatCtl.setActionRequest({
        //     // type: 'select',
        //     type: 'multi-select',
        //
        //     always: true,
        //     options: [
        //         {
        //             value: 'a',
        //             text: 'A',
        //         },
        //         {
        //             value: 'b',
        //             text: 'B',
        //         },
        //     ],
        // });

        // const response = await chatCtl.setActionRequest({
        //     type: 'Select a message or write your own below.',
        //     options: [
        //         {
        //             value: 'a',
        //             text: 'Hi, is this available still?',
        //         },
        //         {
        //             value: 'b',
        //             text: 'Hi, is this available still?',
        //         },
        //     ],
        // });

        // const name2 = await chatCtl.setActionRequest({ type: 'text' });

        // const response = await chatCtl.setActionRequest({
        //     type: 'audio',
        // });
    }, [chatCtl]);

    // Only one component used for display
    return <MuiChat chatController={chatCtl} />;
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(MessageSeller);
