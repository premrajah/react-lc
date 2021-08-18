import React ,{Component } from 'react';
import {Alert, Modal, ModalBody, Tab, Tabs} from "react-bootstrap";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

class PopUp extends Component{



    hidePopUp = (event) => {


        // document.body.classList.add('sidemenu-open');
        this.props.showModal({show:false})

    }

    render (){

        return(

            <Modal  size="lg" show={this.props.showPopUp.show} onHide={this.hidePopUp}>

            </Modal>


        )    }
}


const mapStateToProps = state => {
    return {

        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showPopUp: state.showPopUp,
        userDetail: state.userDetail,
        showSubProductView: state.showSubProductView,
        showCreateProduct: state.showCreateProduct,
        showCreateSubProduct: state.showCreateSubProduct,
        popUpType: state.popUpType,



    };
};


const mapDispachToProps = dispatch => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        // loadUserDetail: (data) => dispatch(actionCreator.loadUserDetail(data)),
        logOut: (data) => dispatch(actionCreator.logOut(data)),
        showModal: (data) => dispatch(actionCreator.showModal(data)),
        setPopUpType: (data) => dispatch(actionCreator.setPopUpType(data)),

    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ShowPopUp);


