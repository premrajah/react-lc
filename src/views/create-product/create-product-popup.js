import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';

import ProductExpandItem from "../../components/Products/ProductExpandItem";
import ProductForm from "../../components/ProductPopUp/ProductForm";
import IconButton from "@mui/material/IconButton";
import {Close} from "@mui/icons-material";
import CloseButtonPopUp from "../../components/FormsUI/Buttons/CloseButtonPopUp";

class ProductPopUp extends Component {
    componentDidMount() {}

    constructor() {
        super();

        this.state = {};

        this.hidePopUp = this.hidePopUp.bind(this);
    }

    hidePopUp() {
        this.props.showProductPopUp({ action: "hide_all", show: false });
    }

    hideDummy() {}

    render() {
        return (
            <Modal
                size="lg"
                show={this.props.showProductPopUp}
                onHide={this.hidePopUp}
                className={"custom-modal-popup popup-form"}>
                <div className="row   justify-content-end">
                <div className="col-auto mr-2 mt-2">
                    <CloseButtonPopUp onClick={this.hidePopUp}>
                        <Close />
                    </CloseButtonPopUp>

                </div>
                </div>
                <div className="row no-gutters  justify-content-center mobile-menu-row  pl-2 pr-2 pb-2">
                    <div className="col mobile-menu">
                        <div className="form-col-left col-12">
                            {this.props.showCreateSubProduct && (
                                <ProductForm heading="Add Subproduct" />
                            )}

                            {this.props.showCreateProduct && (
                                <ProductForm id={this.props.id} heading={"Add Product"} />
                            )}
                            {this.props.showSubProductView && (
                                <ProductExpandItem
                                    showLinkProducts={true}
                                    productId={this.props.product.product._key}
                                />
                            )}

                        </div>


                    </div>
                </div>

                {!this.props.showCreateSubProduct &&!this.props.showCreateProduct &&  <div className="row py-3 justify-content-end mobile-menu-row pt-3 p-2">
                    <div className="col text-right">
                    <button
                        onClick={this.hidePopUp}
                        className=" btn-gray-border  "
                        data-dismiss="modal"
                        aria-label="Close">
                        Done
                    </button>
                    </div>
                </div>}

            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        abondonCartItem: state.abondonCartItem,
        socialUserInfo: state.socialUserInfo,
        showSubProductView: state.showSubProductView,
        showCreateProduct: state.showCreateProduct,
        showCreateSubProduct: state.showCreateSubProduct,
        showProductView: state.loginPopUpStatus,
        showProductPopUp: state.showProductPopUp,
        product: state.product,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),
    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(ProductPopUp);


