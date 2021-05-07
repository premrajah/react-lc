import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import HeaderDark from "../header/HeaderDark";
import Sidebar from "../menu/Sidebar";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles/index";
import ProductItem from "../../components/ProductItemNew";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";

class Products extends Component {


    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            filterValue: '',
            filteredContent: props.productWithoutParentList.length > 0 ? props.productWithoutParentList : [],
        }

        this.showProductSelection = this.showProductSelection.bind(this);
    }

    showProductSelection() {
        this.props.showProductPopUp({ type: "create_product", show: true });
    }

    handleSearch = (searchValue) => {
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        this.setState({filterValue: filterValue});
    }

    componentDidMount() {

        this.props.loadProductsWithoutParent(this.props.userDetail.token);

        // this.interval = setInterval(() => {
        //     this.props.loadProductsWithoutParent(this.props.userDetail.token);
        // }, 15000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const classesBottom = withStyles();
        const filterArray = ["name", "description", "condition", "purpose", "category"];


        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    <div className="container  pb-4 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="My Products"
                            subTitle="Products created can be assigned to resource searches"
                        />

                        <div className="row">
                            <div className="col-12 d-flex justify-content-end">
                                <Link to="/products-service" className="btn btn-sm blue-btn mr-2">
                                    Product Service
                                </Link>

                                <Link to="/product-archive" className="btn btn-sm blue-btn">
                                    Product Record
                                </Link>
                            </div>
                        </div>

                        <div className="row  justify-content-center search-container  pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)} /* onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={filterArray}*/ />
                            </div>
                        </div>
                        <div className={"listing-row-border "}></div>

                        <div className="row  justify-content-center filter-row    pt-3 pb-3">
                            <div className="col">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                    {
                                        this.state.filteredContent.length > 0 ? this.state.filteredContent.filter(
                                            (item) => item.product.is_listable === true
                                        ).length : "... "
                                    }
                                    <span className="ml-1">Products</span>
                                </p>
                            </div>
                            <div className="text-mute col-auto pl-0">
                                <span style={{ fontSize: "18px" }}>Created</span>
                            </div>
                        </div>
                        <div className={"listing-row-border mb-3"}></div>

                        {this.state.filteredContent.length > 0 ? this.state.filteredContent.filter((filterV) => {
                            return filterV.product.name.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1
                        }).map((item, index) => (
                            <div key={index}>
                                <ProductItem
                                    goToLink={true}
                                    delete={false}
                                    edit={false}
                                    remove={false}
                                    duplicate={false}
                                    item={item}
                                    hideMore
                                />
                            </div>
                        )): null}
                    </div>

                    <React.Fragment>
                        <CssBaseline />

                        <AppBar
                            position="fixed"
                            style={{backgroundColor: "#ffffff"}}
                            className={classesBottom.appBar + "  custom-bottom-appbar"}>
                            <Toolbar>
                                <div
                                    className="row  justify-content-center search-container "
                                    style={{ margin: "auto" }}>
                                    <div className="col-auto" style={{cursor: 'pointer' }}>
                                        <a onClick={this.showProductSelection}>
                                            <p className={"green-text bottom-bar-text"}>
                                                <b>Create New Product</b>
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </Toolbar>
                        </AppBar>
                    </React.Fragment>
                </div>
            </div>
        );
    }
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

const mapDispatchToProps = (dispatch) => {
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
export default connect(mapStateToProps, mapDispatchToProps)(Products);
