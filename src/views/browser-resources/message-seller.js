import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import HeaderWhiteBack from '../header/HeaderWhiteBack'
import { baseUrl } from "../../Util/Constants";
import axios from "axios/index";
import ResourceItem from '../item/ResourceItem'
import { ChatController, MuiChat } from 'chat-ui-react'


class MessageSeller extends Component {

    slug;

    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null
        }


        this.slug = props.match.params.slug
        this.getResource = this.getResource.bind(this)

    }




    getResource() {


        axios.get(baseUrl + "resource/" + this.slug,
            {
                headers: {
                    "Authorization": "Bearer " + this.props.userDetail.token
                }
            }
        )
            .then((response) => {

                var response = response.data;
                console.log("detail resource response")
                console.log(response)


                this.setState({

                    item: response.content
                })

            },
                (error) => {

                    var status = error.response.status

                    console.log("resource error")

                    console.log(error)


                }
            );

    }



    handleBack = () => {
        this.props.history.goBack()
    }

    handleForward = () => {
        console.log(this.props.history)
        this.props.history.go(+1)
    }



    componentWillMount() {

    }

    componentDidMount() {

        this.getResource()

    }





    render() {

        return (
            <div>

                <HeaderWhiteBack history={this.props.history} heading={this.state.item && this.state.item.name} />


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

        const response = await chatCtl.setActionRequest({
            type: 'text',
            always: true,
        });



    }, [chatCtl]);

    // Only one component used for display
    return <MuiChat chatController={chatCtl} />;
}







const mapStateToProps = state => {
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






const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),

    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(MessageSeller);
