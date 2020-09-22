import React from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import MenuIcon from '@material-ui/icons/Menu';
import MenuOutline from '@material-ui/icons/MailOutline';
import LogoNew from '../../img/logo-cropped.png';
import LogoText from '../../img/logo-text.png';


class ComponentsNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      color: "navbar-transparent",
        timerEnd: false,
        count : 0,
        nextIntervalFlag: false
    };

      this.toggleMenu=this.toggleMenu.bind(this)

  }

    toggleMenu = (event) => {


        document.body.classList.add('sidemenu-open');

    }


  componentDidMount() {
    window.addEventListener("scroll", this.changeColor);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.changeColor);
  }
  changeColor = () => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      this.setState({
        color: "bg-info"
      });
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };
  toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  onCollapseExiting = () => {
    this.setState({
      collapseOut: "collapsing-out"
    });
  };
  onCollapseExited = () => {
    this.setState({
      collapseOut: ""
    });
  };
  scrollToDownload = () => {
    document
      .getElementById("download-section")
      .scrollIntoView({ behavior: "smooth" });
  };
  render() {
    return (
      <Navbar
        className={"fixed-top container-blue " }
        color-on-scroll="100"
        expand="lg"
      >

            <NavbarBrand
              to="/"
              tag={Link}
              id="navbar-brand"
            >

                <div className="row no-gutters">
                    <div className="col-auto">
                        <img className="header-logo" src={LogoNew} />
                        <img className={"text-logo-home web-only"} src={LogoText} />


                    </div>
                </div>
            </NavbarBrand>


            <Nav  className={"justify-content-end "}>

              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  href="#pablo"
                  nav
                  onClick={e => e.preventDefault()}
                  className={"wl-link-white web-only"}
                >
                  <i className="fa fa-cogs d-lg-none d-xl-none" />
                    Search Resources
                </DropdownToggle>
                <DropdownMenu className="dropdown-with-icons">
                  <DropdownItem href="https://demos.creative-tim.com/blk-design-system-react/#/documentation/tutorial">
                    <i className="tim-icons icon-paper" />
                    Documentation
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/register-page">
                    <i className="tim-icons icon-bullet-list-67" />
                    Register Page
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/landing-page">
                    <i className="tim-icons icon-image-02" />
                    Landing Page
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/profile-page">
                    <i className="tim-icons icon-single-02" />
                    Profile Page
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <NavItem className={"web-only"}>
                <Link
                  className="nav-link d-none d-lg-block wl-link-white "
                  color="default"

                >
                    List Resources
                </Link>
              </NavItem>
                <NavItem className={"web-only"}>
                    <Link
                        className="nav-link d-none d-lg-block wl-link-white "
                        color="default"

                    >
                        Deliver
                    </Link>
                </NavItem>


                <NavItem className={"web-only"}>
                    <Link
                        className="nav-link d-none d-lg-block  green-text "
                        color="default"

                    >
                        Sign Up
                    </Link>
                </NavItem>



              <NavItem>



                      {!this.props.isLoggedIn && <button  type="button" className="mt-1 btn topBtn btn-outline-primary"><Link to={"/login"}>Log In</Link></button>}
                      {this.props.isLoggedIn &&

                      <button  className="btn  btn-link text-dark btn-inbox">
                          <Link to={"/inbox"}><MenuOutline className="white-text" style={{ fontSize: 24 }} />
                              <span className="new-notification"></span>
                          </Link>
                      </button>
                      }
                </NavItem>

                <NavItem className={"mobile-only"}>
                    <button onClick={this.toggleMenu} className="btn   btn-link text-dark menu-btn">
                          <MenuIcon className="white-text" style={{ fontSize: 32 }}/>

                      </button>
                </NavItem>



            </Nav>

      </Navbar>
    );
  }
}

export default ComponentsNavbar;
