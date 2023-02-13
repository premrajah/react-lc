import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import BackToTop from "./SrollToTop/BackToTop";
import ErrorBoundary from "../ErrorBoundary";

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
                    <ErrorBoundary parent>
                {children}
                    </ErrorBoundary>
                </div>
                {!this.props.hideFooter&&<Footer/>}
                <BackToTop/>
            </div>
        );
    }
}


export default (Layout);
