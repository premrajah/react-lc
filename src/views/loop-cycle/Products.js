import React, {Component,useRef, useState,useEffect} from "react";
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
import {PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
import RemoveIcon from '@material-ui/icons/Remove';
import {CSVLink} from "react-csv";
import {Modal} from "react-bootstrap";
import UploadMultiSiteOrProduct from "../../components/UploadImages/UploadMultiSiteOrProduct";
import {ref} from "yup";


class Products extends Component {



    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            filterValue: 'name',
            selectedProducts: [],
            showMultiUpload: false,
            isIntersecting:false,
            intersectionRatio:0

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


    // Options
     options = {
        root: null, // Page as root
        rootMargin: '0px',
        threshold: 1.0
    };

    componentDidMount() {

        this.props.loadSites();
        this.props.dispatchLoadProductsWithoutParent({offset:this.props.productPageOffset,size:this.props.productPageSize});

        // this.interval = setInterval(() => {
        //     this.props.dispatchLoadProductsWithoutParent();
        // }, 15000);



        // Create an observer
        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this), //callback
            this.options
        );
        //Observ the `loadingRef`
        this.observer.observe(this.loadingRef);


    }


    handleObserver=(entities, observer) =>{


       let [entry] = entities

        console.log(entry)


        // if (!this.props.loading)
        // console.log(entry.boundingClientRect.y)

        if (entry.intersectionRatio>this.state.intersectionRatio&!this.props.loading){

            this.props.dispatchLoadProductsWithoutParent({offset:this.props.productPageOffset+1,size:this.props.productPageSize});

        }


        this.setState({
            intersectionRatio:entry.intersectionRatio
        })

    }


    handleAddToProductsExportList = (returnedItem) => {
        // check if already exists
        let filteredProduct = this.state.selectedProducts.filter(product => product.product._key !== returnedItem.product._key);
        this.setState({selectedProducts: [...filteredProduct, returnedItem]});
    }

    removeFromSelectedProducts = (i) => {
        this.setState(state => {
            const selectedProducts = state.selectedProducts.filter((product, j) => i !== j);
            return {
                selectedProducts,
            }
        })
    }

    handleSaveCSV = () => {

        const csvData = [];
        this.state.selectedProducts.forEach(item => {
            const {product, site, service_agent, qr_artifact} = item;
            return csvData.push([
                product.name,
                product.description,
                product.category,
                product.condition,
                product.purpose,
                product.units,
                product.volume,
                site.name,
                site.address,
                service_agent.name,
                qr_artifact.name,
                qr_artifact.blob_url
            ])
        })

        return csvData;
    }

    toggleMultiSite = () => {
        this.setState({showMultiUpload: !this.state.showMultiUpload});
    }

    handleMultiUploadCallback = () => {
        this.props.dispatchLoadProductsWithoutParent();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }



    render() {
        const classesBottom = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <div>
                <Sidebar />
                <div className="wrapper">
                    <HeaderDark />

                    {this.state.selectedProducts.length > 0 ?  <div className="sticky-top-csv slide-rl" style={{top: '68px',position:"fixed",zIndex:"100"}}>
                        <div className="float-right mr-1 p-3" style={{width: '220px', maxWidth: '300px', height: 'auto',  border: '1px solid #27245C', backgroundColor: '#fff'}}>
                            <div className="row mb-2 pb-2" style={{borderBottom: '1px solid #27245C'}}>
                                <div className="col d-flex justify-content-end">
                                    <CSVLink data={this.handleSaveCSV()} headers={headers} filename={`product_list_${new Date().getDate()}.csv`} className="btn btn-sm btn-green"><b>Save CSV</b></CSVLink>
                                    <button className="btn btn-sm btn-pink ml-2" onClick={() => this.setState({selectedProducts: []})}><b>Clear</b></button>
                                </div>
                            </div>
                            <div className="row mb-1">
                                <div className="col blue-text">Selected Products</div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    {this.state.selectedProducts.map((product, index) => (
                                            <div key={index} onClick={() => this.removeFromSelectedProducts(index)} style={{cursor: 'pointer'}}><RemoveIcon color="secondary" /> {product.product.name}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div> : null }

                    <div className="container  mb-150  pb-5 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="My Products"
                            subTitle="All products created can be found here"
                        />

                        <div className="row">
                            <div className="col-md-9 d-flex justify-content-start">
                                <Link to="/products-service" className="btn btn-sm blue-btn mr-2">
                                    Product Service
                                </Link>

                                <Link to="/product-archive" className="btn btn-sm blue-btn mr-2">
                                    Records
                                </Link>

                                <Link to="/product-tracked" className="btn btn-sm blue-btn">
                                    Tracked
                                </Link>
                            </div>

                            <div className="col-md-3 d-flex justify-content-end">
                                <button className="btn btn-sm blue-btn" onClick={() => this.toggleMultiSite()} type="button">Upload Multiple Products</button>
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
                                    {
                                        this.props.productWithoutParentList.length > 0 ? this.props.productWithoutParentList.filter(
                                            (item) => item.product.is_listable === true
                                        ).length : "... "
                                    }
                                    <span className="ml-1">Listable Products</span>
                                </p>
                            </div>
                            <div className="text-mute col-auto pl-0">
                                <span style={{ fontSize: "18px" }}>Created</span>
                            </div>
                        </div>
                        <div className={"listing-row-border mb-3"}></div>

                        {this.props.productWithoutParentList.length > 0 && this.props.productWithoutParentList.filter((filterV) => {
                            return filterV.product[this.state.filterValue].toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1
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
                                    listOfProducts={(returnedItem) => this.handleAddToProductsExportList(returnedItem)}
                                    showAddToListButton
                                />
                            </div>
                        ))}

                        {!this.props.lastPageReached &&<div className="row  justify-content-center filter-row    pt-3 pb-3">
                            <div  ref={loadingRef => (this.loadingRef = loadingRef)} className="col">
                                <div>Loading products please wait ...</div>
                            </div>
                        </div>}
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

                {this.state.showMultiUpload && (
                    <>
                        <Modal size="lg" show={this.state.showMultiUpload} backdrop="static" onHide={() => this.toggleMultiSite()}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    <div className="row">
                                        <div className="col">
                                            <h4 className="text-center green-text">Upload Multiple</h4>
                                        </div>
                                    </div>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <UploadMultiSiteOrProduct isProduct multiUploadCallback={() => this.handleMultiUploadCallback()} />
                            </Modal.Body>
                        </Modal>
                    </>
                )}
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
        productPageOffset:state.productPageOffset,
        productPageSize:state.productPageSize,
        lastPageReached:state.lastPageReached
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
        dispatchLoadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Products);
