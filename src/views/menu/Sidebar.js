import React, { Component } from 'react';
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Close from '@material-ui/icons/Close';


class Sidebar extends Component {


    constructor(props) {

        super(props)

        this.state = {

            timerEnd: false,
            count: 0,
            nextIntervalFlag: false
        }
        this.toggleMenu = this.toggleMenu.bind(this)
        this.logOut = this.logOut.bind(this)
        this.showLoginPopUp=this.showLoginPopUp.bind(this)
        this.showSignUpPopUp=this.showSignUpPopUp.bind(this)


    }




    toggleMenu = (event) => {


        document.body.classList.remove('sidemenu-open');


    }



    showSignUpPopUp = (event) => {


        document.body.classList.remove('sidemenu-open');

        this.props.setLoginPopUpStatus(1);
        this.props.showLoginPopUp(true);


    }


    showLoginPopUp = (event) => {


        document.body.classList.remove('sidemenu-open');

        this.props.setLoginPopUpStatus(0);
        this.props.showLoginPopUp(true);

    }


    logOut = (event) => {
        document.body.classList.remove('sidemenu-open');
        this.props.logOut()

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


                <div className="sidebar">

                    <div className="row container-black pt-2 pb-2">
                    </div>
                    <div className="sidebar-container">

                        <div className="row mt-3">
                            <div className="col">
                                <a href="javascript:void(0)" className="closesidemenu">
                                    <Close onClick={this.toggleMenu} className="white-text" style={{ fontSize: 32 }} />
                                </a>
                            </div>
                        </div>


                        {this.props.isLoggedIn && <div className="row mt-2">
                            <div className="col">
                                <div className="list-group main-menu">
                                    <Link className="list-group-item list-group-item-action green-text">Hello, {this.props.userDetail.firstName} </Link>


                                </div>
                            </div>
                        </div>
                        }

                        {this.props.isLoggedIn &&<div className="mt-2 mb-3">
                            <div className="row">
                                <div className="col-auto">
                                    <figure className="avatar avatar-60 border-0">


                                         <span className={"word-user-big"}>

                                            {this.props.userDetail&&this.props.userDetail.orgId&&this.props.userDetail.orgId.substr(0,2)}

                                        </span>


                                    </figure>
                                </div>

                            </div>
                        </div>}
                        {this.props.isLoggedIn &&
                            <div className="row">
                                <div className="col">
                                    <div className="list-group main-menu">
                                        <Link onClick={this.toggleMenu} to={"/"}
                                            className="white-text list-group-item list-group-item-action">Homes </Link>
                                        <Link onClick={this.toggleMenu} to={"/find-resources"}
                                            className="white-text list-group-item list-group-item-action">Browse All Resources </Link>
                                        <Link onClick={this.toggleMenu} to={"/search-form"}
                                            className="white-text list-group-item list-group-item-action">Create A Search </Link>
                                        <Link onClick={this.toggleMenu} to={"/list-form"}
                                            className="white-text list-group-item list-group-item-action">Create A Listing </Link>
                                        {/*{this.props.isLoggedIn &&   <Link onClick={this.toggleMenu} to={"/delivery-resource"} className="white-text list-group-item list-group-item-action">Deliver Resources </Link>}*/}
                                        {this.props.isLoggedIn && <Link onClick={this.toggleMenu} to={""}
                                            className="white-text list-group-item list-group-item-action">Account</Link>}
                                        {this.props.isLoggedIn && <Link onClick={this.toggleMenu} to={"/loops"}
                                            className="white-text list-group-item list-group-item-action">My
                            Cycles</Link>}

                                        {this.props.isLoggedIn && <Link onClick={this.toggleMenu} to={"/my-listings"}
                                            className="white-text list-group-item list-group-item-action">My
                            Listings </Link>}
                                        {this.props.isLoggedIn && <Link onClick={this.toggleMenu} to={"/searches"}
                                            className="white-text list-group-item list-group-item-action">My
                            Searches </Link>}
                                        {this.props.isLoggedIn && <Link onClick={this.toggleMenu} to={"/my-products"}
                                            className="white-text list-group-item list-group-item-action">My
                            Products </Link>}
                                        {this.props.isLoggedIn && <Link onClick={this.toggleMenu} to="/product-archive"
                                            className="white-text list-group-item list-group-item-action">
                            Product Archive</Link>}
                                        {this.props.isLoggedIn && <Link onClick={this.toggleMenu} to={"/statistics"}
                                            className="white-text list-group-item list-group-item-action">
                            Statistics</Link>}



                                    </div>
                                </div>
                            </div>
                        }
                        {this.props.isLoggedIn &&    <div className="row mt-3 mb-3">
                            <div className="col">
                                <div className={"menu_divider_line"}></div>
                            </div>
                        </div>}


                        <div className="row">
                            <div className="col">
                                <div className="list-group main-menu">
                                    {!this.props.isLoggedIn && <Link onClick={this.showLoginPopUp} to={""} className="list-group-item list-group-item-action green-text">Log in </Link>}
                                    {!this.props.isLoggedIn && <Link onClick={this.showSignUpPopUp} to={""} className="list-group-item list-group-item-action green-text">Sign Up </Link>}

                                    {this.props.isLoggedIn && <Link onClick={this.logOut} to={""} className="list-group-item list-group-item-action green-text">Log out </Link>}
                                    <Link onClick={this.toggleMenu} to={"/account"} className="list-group-item list-group-item-action green-text">My Loopcycle </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter




    };
};


const mapDispachToProps = dispatch => {
    return {


        logIn: (data) => dispatch(actionCreator.logIn(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),



    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Sidebar);
