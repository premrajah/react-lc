import React from "react";
import {Link} from "react-router-dom";
import {Nav, Navbar, NavbarBrand, NavItem} from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOutline from "@mui/icons-material/MailOutline";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoSymbol from "../../img/Symbol-white.svg";
import HeaderLogoSvg from '../../img/Logo-white.svg';
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import LinearProgress from "@mui/material/LinearProgress";
import {makeStyles, withStyles} from "@mui/styles";
import {Badge, Snackbar, Tooltip} from "@mui/material";
import Alert from "@mui/lab/Alert";
import Menu from '@mui/material/Menu';
import AddBoxIcon from '@mui/icons-material/AddBox';


const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(39, 36, 92, 1)',
        boxShadow: theme.shadows[1.5],
        fontSize: 14,
    },
}))(Tooltip);


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
            anchorEl:null,
            menuOpen:false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.showLoginPopUp = this.showLoginPopUp.bind(this);
        this.logOut = this.logOut.bind(this);
        this.showSignUpPopUp = this.showSignUpPopUp.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);

    }


     handleClickMenu = (event) => {
        this.setState({
            anchorEl:event.currentTarget,
            menuOpen:true
        });


    };
     handleCloseMenu = () => {
         this.setState({
             anchorEl:null,
             menuOpen:false
         });
    };

    showProductSelection() {
        this.props.showProductPopUp({ type: "create_product", show: true });
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
        this.props.getMessages([]);
        this.props.getNotifications([]);
        this.props.logOut();
    };

    componentDidMount() {

        // window.removeEventListener("scroll", this.changeColor);
        // window.addEventListener("scroll", this.changeColor);
        this.dispatchMessagesAndNotifications();

        if (this.props.isLoggedIn) {
            this.getArtifactForOrg();
        }
    }



    dispatchMessagesAndNotifications =  () => {
        this.props.getMessages()
        this.props.getNotifications();
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

    getArtifactForOrg = () => {
        let url = `${baseUrl}org/${encodeURIComponent(this.props.userDetail.orgId)}/artifact`;
        axios
            .get(url)
            .then(response => {
                if (response.status === 200) {
                    if (response.data.data.length > 0) {
                        this.setState({
                            orgImage: `${response.data.data[0].blob_url}&v=${Date.now()}`,
                        });

                        this.props.setOrgImage(
                            response.data.data[0].blob_url
                        );
                    }
                }
            })
            .catch((error) => {});
    };

    render() {
        return (
            <>
                <Snackbar open={this.props.messageAlert} autoHideDuration={6000}  onClick={() => this.props.dispatchMessageAlert(false)} onClose={() => this.props.dispatchMessageAlert(false)}>
                    <Alert  severity="success">You have new messages.</Alert>
                </Snackbar>
                <Snackbar open={this.props.notificationAlert} autoHideDuration={6000}  onClick={() => this.props.dispatchNotificationAlert(false)} onClose={() => this.props.dispatchNotificationAlert(false)}>
                    <Alert  severity="success">You have new notifications.</Alert>
                </Snackbar>

                <Navbar className={"container-blue "} color-on-scroll="100" expand="lg">
                    <Nav className={"justify-content-start "}>
                        <NavbarBrand to="/" tag={Link} id="navbar-brand">
                            <div className="row no-gutters">
                                <div className="col-auto">
                                    <Link className={"logo-link"} to={"/"}>
                                        <div className="d-flex justify-content-center align-content-center">
                                            <img className="header-logo mobile-only" src={LogoSymbol} alt=""/>
                                            <img
                                                className="text-logo-home web-only"
                                                src={HeaderLogoSvg}
                                                alt=""
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </NavbarBrand>
                    </Nav>

                    <Nav className={"justify-content-end menu-align-right"}>
                        {this.props.isLoggedIn && (
                            <>
                            <NavItem className={"web-only mr-3"}>
                                <Link
                                    onClick={this.showProductSelection}
                                    to={"/my-products"}
                                    className="nav-link d-none d-lg-block wl-link-white"
                                    color="default">
                                    Add Products
                                </Link>
                            </NavItem>
                            </>
                            )}
                        <NavItem className={"web-only mr-3"}>
                            <Link
                                className="nav-link d-none d-lg-block wl-link-white "
                                color="default"
                                to={"/find-resources"}>
                                Marketplace
                            </Link>
                        </NavItem>

                        {this.props.isLoggedIn && (
                            <>

                                <NavItem className={"web-only mr-3"}>
                                    <Link
                                        to={"/search-form"}
                                        className="nav-link d-none d-lg-block wl-link-white"
                                        color="default">
                                        New Search
                                    </Link>
                                </NavItem>

                                <NavItem className={"web-only mr-3"}>
                                    <Link
                                        to={"/list-form"}
                                        className="nav-link d-none d-lg-block wl-link-white  "
                                        color="default">
                                        New Listing
                                    </Link>
                                </NavItem>
                            </>
                        )}


                        {!this.props.isLoggedIn && (
                            <NavItem onClick={this.showSignUpPopUp} className={"web-only"}>
                                <span className="nav-link mr-3  d-lg-block  green-text click-item" color="default">
                                    Sign Up
                                </span>
                            </NavItem>
                        )}

                        <NavItem>
                            {!this.props.isLoggedIn && (
                                <button
                                    onClick={this.showLoginPopUp}
                                    type="button"
                                    className=" btn topBtn ">
                                    <span>Log In</span>
                                </button>
                            )}
                        </NavItem>

                        {this.props.isLoggedIn && (
                            <>
                                <NavItem>
                                    <button className="btn btn-link text-dark btn-inbox">
                                        <Link to="/messages" onClick={() => this.props.dispatchUnreadMessages(false)}>
                                            <Badge color={this.props.unreadMessages ? "secondary" : "default"} variant="dot" >
                                                <MenuOutline className="white-text" style={{ fontSize: 24 }} />
                                            </Badge>
                                        </Link>
                                    </button>
                                </NavItem>

                                <NavItem>
                                    <button className="btn btn-link text-dark btn-inbox">
                                        <Link to="/notifications" onClick={() => this.props.dispatchUnreadNotifications(false)}>
                                            <Badge color={this.props.unreadNotifications ? "secondary" : "default"} variant="dot" >
                                                <NotificationsNoneIcon className="white-text" style={{ fontSize: 24 }} />
                                            </Badge>
                                        </Link>
                                    </button>
                                </NavItem>
                            </>
                        )}


                        {/*<BasicMenu orgImage={this.props.orgImage} isLoggedIn={this.props.isLoggedIn} userDetail={this.props.userDetail}/>*/}


                        {this.props.isLoggedIn && (
                            <NavItem className={"web-only "}>

                                    <div
                                        onClick={this.handleClickMenu}
                                        className={"wl-link-white click-item pt-2"}>
                                        <figure className="avatar avatar-60 ">
                                            <span className={"word-user"}>
                                                {this.props.isLoggedIn ? (
                                                    this.props.orgImage ? (
                                                        <LightTooltip title={this.props.userDetail ? `${this.props.userDetail.email}` : "Menu"} arrow placement="left">
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                }}>
                                                                <img
                                                                    src={this.props.orgImage}
                                                                    alt=""
                                                                    style={{
                                                                        maxHeight: "30px",
                                                                        maxWidth: "30px",
                                                                        objectFit: "cover",
                                                                        width: "30px",
                                                                        height: "30px",
                                                                    }}
                                                                />
                                                            </div>
                                                        </LightTooltip>
                                                    ) : this.props.userDetail.firstName ? (
                                                        this.props.userDetail.firstName.substr(0, 2)
                                                    ) : (
                                                        this.props.userDetail.orgId &&
                                                        this.props.userDetail.orgId.substr(4, 2)
                                                    )
                                                ) : (
                                                    this.props.userDetail.orgId &&
                                                    this.props.userDetail.orgId.substr(4, 2)
                                                )}
                                            </span>
                                        </figure>

                                        <i className="fa fa-cogs d-lg-none d-xl-none" />
                                    </div>

                                    <Menu
                                        // className={"p-0"}
                                        style={{paddingTop:"0!important",paddingBottom:"0!important"}}
                                        id="basic-menu"
                                        anchorEl={this.state.anchorEl}
                                        open={this.state.menuOpen}
                                        onClose={this.handleCloseMenu}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                    {/*<DropdownMenu className="dropdown-with-icons">*/}
                                        <Link className={"dropdown-item"} to="/account">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Account
                                        </Link>

                                        <Link className={"dropdown-item"} to="/sites">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Sites
                                        </Link>
                                        <Link className={"dropdown-item"} to="/my-products">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Products
                                        </Link>
                                        <Link className={"dropdown-item"} to="/my-campaigns">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Campaigns
                                        </Link>

                                        <Link className={"dropdown-item"} to="/my-search">
                                            <i className="tim-icons icon-paper" />
                                            Searches
                                        </Link>

                                        <Link className={"dropdown-item"} to="/my-listings">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Listings
                                        </Link>
                                        <Link className={"dropdown-item"} to="/my-cycles">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Cycles
                                        </Link>

                                        <Link className={"dropdown-item"} to="/approve">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Approvals
                                        </Link>


                                        <Link className={"dropdown-item"} to="/help">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Help
                                        </Link>


                                        {/*<Link className={"dropdown-item"} to="">*/}
                                        {/*    <i className="tim-icons icon-bullet-list-67" />*/}
                                        {/*    Help*/}
                                        {/*</Link>*/}

                                        <span className={"dropdown-item click-item"} onClick={this.logOut}>
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Log Out
                                        </span>
                                    {/*</DropdownMenu>*/}
                                    </Menu>

                            </NavItem>
                        )}

                        {this.props.isLoggedIn && <NavItem className="mobile-only">
                            <Link
                                onClick={this.showProductSelection}
                                to={"/my-products"}
                                className="btn btn-link text-dark menu-btn"
                                color="default">
                                <AddBoxIcon className="white-text" style={{fontSize: 24}}/>
                            </Link>
                        </NavItem>}

                        <NavItem className={"mobile-only"}>
                            <button
                                onClick={this.toggleMenu}
                                className="btn btn-link text-dark menu-btn">
                                <MenuIcon className="white-text" style={{ fontSize: 32 }} />
                            </button>
                        </NavItem>
                    </Nav>
                    {this.props.loading && <LinearIndeterminate />}
                </Navbar>
            </>
        );
    }
}




function LinearIndeterminate() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <LinearProgress style={{ backgroundColor: "#212529" }} />
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        right: 0,
        position: "absolute",
        top: "100%",
        width: "100%",
        "& > * + *": {
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
        orgImage: state.orgImage,
        messages: state.messages,
        notifications: state.notifications,
        messageAlert: state.messageAlert,
        notificationAlert: state.notificationAlert,
        unreadMessages: state.unreadMessages,
        unreadNotifications: state.unreadNotifications,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        setOrgImage: (data) => dispatch(actionCreator.setOrgImage(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        getMessages: (data) => dispatch(actionCreator.getMessages(data)),
        getNotifications: (data) => dispatch(actionCreator.getNotifications(data)),
        dispatchMessageAlert: (data) => dispatch(actionCreator.messageAlert(data)),
        dispatchNotificationAlert: (data) => dispatch(actionCreator.notificationAlert(data)),
        dispatchUnreadMessages: (data) => dispatch(actionCreator.unreadMessages(data)),
        dispatchUnreadNotifications: (data) => dispatch(actionCreator.unreadNotifications(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ComponentsNavbar);
