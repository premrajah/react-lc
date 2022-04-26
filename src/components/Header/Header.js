import React from "react";
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import IndexNavbar from "../Navbars/IndexNavbar";
import history from "../../History/history";
import Sidebar from "../Sidebar/Sidebar";
import {baseUrl} from "../../Util/Constants";
import axios from "axios";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Cancel from '@mui/icons-material/Logout';
import {getKey} from "../../LocalStorage/user-session";


class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            image:null,
            firstLogin:false,
            showDetails:false
        };
        this.goToInbox = this.goToInbox.bind(this);
        this.showLoginPopUp = this.showLoginPopUp.bind(this);

    }

    goToInbox() {
        history.push("/inbox");
    }

    toggleMenu = (event) => {
        document.body.classList.add("sidemenu-open");
    };



    showLoginPopUp() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        }
    }

    getArtifactForOrg = () => {
        let url = `${baseUrl}org/${encodeURIComponent(this.props.userDetail.orgId)}/artifact`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {

                    this.setState({
                        image:response.data.data[0].blob_url
                    })
                }
            })
            .catch((error) => {});
    };



    componentDidMount() {
        if (this.props.isLoggedIn) {

            this.getArtifactForOrg()
        }
    }



    render() {
        return (

            <>
                <div id="back-to-top-anchor">
                    <Sidebar image={this.state.image} />
                    <IndexNavbar image={this.state.image} />

                </div>

                {this.props.isLoggedIn&&getKey("assumedRole") && <AssumeRoleFloatingActionBtn logOut={()=>this.props.logOut()}/>}

                </>
        );
    }
}




 function AssumeRoleFloatingActionBtn(props) {
    return (
        <Box className={"assumerole-btn"} sx={{ '& > :not(style)': { m: 1 } }}>

            <Fab onClick={props.logOut} variant="extended">
                <Cancel sx={{ mr: 1 }} />
                {getKey("roleName")}

            </Fab>

        </Box>
    );
}
const mapStateToProps = (state) => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        // loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Header);
