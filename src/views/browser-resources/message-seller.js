import React, {Component, Fragment, useState} from 'react';

import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import Logo from '../../img/logo-2x.png';
import LogoSmall from '../../img/logo-small.png';
import LogoNew from '../../img/logo-cropped.png';

import LogoText from '../../img/logo-text.png';
import PhoneHome from '../../img/phone-home.png';
import BikeHome from '../../img/bike-home.png';
import LoopHome from '../../img/LoopHome.png';

import clsx from 'clsx';
import SearchIcon from '../../img/icons/search-big-gray.png';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import MoreIcon from '@material-ui/icons/MoreVert';
import AppBar from '@material-ui/core/AppBar';
import ShippingIcon from '../../img/icons/shipping-icon.png';
import ShippingWhite from '../../img/icons/truck.png';
import SettingsWhite from '../../img/icons/settings-24px.png';
import HandWhite from '../../img/icons/hand-white.png';
import Cube from '../../img/icons/cube.png';
import SearchWhite from '../../img/icons/search-white.png';
import VerticalLines from '../../img/icons/vertical-lines.png';
import Rings from '../../img/icons/rings.png';
import FilterImg from '../../img/icons/filter-icon.png';
import TescoImg from '../../img/tesco.png';


import Twitter from '../../img/icons/twitter.png';
import Insta from '../../img/icons/insta.png';
import { Router, Route, Switch , Link} from "react-router-dom";

import LangIcon from '../../img/icons/lang.png';
import MarkerIcon from '../../img/icons/marker.png';
import CalenderIcon from '../../img/icons/calender.png';
import HandGreyIcon from '../../img/icons/hand-gray.png';
import EditGray from '../../img/icons/edit-gray.png';
import RingGray from '../../img/icons/ring-gray.png';
import ListIcon from '../../img/icons/list.png';
import AmountIcon from '../../img/icons/amount.png';
import StateIcon from '../../img/icons/state.png';
import PaperImg from '../../img/paper-big.png';

import HeaderWhiteBack from '../header/HeaderWhiteBack'
import Sidebar from '../menu/Sidebar'

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import Camera from '@material-ui/icons/CameraAlt';

import { Col, Form, Button, Nav, NavDropdown, Dropdown, DropdownItem, Row, ButtonGroup, Navbar} from 'react-bootstrap';


import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchGray from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/Filter';
import Close from '@material-ui/icons/Close';
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import Moment from 'react-moment';
import ResourceItem from  '../item/ResourceItem'
import { withRouter } from 'react-router-dom'

// import { ThemeProvider, MessageGroup,Message,MessageText,MessageMedia,MessageList,MessageTitle,MessageButton,MessageButtons} from '@livechat/ui-kit'
// import { ChatFeed, Message } from 'react-chat-ui'
// import 'react-chat-elements/dist/main.css';
// // MessageBox component
// import { MessageBox,Message } from 'react-chat-elements';


import { ChatController,MuiChat } from 'chat-ui-react'


class  MessageSeller extends Component {

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
        this.getResource=this.getResource.bind(this)



    }




    getResource(){


        axios.get(baseUrl+"resource/"+this.slug,
            {
                headers: {
                    "Authorization" : "Bearer "+this.props.userDetail.token
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



    componentWillMount(){

    }

    componentDidMount(){

        this.getResource()

    }





    render() {

        return (
            <div>

                <HeaderWhiteBack history={this.props.history} heading={this.state.item&&this.state.item.name}/>


                <div className="container   pb-4 ">

                    {this.state.item&&<ResourceItem item={this.state.item}/>}
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
            type: 'text',
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
