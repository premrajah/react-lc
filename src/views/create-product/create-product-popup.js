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
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import Layout from "../../components/Layout/Layout";

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
            <>

                <GlobalDialog
                    size="md"
                    hideHeading
                    show={this.props.showProductPopUp}
                    hide={()=> {
                        this.hidePopUp();
                    }}
                >
                    <div className="col-12">
                    <ProductForm type={this.props.showProductPopUpType} productId={this.props.parentProductId} />
                    </div>

                </GlobalDialog>


                </>
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
        parentProductId: state.parentProductId,


        showProductPopUpType: state.showProductPopUpType,

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


