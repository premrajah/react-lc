import React from "react";
import {Link} from "react-router-dom";
// reactstrap components
import {Button, Col, Container, Nav, NavItem, NavLink, Row, UncontrolledTooltip} from "reactstrap";
import LogoNew from '../../img/logo-cropped.png';

import LogoText from '../../img/logo-text.png';
import styles from './Footer.module.css';
import {connect} from "react-redux";
import * as actionCreator from "../../store/actions/actions";

class Footer extends React.Component {



    constructor(props) {

        super(props)




        this.showLoginPopUp=this.showLoginPopUp.bind(this)
    }

    showLoginPopUp(){

        if(!this.props.isLoggedIn){

            this.props.showLoginPopUp(true)

        }

    }




    render() {
    return (
      <footer className="footer">
        <Container>
          <Row className={""}>
            <Col md="3">
              <div className="row no-gutters mb-5">
                <div className="col-auto">
                  <img className="header-logo" src={LogoNew} alt="logo" />
                  <img className={"text-logo-home"} src={LogoText} alt="logo-text" />


                </div>
              </div>
            </Col>
            <Col md="3">
              <Nav>
                <NavItem>
                  <a className={styles.footerlink} href="https://loopcycle.io/" target="_blank" rel="noopener noreferrer"><b>Company</b></a>
                </NavItem>
                <NavItem>
                  <a className={styles.footerlink} href="https://loopcycle.io/about-us/" target="_blank" rel="noopener noreferrer">About</a>
                </NavItem>
                {/*<NavItem>*/}
                {/*  <a className={styles.footerlink} href="https://loopcycle.io/what-we-do/" target="_blank" rel="noopener noreferrer">What We Do</a>*/}
                {/*</NavItem>*/}
                <NavItem>
                  <a className={styles.footerlink} href="https://loopcycle.io/how-it-works/" target="_blank" rel="noopener noreferrer">How It Works</a>
                </NavItem>
                <NavItem>
                  <a className={styles.footerlink} href="https://loopcycle.io/news/" target="_blank" rel="noopener noreferrer">News</a>
                </NavItem>
                <NavItem>
                  <a className={styles.footerlink} href="https://loopcycle.io/contact-us/" target="_blank" rel="noopener noreferrer">Contact</a>
                </NavItem>
              </Nav>
            </Col>
            <Col md="3">
              <Nav>
                <NavItem>
                  <NavLink to="/" tag={Link}>
                    <b>Resources</b>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={this.showLoginPopUp} to={this.props.isLoggedIn&&"/find-resources"} tag={Link}>
                    Browse All
                        </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={this.showLoginPopUp} to={this.props.isLoggedIn&&"/my-search"} tag={Link}>
                    Search
                        </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={this.showLoginPopUp} to={this.props.isLoggedIn&&"/my-listings"} tag={Link}>
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
            <Col md="3">
              <div className="btn-wrapper profile">
                <Button
                    className="btn-icon btn-neutral btn-round btn-simple"
                    color="default"
                    href="https://www.linkedin.com/company/loopcycle"
                    id="tooltip230450809"
                    target="_blank"
                >
                  <i className="fab fa-linkedin" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip230450809">
                  Connect
                </UncontrolledTooltip>

                <Button
                    className="btn-icon btn-neutral btn-round btn-simple"
                    color="default"
                    href="https://twitter.com/Loopcycle"
                    id="tooltip622135962"
                    target="_blank"
                >
                  <i className="fab fa-twitter" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip622135962">
                  Follow us
                </UncontrolledTooltip>
                <Button
                  className="btn-icon btn-neutral btn-round btn-simple"
                  color="default"
                  href="https://www.instagram.com/loopcycle_io"
                  id="tooltip230450801"
                  target="_blank"
                >
                  <i className="fab fa-instagram" />
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip230450801">
                  Like us
                </UncontrolledTooltip>

              </div>
            </Col>
          </Row>
          <div className="row no-gutters mt-3 mb-3 justify-content-center">
            <div className="col-auto copright-text">

              <ul>
                <li>
                  <p className={" "}>&copy; {new Date().getFullYear()} Loopcycle</p>
                </li>
                <li><Link to="/terms">Terms and Conditions</Link></li>
                <li><Link to="/privacy">Privacy</Link></li>
                <li><Link to="/cookie">Cookies</Link></li>
                <li><Link to="/service">Terms and Services</Link></li>
                <li><Link to="/acceptable">Acceptable Use</Link></li>

              </ul>
            </div>
          </div>
        </Container>
      </footer>
    );
  }
}


const mapStateToProps = state => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        // loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        // loginFailed: state.loginFailed,
        // showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        // userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter




    };
};

const mapDispachToProps = dispatch => {
    return {

        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),




    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(Footer);

