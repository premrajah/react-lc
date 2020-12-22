import React, { Component } from 'react';
import axios from "axios/index";
import { Spinner,Button, Col, Row, Carousel, CarouselItem, Modal, ModalFooter,ModalDialog, Alert, ModalBody, Form, FormControl, FormCheck, FormGroup, FormLabel, FormText, InputGroup} from 'react-bootstrap'
import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";
import  history from '../History/history'
import {Switch, Link} from 'react-router-dom'
import {Captcha} from 'primereact/captcha';
import {baseUrl,baseImgUrl} from  '../Util/Constants'
import GoogleLogin from 'react-google-login';
import { FacebookProvider, Login  } from 'react-facebook';import config from "./social/config";
import queryString from 'query-string'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {saveGuestData, saveUserData, saveUserToken} from '../LocalStorage/user'


class  LoginPopUp extends Component{


    componentDidMount(){


    }
    constructor() {

        super();

        this.state = {



        }


    }








    hidePopUp(){

        this.props.showProductPopUp("")


    }

    hideDummy(){



    }





    render (){

        return(


            <Modal   show={true}

                     onHide={this.hidePopUp}
                     className={"custom-modal-popup popup-form"}
            >
                <button onClick={this.hidePopUp} className="close" data-dismiss="modal" aria-label="Close"><i class="fas fa-times"></i></button>
                <div className="row py-3 justify-content-center mobile-menu-row">
                    <div className="col mobile-menu">
                        
                      {!this.props.showSocialLoginPopUp&&this.state.showLogin &&
                      <div className="form-col-left col-12">
                            <h3 className="form-heading">Sign In </h3>

                        </div>
                   
                            }


                   </div>
                </div>
            </Modal>

        )
    }
}



const mapStateToProps = state => {
    return {

        abondonCartItem : state.abondonCartItem,
        socialUserInfo: state.socialUserInfo,



    };
};

const mapDispachToProps = dispatch => {
    return {

        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),



    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(LoginPopUp);


