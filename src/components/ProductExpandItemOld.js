import React, { Component } from "react";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";
import ProductItemNew from "./ProductItemNew";

class ProductExpandItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            subProducts: [],
            product: null,
        };

        this.showPopUp = this.showPopUp.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.productId !== this.props.productId) {
            this.setState({
                product: null,
            });

            this.loadProduct(this.props.productId);
        }
    }

    showProductSelection() {
        this.props.setProduct(this.state.product);
        this.props.setParentProduct(this.state.product);

        this.props.showProductPopUp({ type: "create_sub_product", show: true });
    }

    loadProduct(productKey) {
        axios
            .get(baseUrl + "product/" + productKey, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data;

                    this.setState({
                        product: responseAll.data,
                    });

                    this.setState({
                        subProducts: [],
                    });

                    if (responseAll.data.sub_product_ids.length > 0) {
                        this.getSubProducts();
                    }
                },
                (error) => {}
            );
    }

    showPopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp,
        });
    }

    componentWillMount() {}

    componentDidMount() {
        this.loadProduct(this.props.productId);
    }

    getSubProducts() {
        var subProductIds = this.state.product.sub_product_ids;

        for (var i = 0; i < subProductIds.length; i++) {
            axios
                .get(baseUrl + "product/" + subProductIds[i].replace("Product/", ""), {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                })
                .then(
                    (response) => {
                        var responseAll = response.data;

                        var subProducts = this.state.subProducts;

                        subProducts.push(responseAll.data);

                        this.setState({
                            subProducts: subProducts,
                        });
                    },
                    (error) => {}
                );
        }
    }

    render() {
        return (
            <>
                {this.state.product && <ProductItemNew item={this.state.product} />}

                {this.state.subProducts.length > 0 && (
                    <div className="row no-gutters  justify-content-left">
                        <div className="col-12">
                            <h6 className={"blue-text text-heading"}>Sub Products</h6>
                        </div>
                    </div>
                )}

                {!this.props.hideAddAll && (
                    <div className="row no-gutters justify-content-left">
                        <p
                            style={{ margin: "10px 0px" }}
                            className={"green-text forgot-password-link text-mute small"}>
                            <span onClick={this.showProductSelection}>Add Sub Product</span>
                        </p>
                    </div>
                )}

                {this.state.subProducts.map((item) => (
                    <ProductItemNew item={item} />
                ))}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartthis.props.items: state.cartthis.props.items,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,
        parentProduct: state.parentProduct,
        product: state.product,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductExpandItem);
