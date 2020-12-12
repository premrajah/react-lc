import React, { Component } from 'react';
import { connect } from "react-redux";
import history from "../../History/history";
import IndexNavbar from "../../components/Navbars/IndexNavbar";


class HeaderMobile extends Component {


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




    componentWillMount() {

    }

    componentDidMount() {






    }

    intervalJasmineAnim





    render() {

        return (


            <>
                <IndexNavbar />



                {/*<div className="container container-black p-2">*/}
                {/*</div>*/}
                {/*<div className="container container-blue pt-2 pb-3">*/}

                {/*<div className="row no-gutters">*/}
                {/*<div className="col-auto">*/}

                {/*<Link to={"/"}>  <img src={LogoNew} alt=""*/}
                {/*className="header-logo" />*/}
                {/*</Link>*/}
                {/*</div>*/}

                {/*<div className="col text-right ">*/}


                {/*{!this.props.isLoggedIn && <button  type="button" className="mt-1 btn topBtn btn-outline-primary"><Link to={"/login"}>LOG IN</Link></button>}*/}
                {/*{this.props.isLoggedIn &&*/}

                {/*<button  className="btn  btn-link text-dark btn-inbox">*/}
                {/*<Link to={"/inbox"}><MenuOutline className="white-text" style={{ fontSize: 24 }} />*/}
                {/*<span className="new-notification"></span>*/}
                {/*</Link>*/}
                {/*</button>*/}
                {/*}*/}

                {/*</div>*/}

                {/*<div className="col-auto">*/}

                {/*<button onClick={this.toggleMenu} className="btn   btn-link text-dark menu-btn">*/}
                {/*<MenuIcon className="white-text" style={{ fontSize: 32 }}/>*/}

                {/*</button>*/}
                {/*</div>*/}


                {/*</div>*/}
                {/*</div>*/}

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
)(HeaderMobile);
