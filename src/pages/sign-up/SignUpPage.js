import React, {Component} from "react";
import Layout from "../../components/Layout/Layout";
import SignUp from "../../views/login/SignUp";
import SuccessSignUp from "../../views/login/SuccessSignUp";
import {connect} from "react-redux";

class SignUpPage extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {


        return (
            <Layout>


                {this.props.signUpPageSubmitted ?
                    <SuccessSignUp isPage={true} parentClass={"col-8"}/>
                     :
                    <SignUp isPage={true} parentClass={"col-8"}/>
                }

            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        // age: state.age,
        // cartItems: state.cartItems,
        signUpPageSubmitted: state.signUpPageSubmitted,

    };
};

const mapDispachToProps = (dispatch) => {
    return {

    };
};
export default connect(mapStateToProps, mapDispachToProps)(SignUpPage);

