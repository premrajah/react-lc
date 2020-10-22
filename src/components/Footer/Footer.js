import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import LogoNew from '../../img/logo-cropped.png';

import LogoText from '../../img/logo-text.png';
import styles from './Footer.module.css';

class Footer extends React.Component {
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
                <NavItem>
                  <a className={styles.footerlink} href="https://loopcycle.io/what-we-do/" target="_blank" rel="noopener noreferrer">What We Do</a>
                </NavItem>
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
                  <NavLink to="/resources" tag={Link}>
                    <b>Resources</b>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/resources" tag={Link}>
                    Browse All
                        </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/create-search" tag={Link}>
                    Search
                        </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/my-listings" tag={Link}>
                    Listings
                        </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/deliver-resources" tag={Link}>
                    Deliver
                  </NavLink>
                </NavItem>

              </Nav>
            </Col>
            <Col md="3">
              <NavItem>
                <NavLink to="/profile-page" tag={Link}>
                  <b>Connect</b>
                </NavLink>
              </NavItem>
              <div className="btn-wrapper profile">
                <Button
                  className="btn-icon btn-neutral btn-round btn-simple"
                  color="default"
                  href="https://twitter.com/Loopcycle_"
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
                {/*<Button*/}
                {/*className="btn-icon btn-neutral btn-round btn-simple"*/}
                {/*color="default"*/}
                {/*href="https://dribbble.com/creativetim"*/}
                {/*id="tooltip318450378"*/}
                {/*target="_blank"*/}
                {/*>*/}
                {/*<i className="fab fa-dribbble" />*/}
                {/*</Button>*/}
                {/*<UncontrolledTooltip delay={0} target="tooltip318450378">*/}
                {/*Follow us*/}
                {/*</UncontrolledTooltip>*/}
              </div>
            </Col>
          </Row>
          <div className="row no-gutters mt-3 mb-3 justify-content-center">
            <div className="col-auto copright-text">

              <ul>
                <li>
                  <p className={" "}> ©  2020  Loopcycle</p>
                </li>
                <li>Terms</li>
                <li>Privacy</li>


              </ul>
            </div>
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
