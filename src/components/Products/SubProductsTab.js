import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import { Link } from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import { makeStyles } from "@material-ui/core/styles";
import {baseUrl, capitalizeFirstLetter, frontEndUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import { Alert, Modal, ModalBody, Tab, Tabs } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles/index";
import ProductItemNew from "../ProductItemNew";
import jspdf from "jspdf";
import QrCodeBg from "../../img/qr-code-bg.png";
import LoopcycleLogo from "../../img/logo-text.png";
import SearchItem from "../../views/loop-cycle/search-item";
import ResourceItem from "../../views/create-search/ResourceItem";
import TextField from "@material-ui/core/TextField";
import Org from "../Org/Org";
import ProductEditForm from "../ProductEditForm";
import MoreMenu from "../MoreMenu";
import AutocompleteCustom from "../AutocompleteCustom";
import Close from "@material-ui/icons/Close";
import AddImagesToProduct from "../UploadImages/AddImagesToProduct";
import AddedDocumentsDisplay from "../UploadImages/AddedDocumentsDisplay";
import SubproductItem from "./SubproductItem";
import ImageHeader from "../UIComponents/ImageHeader";
import {getProductProvenanceSlug} from "../../Util/GlobalUrl";

class SubProductsTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }
    showProductSelection=(event)=> {
        this.props.setProduct(this.props.item);
        this.props.showProductPopUp({ type: "sub_product_view", show: true });
    }

    render() {


        return (
            <>
                <p
                    style={{ margin: "10px 0px" }}
                    className={
                        "green-text forgot-password-link text-mute small"
                    }>
                                                    <span
                                                        data-parent={this.props.item.product._key}
                                                        onClick={this.showProductSelection}
                                                    >
                                                        Link Subproducts
                                                    </span>
                </p>

                {this.props.item.sub_products.length > 0 && (
                    <>
                        {this.props.item.sub_products.map(
                            (item, index) => (
                                <SubproductItem
                                    key={index}
                                    item={item}
                                    parentId={this.props.item.product._key}
                                    remove={true}
                                />
                            )
                        )}
                    </>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
        showSubProductView: state.showSubProductView,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),

        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(SubProductsTab);
