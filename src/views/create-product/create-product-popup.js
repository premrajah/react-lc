import React, { Component } from 'react';
import axios from "axios/index";
import { Spinner,Button, Col, Row, Carousel, CarouselItem, Modal, ModalFooter,ModalDialog, Alert, ModalBody, Form, FormControl, FormCheck, FormGroup, FormLabel, FormText, InputGroup} from 'react-bootstrap'
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import ProductForm from "../create-listing/ProductForm";
import SubProductView from "../create-listing/SubProductView";
import ProductView from "../create-listing/ProductView";
import ProductExpandItem from '../../components/ProductExpandItem'



class  ProductPopUp extends Component{


    componentDidMount(){


    }
    constructor() {

        super();

        this.state = {


        }


        this.hidePopUp=this.hidePopUp.bind(this)

    }



    hidePopUp(){

        this.props.showProductPopUp({action:"hide_all",show:false})


    }

    hideDummy(){

    }


    render (){

        return(

            <Modal
                size="lg"
                show={this.props.showProductPopUp}
                onHide={this.hidePopUp}
                className={"custom-modal-popup popup-form"}
            >

                    <div className="m-1">
                <button onClick={this.hidePopUp} className="btn-close close-done" data-dismiss="modal" aria-label="Close">
                    Done
                </button>

                </div>
                <div className="row py-3 justify-content-center mobile-menu-row pt-3 p-2">
                    <div className="col mobile-menu">


                      <div className="form-col-left col-12">

                          {this.props.showCreateSubProduct && <ProductForm  heading={"Create A Sub Product"}/>}

                          {this.props.showCreateProduct && <ProductForm  heading={"Create A Product"}/>}
                          {this.props.showSubProductView && <ProductExpandItem  showLinkProducts={true} productId={this.props.product.product._key}/>}

                            {/*<ProductExpandItem productId={"product-1612196249585-OoEd1eCa56"}/>*/}


                          {/*{this.props.showProductView && <ProductView  />}*/}



                      </div>




                    </div>

                </div>

                {/*<div className="row py-3 justify-content-center mobile-menu-row pt-3">*/}

                    {/*<div className="col-3 mobile-menu">*/}

                        {/*{this.props.showSubProductView &&  <button type={"submit"} onClick={this.hidePopUp} className={"btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"}>Done</button>}*/}


                    {/*</div>*/}
                {/*</div>*/}




            </Modal>

        )
    }
}



const mapStateToProps = state => {
    return {

        abondonCartItem : state.abondonCartItem,
        socialUserInfo: state.socialUserInfo,
        showSubProductView: state.showSubProductView,
        showCreateProduct: state.showCreateProduct,
        showCreateSubProduct: state.showCreateSubProduct,
        showProductView: state.loginPopUpStatus,
        showProductPopUp: state.showProductPopUp,
        product: state.product

    };
};

const mapDispachToProps = dispatch => {
    return {

        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),


    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ProductPopUp);


