import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import { DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from "reactstrap";

import { NavbarBrand, Navbar, NavItem, Nav } from "react-bootstrap";
import MenuIcon from "@material-ui/icons/Menu";
import MenuOutline from "@material-ui/icons/MailOutline";
import LogoNew from "../../img/logo-cropped.png";
import LogoText from "../../img/logo-text.png";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';


class ComponentsNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseOpen: false,
            color: "navbar-transparent",
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            orgImage: "",
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.showLoginPopUp = this.showLoginPopUp.bind(this);
        this.logOut = this.logOut.bind(this);
        this.showSignUpPopUp = this.showSignUpPopUp.bind(this);
    }

    toggleMenu = (event) => {
        document.body.classList.add("sidemenu-open");
    };

    showLoginPopUp = (event) => {
        this.props.setLoginPopUpStatus(0);
        this.props.showLoginPopUp(true);
    };

    showSignUpPopUp = (event) => {
        this.props.setLoginPopUpStatus(1);
        this.props.showLoginPopUp(true);
    };

    hideLoginPopUp = (event) => {
        // document.body.classList.add('sidemenu-open');
        this.props.setLoginPopUpStatus(0);

        this.props.showLoginPopUp(true);
    };

    logOut = (event) => {
        document.body.classList.remove("sidemenu-open");
        this.props.logOut();
    };

    componentDidMount() {
        window.addEventListener("scroll", this.changeColor);
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.changeColor);
    }
    changeColor = () => {
        if (document.documentElement.scrollTop > 99 || document.body.scrollTop > 99) {
            this.setState({
                color: "bg-info",
            });
        } else if (document.documentElement.scrollTop < 100 || document.body.scrollTop < 100) {
            this.setState({
                color: "navbar-transparent",
            });
        }
    };
    toggleCollapse = () => {
        document.documentElement.classList.toggle("nav-open");
        this.setState({
            collapseOpen: !this.state.collapseOpen,
        });
    };
    onCollapseExiting = () => {
        this.setState({
            collapseOut: "collapsing-out",
        });
    };
    onCollapseExited = () => {
        this.setState({
            collapseOut: "",
        });
    };
    scrollToDownload = () => {
        document.getElementById("download-section").scrollIntoView({ behavior: "smooth" });
    };

    render() {
        return (


            <>



                    <Navbar className={"fixed-top container-blue "} color-on-scroll="100" expand="lg">


                    <Nav className={"justify-content-start "}>
                        <NavbarBrand to="/" tag={Link} id="navbar-brand">
                            <div className="row no-gutters">
                                <div className="col-auto">
                                    <Link className={"logo-link"} to={"/"}>
                                        <>
                                            <img className="header-logo" src={LogoNew} alt="" />
                                            <img
                                                className={"text-logo-home web-only"}
                                                src={LogoText}
                                                alt=""
                                            />
                                        </>
                                    </Link>
                                </div>
                            </div>
                        </NavbarBrand>
                    </Nav>

                    <Nav className={"justify-content-end menu-align-right"}>
                        {this.props.isLoggedIn && (
                            <>
                                <NavItem className={"web-only"}>
                                    <Link
                                        className="nav-link d-none d-lg-block wl-link-white "
                                        color="default"
                                        to={"/my-listings"}>
                                        Find Resources
                                    </Link>
                                </NavItem>

                                {/*<NavItem className={"web-only"}>*/}
                                {/*<Link*/}
                                {/*to={"/create-listing"}*/}
                                {/*className="nav-link d-none d-lg-block wl-link-white "*/}
                                {/*color="default"*/}

                                {/*>*/}
                                {/*Sell Resources*/}
                                {/*</Link>*/}
                                {/*</NavItem>*/}

                                <NavItem className={"web-only"}>
                                    <Link
                                        to={"/search-form"}
                                        className="nav-link d-none d-lg-block green-link "
                                        color="default">
                                        Create a search
                                    </Link>
                                </NavItem>

                                <NavItem className={"web-only"}>
                                    <Link
                                        to={"/list-form"}
                                        className="nav-link d-none d-lg-block green-link "
                                        color="default">
                                        New Listing
                                    </Link>
                                </NavItem>
                            </>
                        )}

                        {!this.props.isLoggedIn && (
                            <NavItem onClick={this.showSignUpPopUp} className={"web-only"}>
                                <Link className="nav-link  d-lg-block  green-text " color="default">
                                    Sign Up
                                </Link>
                            </NavItem>
                        )}

                        <NavItem>
                            {!this.props.isLoggedIn && (
                                <button
                                    onClick={this.showLoginPopUp}
                                    type="button"
                                    className="mt-1 btn topBtn ">
                                    <Link>Log In</Link>
                                </button>
                            )}
                        </NavItem>

                        {this.props.isLoggedIn && (
                            <NavItem>
                                <button className="btn  btn-link text-dark btn-inbox">
                                    <Link style={{ position: "relative" }} to={"/inbox"}>
                                        <MenuOutline
                                            className="white-text"
                                            style={{ fontSize: 24 }}></MenuOutline>
                                        <span className="new-notification"></span>
                                    </Link>
                                </button>
                            </NavItem>
                        )}

                        {this.props.isLoggedIn && (
                            <NavItem className={"web-only"}>
                                <UncontrolledDropdown nav>
                                    <DropdownToggle
                                        caret
                                        color="default"
                                        data-toggle="dropdown"
                                        href="#pablo"
                                        nav
                                        onClick={(e) => e.preventDefault()}
                                        className={"wl-link-white "}>
                                        <figure
                                            className="avatar avatar-60 border-0">
                                            <span className={"word-user"}>
                                                {this.props.isLoggedIn ? (
                                                    this.state.orgImage.length > 0 ? (
                                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                            <img
                                                                src={this.state.orgImage}
                                                                alt=""
                                                                style={{
                                                                    maxHeight: "30px",
                                                                    maxWidth: "30px",
                                                                    objectFit: "contain",
                                                                }}
                                                            />
                                                        </div>
                                                    ) : this.props.userDetail.firstName ? (
                                                        this.props.userDetail.firstName.substr(0, 2)
                                                    ) : (
                                                        this.props.userDetail.orgId && this.props.userDetail.orgId.substr(4, 2)
                                                    )
                                                ) : (
                                                    this.props.userDetail.orgId && this.props.userDetail.orgId.substr(4, 2)
                                                )}
                                            </span>
                                        </figure>

                                        <i className="fa fa-cogs d-lg-none d-xl-none" />
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-with-icons">
                                        <Link className={"dropdown-item"} to="/my-search">
                                            <i className="tim-icons icon-paper" />
                                            My Searches
                                        </Link>
                                        <Link className={"dropdown-item"} to="/my-listings">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            My Listings
                                        </Link>
                                        <Link className={"dropdown-item"} to="/my-cycles">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            My Cycles
                                        </Link>

                                        <Link className={"dropdown-item"} to="/my-products">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            My Products
                                        </Link>

                                        <Link className={"dropdown-item"} to="/statistics">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Statistics
                                        </Link>

                                        <Link className={"dropdown-item"} to="/account">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Account
                                        </Link>
                                        <Link className={"dropdown-item"} to="">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Help
                                        </Link>

                                        <DropdownItem onClick={this.logOut}>
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Log Out
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </NavItem>
                        )}

                        <NavItem className={"mobile-only"}>
                            <button
                                onClick={this.toggleMenu}
                                className="btn   btn-link text-dark menu-btn">
                                <MenuIcon className="white-text" style={{ fontSize: 32 }} />
                            </button>
                        </NavItem>
                    </Nav>
                        {this.props.loading && <LinearIndeterminate/>}


                    </Navbar>


                </>
        );
    }
}



function LinearIndeterminate() {
    const classes = useStyles();

    return (
        <div className={classes.root}>

            <LinearProgress   style={{backgroundColor:"#212529"}}  />

        </div>
    );
}


const useStyles = makeStyles((theme) => ({
    root: {
        right:0,
        position: "absolute",
        top:"100%",
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        userDetail: state.userDetail,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ComponentsNavbar);
