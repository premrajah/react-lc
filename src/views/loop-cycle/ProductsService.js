import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import clsx from "clsx";
import CubeBlue from "../../img/icons/product-icon-big.png";
import { Link } from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchGray from "@material-ui/icons/Search";
import {baseUrl, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
import axios from "axios/index";
import { withStyles } from "@material-ui/core/styles/index";
// import ProductItem from "../../components/ProductItemNew";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import ProductItem from "../../components/Products/Item/ProductItem";

class ProductsService extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            products: [],
            searchValue: '',
            filterValue: '',
        };

        this.getProducts = this.getProducts.bind(this);

        this.showProductSelection = this.showProductSelection.bind(this);
    }

    showProductSelection() {
        this.props.showProductPopUp({ type: "create_product", show: true });
    }

    getProducts() {
        this.props.showLoading(true);
        axios
            .get(baseUrl + "product/service-agent", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    this.props.showLoading(false);

                    var responseAll = response.data.data;

                    this.setState({
                        products: responseAll,
                    });
                },
                (error) => {
                    // var status = error.response.status

                    this.props.showLoading(false);
                }
            );
    }


    componentDidMount() {
        this.getProducts();

        this.interval = setInterval(() => {
            this.getProducts();
        }, 15000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }




    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="Product Service"
                            subTitle="Products created can be assigned to resource searches"
                        />

                        <div className="row">
                            <div className="col-12 d-flex justify-content-start">
                                <Link to="/my-products" className="btn btn-sm blue-btn mr-2">
                                    Products
                                </Link>

                                <Link to="/product-archive" className="btn btn-sm blue-btn mr-2">
                                    Records
                                </Link>

                                <Link to="/product-tracked" className="btn btn-sm blue-btn">
                                    Tracked
                                </Link>
                            </div>
                        </div>

                        <div className="row  justify-content-center search-container  pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={PRODUCTS_FILTER_VALUES} />

                            </div>
                        </div>
                        <div className={"listing-row-border "}></div>

                        <div className="row  justify-content-center filter-row    pt-3 pb-3">
                            <div className="col">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                    {this.state.products.filter((item)=> {

                                        let site = item.product

                                        return this.state.filterValue ? (this.state.filterValue === "name" ?
                                            site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue === "condition" ? site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue === "brand" ? site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue === "category" ? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue === "type" ? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue === "state" ? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                this.state.filterValue === "year of manufacture" ? site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                                    this.state.filterValue === "model" ? site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                        this.state.filterValue === "serial no." ? site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                            null) :
                                            (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                                site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                                    }).length} Products
                                </p>
                            </div>
                            <div className="text-mute col-auto pl-0">
                                <span style={{ fontSize: "18px" }}>Created</span>
                            </div>
                        </div>
                        <div className={"listing-row-border mb-3"}></div>

                        {this.state.products.filter((item)=> {

                            let site=item.product


                        return    this.state.filterValue ? (this.state.filterValue === "name" ?
                                site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                this.state.filterValue === "condition" ? site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                    this.state.filterValue === "brand" ? site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                        this.state.filterValue === "category" ? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue === "type" ? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue === "state" ? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue === "year of manufacture" ? site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue === "model" ? site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue === "serial no." ? site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                null) :
                                (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.condition && site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.year_of_making && site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) ||
                                    site.sku.model && site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) ||
                                    site.sku.serial && site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                        } ).map((item) => (
                            <>
                                {/*<Link to={"/product/" + item.product._key}>*/}

                                <ProductItem
                                    goToLink={true}
                                    delete={false}
                                    edit={true}
                                    remove={false}
                                    duplicate={true}
                                    item={item.product}
                                    hideMore={true}
                                />

                                {/*</Link>*/}
                            </>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function SearchField() {
    const classes = useStylesTabs();

    return (
        <TextField
            variant="outlined"
            className={clsx(classes.margin, classes.textField) + " full-width-field"}
            id="input-with-icon-textfield"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchGray style={{ fontSize: 24, color: "#B2B2B2" }} />
                    </InputAdornment>
                ),
            }}
        />
    );
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,

        productWithoutParentList: state.productWithoutParentList,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        showLoading: (data) => dispatch(actionCreator.showLoading(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductsService);
