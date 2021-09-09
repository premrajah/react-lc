import React, { Component } from "react";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import { connect } from "react-redux";
import * as actionCreator from "../store/actions/actions";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import ProductItemNew from "./ProductItemNew";
import { makeStyles, withStyles } from "@material-ui/core/styles/index";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import {Spinner} from "react-bootstrap";
import {PRODUCT_NPARENT_LIST} from "../store/types";
import {loading} from "../store/actions/actions";

const useStylesSelect = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        width: "100%",
        // minWidth: auto,
    },
    selectEmpty: {
        marginTop: theme.spacing(0),
    },
}));

class ProductExpandItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            // count: 0,
            nextIntervalFlag: false,
            subProducts: [],
            product: null,
            fields: {},
            errors: {},
            subProductSelected: null,
            addCount: [],
            count: 0,
            showExisting: false,
            productList:[]
        };

        this.showPopUp = this.showPopUp.bind(this);
        this.showProductSelection = this.showProductSelection.bind(this);
        this.linkSubProduct = this.linkSubProduct.bind(this);
        this.addCount = this.addCount.bind(this);
        this.subtractCount = this.subtractCount.bind(this);
        this.showExisting = this.showExisting.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    removeItem(event) {
        var data = {
            product_id: this.props.currentProduct.product._key,
            sub_products_ids: [event.currentTarget.dataset.id],
        };

        axios.post(baseUrl + "product/sub-product/remove", data).then(
            (response) => {
                // var responseAll = response.data.data;

                // this.props.history.push("/my-products")
                // this.props.loadProducts()

                this.loadProduct(this.props.currentProduct.product._key);
            },
            (error) => {}
        );
    }

    showExisting() {
        this.setState({
            showExisting: !this.state.showExisting,
        });
    }

    addCount() {
        var array = this.state.addCount;

        array.push(this.state.count + 1);

        this.setState({
            addCount: array,
            count: this.state.count + 1,
        });
    }

    subtractCount() {
        if (this.state.count > 1) {
            var array = this.state.addCount;

            array.pop();

            if (this.state.count > 1)
                this.setState({
                    addCount: array,
                    count: this.state.count - 1,
                });
        }
    }

    classes = useStylesSelect;

    componentDidUpdate(prevProps) {
        if (prevProps.productId !== this.props.productId) {
            this.setState({
                product: null,
            });

            this.loadProduct(this.props.productId);



        }
    }

    handleChange(field, e, i) {
        let fields = this.state.fields;

        fields[field] = e.target.value;

        // const { name, value } = e.target;

        this.setState({ fields });

        if (field === "product") {
            this.setState({
                subProductSelected: this.props.productList.filter(
                    (item) => item._key == e.target.value
                )[0],
            });
        }
    }




    showProductSelection(event) {
        // this.props.setProduct(this.props.currentProduct)
        // this.props.setParentProduct(this.props.currentProduct)

        this.props.showProductPopUp({
            type: "create_sub_product",
            show: true,
            parentId: event.currentTarget.dataset.parent,
        });
    }

    loadProduct(productKey) {


        if (productKey)
        this.props.loadCurrentProduct(productKey)

    }

    showPopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp,
        });
    }

    linkSubProduct(event) {
        event.preventDefault();

        const form = event.currentTarget;

        // if (this.handleValidationSite()){

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        var array = [];

        for (let i = 0; i < this.state.addCount.length; i++) {
            array.push({ id: data.get(`product[${i}]`), volume: data.get(`volume[${i}]`) });
        }

        var dataForm = {
            product_id: this.props.currentProduct.product._key,
            sub_products: array,
        };

        axios
            .post(baseUrl + "product/sub-product", dataForm)
            .then((res) => {
                // dispatch({type: "SIGN_UP", value : res.data})

                this.setState({
                    addCount: [],
                    count: 0,
                });
                this.loadProduct(this.props.currentProduct.product._key);
            })
            .catch((error) => {
                // dispatch(stopLoading())
                // dispatch(signUpFailed(error.response.data.content.message))
                // dispatch({ type: AUTH_FAILED });
                // dispatch({ type: ERROR, payload: error.data.error.message });
            });
    }


    componentDidMount() {
        this.loadProduct(this.props.productId);
        this.setState({
            addCount: [1],
            count: 1,
        });

        this.props.loadProducts(this.props.userDetail.token);
        this.props.loadProductsWithoutParent(this.props.userDetail.token);

    }


    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                {this.props.currentProduct && (
                    <ProductItemNew
                        hideMore={true}
                        item={this.props.currentProduct}
                    />
                )}

                <div className="row no-gutters  justify-content-left">
                    <div className="col-12">
                        {this.props.currentProduct && (
                            <>
                                {!this.props.hideAddAll && (
                                    <div className="row no-gutters justify-content-left">
                                        <div className="col-12">
                                            <p className={"custom-label text-bold text-blue mb-1"}>
                                                Sub Products
                                            </p>

                                            <ul>
                                                {this.props.currentProduct &&this.props.currentProduct.sub_products&&
                                                    this.props.currentProduct.sub_products.map(
                                                        (item, index) => (
                                                            <>
                                                                <li className={""}>
                                                                    <span
                                                                        className={
                                                                            "d-flex justify-content-start align-items-center"
                                                                        }>
                                                                        {item.name}
                                                                        <DeleteIcon
                                                                            classname={
                                                                                "click-item ml-2 "
                                                                            }
                                                                            data-id={item._key}
                                                                            style={{
                                                                                color: "#ccc",
                                                                                fontSize: "16px",
                                                                            }}
                                                                            onClick={this.removeItem.bind(
                                                                                this
                                                                            )}
                                                                        />
                                                                    </span>
                                                                </li>
                                                            </>
                                                        )
                                                    )}
                                            </ul>
                                        </div>
                                        <div className="col-12">
                                            <p
                                                style={{ margin: "10px 0px" }}
                                                className={" text-mute small"}>
                                                <span
                                                    className={
                                                        "forgot-password-link green-text mr-2 "
                                                    }
                                                    data-parent={this.props.currentProduct.product._key}
                                                    onClick={this.showProductSelection}>
                                                    Create New
                                                </span>
                                                :
                                                <span
                                                    className={
                                                        "forgot-password-link green-text ml-2"
                                                    }
                                                    data-parent={this.props.currentProduct.product._key}
                                                    onClick={this.showExisting}>
                                                    Add Existing
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {this.props.currentProduct && this.props.showLinkProducts && this.state.showExisting && (
                    <>
                        <div className="row   justify-content-left">
                            <form style={{ width: "100%" }} onSubmit={this.linkSubProduct}>
                                <div className="col-12 mt-4" style={{ padding: "0!important" }}>
                                    {this.state.addCount.map((item, index) => (
                                        <div className="row mt-2">
                                            <div className="col-8">
                                                {/*<div className={"custom-label text-bold text-blue mb-1"}>Sub Product</div>*/}

                                                <FormControl
                                                    variant="outlined"
                                                    className={classes.formControl}>
                                                    <Select
                                                        name={`product[${index}]`}
                                                        // label={"Link a product"}
                                                        required={true}
                                                        native
                                                        onChange={this.handleChange.bind(
                                                            this,
                                                            "product"
                                                        )}
                                                        inputProps={{
                                                            // name: {`product[${index}]`},
                                                            id: "outlined-age-native-simple",
                                                        }}>
                                                        <option value={null}>Select</option>

                                                        {this.props.productList
                                                            .filter(
                                                                (item) =>
                                                                    item._key !==
                                                                        this.props.currentProduct.product
                                                                            ._key &&
                                                                    !(
                                                                        this.props.currentProduct.sub_products.filter(
                                                                            (subItem) =>
                                                                                subItem._key ===
                                                                                item._key
                                                                        ).length > 0
                                                                    )
                                                            )
                                                            .map((item) => (
                                                                <option value={item._key}>
                                                                    {item.name}
                                                                    {/*({item.sub_product_ids.length}Sub Products)*/}
                                                                </option>
                                                            ))}


                                                    </Select>
                                                    {this.props.productList.length===0&&   <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        style={{color:"#07AD88"}}
                                                        className={"spinner-select"}
                                                    />}
                                                    {this.state.errors["product"] && (
                                                        <span className={"text-mute small"}>
                                                            <span style={{ color: "red" }}>* </span>
                                                            {this.state.errors["product"]}
                                                        </span>
                                                    )}

                                                    {/*<FormHelperText>Please select the product you wish to sell. <br/>Don’t see it on here?*/}

                                                    {/*<span onClick={this.showProductSelection.bind(this)} className={"green-text forgot-password-link text-mute "}> Create a new product</span>*/}

                                                    {/*</FormHelperText>*/}
                                                </FormControl>


                                            </div>

                                            <div className="col-3">
                                                {/*<div className={"custom-label text-bold text-blue mb-1"}>Volume</div>*/}

                                                <TextField
                                                    required={true}
                                                    type={"number"}
                                                    onChange={this.handleChange.bind(
                                                        this,
                                                        "volume"
                                                    )}
                                                    name={`volume[${index}]`}
                                                    placeholder={"Volume"}
                                                    id="outlined-basic"
                                                    variant="outlined"
                                                    fullWidth={true}
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                />
                                                {this.state.errors["volume"] && (
                                                    <span className={"text-mute small"}>
                                                        <span style={{ color: "red" }}>* </span>
                                                        {this.state.errors["volume"]}
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className="col-1 text-center"
                                                style={{ display: "flex" }}>
                                                {item > 1 && (
                                                    <>
                                                        {/*<div className={"custom-label text-bold text-blue mb-1"}>Delete</div>*/}

                                                        <DeleteIcon
                                                            classname={"click-item"}
                                                            style={{
                                                                color: "#ccc",
                                                                margin: "auto",
                                                            }}
                                                            onClick={() => this.subtractCount()}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="col-12 mt-4 ">
                                    <button
                                        onClick={this.addCount}
                                        className={
                                            "btn btn-default  btn-rounded shadow  blue-btn-border"
                                        }>
                                        <AddIcon />
                                        Add
                                    </button>
                                </div>

                                <div className="col-12 mt-4 mobile-menu">
                                    <div className="row text-center ">
                                        <div className="col-12 text-center">
                                            <button
                                                style={{ margin: "auto", width: "200px" }}
                                                type={"submit"}
                                                className={
                                                    "btn btn-default btn-lg btn-rounded shadow btn-block btn-green login-btn"
                                                }>
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                )}
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
        productList: state.productList,
        productWithoutParentList: state.productWithoutParentList,
        currentProduct:state.currentProduct

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
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductExpandItem);
