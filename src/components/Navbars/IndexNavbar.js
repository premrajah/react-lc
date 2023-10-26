import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavbarBrand, NavItem, Container } from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOutline from "@mui/icons-material/MailOutline";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoSymbol from "../../img/Symbol-white.svg";
import HeaderLogoSvg from '../../img/Logo-white.svg';
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import LinearProgress from "@mui/material/LinearProgress";
import { makeStyles, withStyles } from "@mui/styles";
import { Badge, Snackbar, Tooltip } from "@mui/material";
import Alert from "@mui/material/Alert";
import Menu from '@mui/material/Menu';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DevelopmentUserInfoDisplay from "./DevelopmentUserInfoDisplay";
import GlobalDialog from "../RightBar/GlobalDialog";
import MagicLinksCreator from "../Magic/MagicLinksCreator";
import { withRouter } from "react-router-dom";

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(39, 36, 92, 1)',
        boxShadow: theme.shadows[1.5],
        fontSize: 14,
    },
}))(Tooltip);

// pass path name to component

class ComponentsNavbar extends React.Component {
    timer;
    constructor(props) {
        super(props);
        this.state = {
            collapseOpen: false,
            color: "navbar-transparent",
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            orgImage: "",
            anchorEl: null,
            menuOpen: false,
            magicLinkPopup: false,
            magicLinkCurrentPagePath: null,
            org: null,
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.showLoginPopUp = this.showLoginPopUp.bind(this);
        this.logOut = this.logOut.bind(this);
        this.showSignUpPopUp = this.showSignUpPopUp.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);

    }

    handleHideMagicLinkPopup = () => {
        this.setState({
            magicLinkPopup: false,
            magicLinkCurrentPagePath: null, //clear pagePath
        });
    }

    handleOpenMagicLinkPopup = () => {
        const { pathname, search } = this.props.location;
        this.setState({
            magicLinkPopup: true,
            magicLinkCurrentPagePath: `${pathname}${search && search}`,
        })
    }

    handleClickMenu = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            menuOpen: true
        });


    };
    handleCloseMenu = () => {
        this.setState({
            anchorEl: null,
            menuOpen: false
        });
    };

    showProductSelection() {
        this.props.showProductPopUp({ type: "new", show: true, parentProductId: null });
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

        if (this.props.isLoggedIn) {
            this.getArtifactForOrg();
            this.getOrgForUser();
            this.dispatchMessagesAndNotifications();
            this.timer = setTimeout(() => {
                this.dispatchMessagesAndNotifications();
            }, 10000)
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }



    dispatchMessagesAndNotifications = () => {
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
            .catch((error) => { });
    };

    getOrgForUser = () => {
        let url = `${baseUrl}org`;
        axios
            .get(url)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        org: response.data.data,
                    });
                }
            })
            .catch((error) => {
                console.log("het org for user error ", error);
            });
    };

    welcomeMessage = () => {

        if (this.props?.userDetail?.firstName) {
            return (<div className="mb-2">
                <div>Welcome <span className="blue-text text-bold">{this.props?.userDetail?.firstName}</span> <span>{this.props?.userDetail?.lastName}</span></div>
                <div>{this.props?.userDetail?.is_org_admin && <span>You are logged in as Admin</span>}</div>
                {this.props?.userDetail?.is_org_admin && <div>for <span className="blue-text text-bold">{this.state?.org?.name}</span></div>}
            </div>)
        }

    }

    render() {

        return (
            <>
                <Snackbar open={this.props.messageAlert} autoHideDuration={6000} onClick={() => this.props.dispatchMessageAlert(false)} onClose={() => this.props.dispatchMessageAlert(false)}>
                    <Alert severity="success">You have new messages.</Alert>
                </Snackbar>
                <Snackbar open={this.props.notificationAlert} autoHideDuration={6000} onClick={() => this.props.dispatchNotificationAlert(false)} onClose={() => this.props.dispatchNotificationAlert(false)}>
                    <Alert severity="success">You have new notifications.</Alert>
                </Snackbar>


                {(baseUrl && this.props.isLoggedIn && baseUrl === "https://graph-dev.makealoop.io/api/2/") && <DevelopmentUserInfoDisplay userDetail={this.props.userDetail} />}

                <Navbar className={"container-blue "} color-on-scroll="100" expand="lg">
                    <Container fluid>
                        <Nav className={"  justify-content-start "}>
                            <NavbarBrand to="/" tag={Link} id="navbar-brand">
                                <div className="row ">
                                    <div className="col-auto">
                                        <Link className={"logo-link"} to={"/"}>
                                            <div className="d-flex justify-content-center align-content-center">
                                                <img className="header-logo mobile-only" src={LogoSymbol} alt="" />
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

                        <Nav className={" justify-content-end menu-align-right"}>

                            {/*{this.props.isLoggedIn && (*/}
                            {/*    <>*/}

                            {/*        <NavItem className={"web-only mr-3"}>*/}
                            {/*            <Link*/}
                            {/*                to={"/search-form"}*/}
                            {/*                className="nav-link d-none d-lg-block wl-link-white"*/}
                            {/*                color="default">*/}
                            {/*                New Search*/}
                            {/*            </Link>*/}
                            {/*        </NavItem>*/}

                            {/*        <NavItem className={"web-only mr-3"}>*/}
                            {/*            <Link*/}
                            {/*                to={"/list-form"}*/}
                            {/*                className="nav-link d-none d-lg-block wl-link-white  "*/}
                            {/*                color="default">*/}
                            {/*                New Listing*/}
                            {/*            </Link>*/}
                            {/*        </NavItem>*/}
                            {/*    </>*/}
                            {/*)}*/}


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
                                    {(this.props?.userContext?.perms?.includes("AdminWrite") && this.props?.userContext?.perms?.includes("LcAssumeOrgRole")) && <NavItem>
                                        <button className="btn btn-link text-dark btn-inbox">
                                            <Link to="#" onClick={() => this.handleOpenMagicLinkPopup()}>
                                                <AutoFixHighIcon className="white-text" style={{ fontSize: 24 }} />
                                            </Link>
                                        </button>
                                    </NavItem>}

                                    {this.props?.userContext?.perms?.includes("MessageRead") && <NavItem>
                                        <button className="btn btn-link text-dark btn-inbox">
                                            <Link to="/messages" onClick={() => this.props.dispatchUnreadMessages(false)}>
                                                <Badge color={this.props.unreadMessages ? "secondary" : "default"} variant="dot" >
                                                    <MenuOutline className="white-text" style={{ fontSize: 24 }} />
                                                </Badge>
                                            </Link>
                                        </button>
                                    </NavItem>}

                                    {this.props?.userContext?.perms?.includes("MessageRead") && <NavItem>
                                        <button className="btn btn-link text-dark btn-inbox">
                                            <Link to="/notifications" onClick={() => this.props.dispatchUnreadNotifications(false)}>
                                                <Badge color={this.props.unreadNotifications ? "secondary" : "default"} variant="dot" >
                                                    <NotificationsNoneIcon className="white-text" style={{ fontSize: 24 }} />
                                                </Badge>
                                            </Link>
                                        </button>
                                    </NavItem>}
                                </>
                            )}


                            {/*<BasicMenu orgImage={this.props.orgImage} isLoggedIn={this.props.isLoggedIn} userDetail={this.props.userDetail}/>*/}


                            {this.props.isLoggedIn && (
                                <NavItem className={"web-only "}>
                                    <div
                                        onClick={this.handleClickMenu}
                                        className={"wl-link-white click-item"}>
                                        <figure className="avatar avatar-60 ">
                                            <span className={"word-user"}>
                                                {this.props.isLoggedIn ? (
                                                    this.props.orgImage ? (
                                                        <LightTooltip title={this.props?.userDetail ? this.welcomeMessage() : "Menu"} arrow placement="left">
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
                                                                        objectFit: "contain",
                                                                        width: "30px",
                                                                        height: "30px",
                                                                        border: "2px solid var(--lc-yellow)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </LightTooltip>
                                                    ) : this.props.userDetail.firstName ? (
                                                        <LightTooltip title={this.welcomeMessage()}><span>{this.props.userDetail.firstName.substr(0, 2)}</span></LightTooltip>
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
                                        style={{ padding: "10px!important" }}
                                        id="basic-menu"
                                        anchorEl={this.state.anchorEl}
                                        open={this.state.menuOpen}
                                        onClose={this.handleCloseMenu}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                        className="custom-dropdown-menu"
                                    >

                                        <Link className={`dropdown-item`} to="/account">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Account
                                        </Link>

                                        <Link className={`dropdown-item ${this.props?.userContext?.perms?.includes("SiteRead") ? '' : 'disabled-link'}`} to="/sites">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Sites
                                        </Link>
                                        <Link className={`dropdown-item ${this.props?.userContext?.perms?.includes("ProductRead") ? '' : 'disabled-link'}`} to="/my-products">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Products
                                        </Link>
                                        <Link className={`dropdown-item ${this.props?.userContext?.perms?.includes("ProductRead") ? '' : 'disabled-link'}`} to="/product-kinds">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Product Kinds
                                        </Link>
                                        <Link className={`dropdown-item ${this.props?.userContext?.perms?.includes("CollectionRead") ? '' : 'disabled-link'}`} to="/collections">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Collections
                                        </Link>
                                        <Link className={`dropdown-item ${this.props?.userContext?.perms?.includes("EventRead") ? '' : 'disabled-link'}`} to="/my-diary">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Calendar
                                        </Link>
                                        <Link className={`dropdown-item ${this.props?.userContext?.perms?.includes("CampaignRead") ? '' : 'disabled-link'}`} to="/my-campaigns">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Campaigns
                                        </Link>

                                        <Link className={`dropdown-item`} to="/find-resources">
                                            <i className="tim-icons icon-paper" />
                                            Marketplace
                                        </Link>

                                        <Link className={`dropdown-item ${this.props?.userContext?.perms?.includes("SearchRead") ? '' : 'disabled-link'}`} to="/my-search">
                                            <i className="tim-icons icon-paper" />
                                            Searches
                                        </Link>

                                        <Link className={`dropdown-item ${this.props?.userContext?.perms?.includes("ListingRead") ? '' : 'disabled-link'}`} to="/my-listings">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Listings
                                        </Link>
                                        <Link className={`dropdown-item ${this.props?.userContext?.perms?.includes("CycleRead") ? '' : 'disabled-link'}`} to="/my-cycles">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Cycles
                                        </Link>

                                        <Link className={"dropdown-item"} to="/approve">
                                            <i className="tim-icons icon-bullet-list-67" />
                                            Approvals
                                        </Link>


                                        {/*<Link className={"dropdown-item"} to="/help">*/}
                                        {/*    <i className="tim-icons icon-bullet-list-67" />*/}
                                        {/*    Help*/}
                                        {/*</Link>*/}


                                        {/*<Link className={"dropdown-item"} to="">*/}
                                        {/*    <i className="tim-icons icon-bullet-list-67" />*/}
                                        {/*    Help*/}
                                        {/*</Link>*/}

                                        <span className={"dropdown-item click-item"} onClick={() => {
                                            this.handleCloseMenu();
                                            this.logOut();
                                        }}>
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
                                    <AddBoxIcon className="white-text" style={{ fontSize: 24 }} />
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
                    </Container>
                </Navbar>

                <GlobalDialog
                    size="md"
                    show={this.state.magicLinkPopup}
                    hide={() => this.handleHideMagicLinkPopup()}
                    heading="Create Magic Link"
                >
                    <MagicLinksCreator pagePath={this.state.magicLinkCurrentPagePath} hideMagicLinkPopup={this.handleHideMagicLinkPopup} />
                </GlobalDialog>
            </>
        );
    }
}




function LinearIndeterminate() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <LinearProgress
            // style={{ backgroundColor: "#212529" }}
            />
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
        userContext: state.userContext,
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ComponentsNavbar));
