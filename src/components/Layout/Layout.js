import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import BackToTop from "./SrollToTop/BackToTop";

class Layout extends React.Component {
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
        const { children } = this.props
        return (
            <div  className='layout layout-main'>
                <Header />
                <div className="main-content-area">
                {children}
                </div>
                {!this.props.hideFooter&&<Footer/>}
                <BackToTop/>
            </div>
        );
    }
}


export default (Layout);
