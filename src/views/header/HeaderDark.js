import React, { Component } from 'react';
import { connect } from "react-redux";
import history from "../../History/history";
import IndexNavbar from "../../components/Navbars/IndexNavbar";


class HeaderDark extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }
        this.goToInbox = this.goToInbox.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)

    }


    goToInbox() {

        history.push("/inbox")

    }


    toggleMenu = (event) => {


        document.body.classList.add('sidemenu-open');

    }



    handleSongLoading() {

    }

    handleSongFinishedPlaying() {


    }

    handleSongPlaying() {



    }


    interval


    componentWillMount() {

    }

    componentDidMount() {






    }

    intervalJasmineAnim





    render() {

        return (


            <>
                <IndexNavbar />




            </>





        );
    }
}




const mapStateToProps = state => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter




    };
};

const mapDispachToProps = dispatch => {
    return {





    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(HeaderDark);
