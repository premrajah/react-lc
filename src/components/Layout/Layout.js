import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

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
            <div className='layout'>
                <Header />
                {children}
                {!this.props.hideFooter&&<Footer/>}
            </div>
        );
    }
}


export default (Layout);
