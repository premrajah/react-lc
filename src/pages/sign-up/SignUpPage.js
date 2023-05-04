import React, {Component} from "react";
import Layout from "../../components/Layout/Layout";
import SuccessSignUp from "../../views/login/SuccessSignUp";
import {connect} from "react-redux";
import SignUp from "../../components/Login/SignUp";

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
                    <SignUp hideClose isPage={true} parentClass={"col-lg-6 col-12"}/>
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

