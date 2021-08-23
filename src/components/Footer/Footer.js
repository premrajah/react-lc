import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
    Button,
    Col,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    UncontrolledTooltip,
} from "reactstrap";
import LogoNew from "../../img/logo-cropped.png";

import LogoText from "../../img/logo-text.png";
import styles from "./Footer.module.css";
import { connect } from "react-redux";
import * as actionCreator from "../../store/actions/actions";
// // import HeaderLogoSvg from "../../img/loopcycle_header_logo.svg";
// import HeaderLogoSvg from '../../img/Logo-white.svg';
import HeaderLogoSvg from '../../img/Logo-white.svg';
import LogoSymbol from "../../img/Symbol-white.svg";

class Footer extends React.Component {
    constructor(props) {
        super(props);

        this.showLoginPopUp = this.showLoginPopUp.bind(this);
    }

    showLoginPopUp() {
        if (!this.props.isLoggedIn) {
            this.props.showLoginPopUp(true);
        }
    }

    render() {
        return (
            <footer style={{padding: ".5rem 1rem"}} className="footer pt-4">
                    <Row className={""}>
                        <Col md="4">
                            <img className="header-logo mobile-only" src={LogoSymbol} alt=""/>
                            <img
                                className="text-logo-home web-only"
                                src={HeaderLogoSvg}
                                alt=""
                            />
                        </Col>
                        <Col md="2">
                            <Nav>
                                <NavItem>
                                    <a
                                        className={styles.footerlink}
                                        href="https://loopcycle.io/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <b>Company</b>
                                    </a>
                                </NavItem>
                                <NavItem>
                                    <a
                                        className={styles.footerlink}
                                        href="https://loopcycle.io/about/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        About
                                    </a>
                                </NavItem>
                                <NavItem>
                                    <a
                                        className={styles.footerlink}
                                        href="https://loopcycle.io/latest/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Latest
                                    </a>
                                </NavItem>
                                <NavItem>
                                    <a
                                        className={styles.footerlink}
                                        href="https://loopcycle.io/contact/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Contact
                                    </a>
                                </NavItem>
                            </Nav>
                        </Col>
                        <Col md="2">
                            <Nav>
                                <NavItem>
                                    <NavLink className={styles.footerlink} to="/" tag={Link}>
                                        <b>Resources</b>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={styles.footerlink}
                                        onClick={this.showLoginPopUp}
                                        to={this.props.isLoggedIn && "/find-resources"}
                                        tag={Link}>
                                        Browse All
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={styles.footerlink}
                                        onClick={this.showLoginPopUp}
                                        to={this.props.isLoggedIn && "/my-search"}
                                        tag={Link}>
                                        Search
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={styles.footerlink}
                                        onClick={this.showLoginPopUp}
                                        to={this.props.isLoggedIn && "/my-listings"}
                                        tag={Link}>
                                        Listings
                                    </NavLink>
                                </NavItem>
                                {/*<NavItem>*/}
                                {/*  <NavLink onClick={this.showLoginPopUp} to={this.props.isLoggedIn&&"/"} tag={Link}>*/}
                                {/*    Deliver*/}
                                {/*  </NavLink>*/}
                                {/*</NavItem>*/}
                            </Nav>
                        </Col>
                        <Col md="4">
                            <div className="btn-wrapper profile">
                                <Button
                                    className="btn-icon btn-neutral btn-round btn-simple"
                                    color="default"
                                    href="https://www.linkedin.com/company/loopcycle"
                                    id="tooltip230450809"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <i className="fab fa-linkedin" />
                                </Button>
                                <UncontrolledTooltip delay={0} target="tooltip230450809">
                                    Connect
                                </UncontrolledTooltip>

                                <Button
                                    className="btn-icon btn-neutral btn-round btn-simple"
                                    color="default"
                                    href="https://twitter.com/loopcycle_"
                                    id="tooltip622135962"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <i className="fab fa-twitter" />
                                </Button>
                                <UncontrolledTooltip delay={0} target="tooltip622135962">
                                    Follow us
                                </UncontrolledTooltip>
                                <Button
                                    className="btn-icon btn-neutral btn-round btn-simple"
                                    color="default"
                                    href="https://www.youtube.com/channel/UCzXmbG1RV2ejUlIgRytdFfw"
                                    id="tooltip230450801"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <i className="fab fa-youtube" />
                                </Button>
                                <UncontrolledTooltip delay={0} target="tooltip230450801">
                                    View Content
                                </UncontrolledTooltip>
                            </div>
                        </Col>
                    </Row>
                    <div className="row no-gutters mt-3 mb-3 justify-content-center">
                        <div className="col-auto copright-text">
                            <ul>
                                <li>
                                    <p>
                                        &copy; {new Date().getFullYear()} Loopcycle
                                    </p>
                                </li>
                                <li>
                                    <Link to="/terms">Terms and Conditions</Link>
                                </li>
                                <li>
                                    <Link to="/privacy">Privacy</Link>
                                </li>
                                <li>
                                    <Link to="/cookie">Cookies</Link>
                                </li>
                                <li>
                                    <Link to="/service">Terms and Services</Link>
                                </li>
                                <li>
                                    <Link to="/acceptable">Acceptable Use</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

            </footer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(Footer);
