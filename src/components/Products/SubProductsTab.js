import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SubproductItem from "./Item/SubproductItem";
import AddLinkIcon from '@mui/icons-material/AddLink';

class SubProductsTab extends Component {
    slug;
    search;

    showProductSelection=(event)=> {
        this.props.setProduct(this.props.item);
        this.props.showProductPopUp({ type: "sub_product_view", show: true });
    }

    render() {

        return (
            <>
                {/*{this.props.userDetail&&this.props.userDetail.orgId===this.props.item.org._id&& <p*/}
                {/*    style={{ margin: "10px 0px" }}*/}
                {/*    className={*/}
                {/*        "green-text forgot-password-link text-mute small"*/}
                {/*    }>*/}
                {/*                 <span  data-parent={this.props.item.product._key}*/}
                {/*                                        onClick={this.showProductSelection}*/}
                {/*                                    >*/}
                {/*                                        Link Subproducts*/}
                {/*                                    </span>*/}
                {/*</p>}*/}


                {this.props.userDetail&&this.props.userDetail.orgId===this.props.item.org._id&&

                <div  className={
                    " mt-4  text-right"}>
                    <button

                        className={
                            "btn-gray-border "
                        }>
                        <AddLinkIcon />     <span  data-parent={this.props.item.product._key}
                                                   onClick={this.showProductSelection}
                    >
                                                        Link Subproducts
                                                    </span>


                        {this.props.item.product.unit_conversions&&this.props.item.product.unit_conversions.length>0&&     <span style={{float:"right"}} className={"text-right"}  data-parent={this.props.item.product._key}
                                                                                                                                 onClick={this.editConversion}
                        >Edit Conversions</span>}
                    </button>
                </div> }



                <div className={"mt-4"}></div>
                {this.props.item.sub_products.length > 0 && (
                    <>
                        {this.props.item.sub_products.map(
                            (item, index) => (
                                <SubproductItem


                                    smallImage={true}
                                    noLinking={this.props.noLinking}
                                    hideMoreMenu={this.props.userDetail&&this.props.userDetail.orgId===this.props.item.org._id?false:true}
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
