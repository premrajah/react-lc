import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import {withStyles} from "@material-ui/core/styles/index";
import ProductItem from "../../components/Products/Item/ProductItem";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import {baseUrl, PRODUCTS_FILTER_VALUES} from "../../Util/Constants";
import RemoveIcon from '@material-ui/icons/Remove';
import {CSVLink} from "react-csv";
import {Modal} from "react-bootstrap";
import UploadMultiSiteOrProduct from "../../components/UploadImages/UploadMultiSiteOrProduct";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {CURRENT_PRODUCT} from "../../store/types";
import SiteItem from "../../components/SiteItem";
import SitePageItem from "../../components/Sites/SitePageItem";

class Sites extends Component {

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

    loadNewPageSetUp=()=>{

        // Create an observer
        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this), //callback
            this.options
        );


        // window.onload = function() {
        if (this.loadingRef)
            this.observer.observe(this.loadingRef);

        // }
    }
    componentDidMount() {

        this.props.loadSites();


    }



    handleObserver=(entities, observer) =>{


       let [entry] = entities

        console.log(entry)


        // if (!this.props.loading)
        // console.log(entry.boundingClientRect.y)

        if (entry.intersectionRatio>this.state.intersectionRatio){

            this.props.dispatchLoadProductsWithoutParentPage({offset:this.props.productPageOffset,size:this.props.productPageSize});

        }


        this.setState({
            intersectionRatio:entry.intersectionRatio
        })

    }


    handleAddToProductsExportList = (returnedItem) => {

        axios
            .get(baseUrl + "product/" + returnedItem._key+ "/expand"
            )
            .then(
                (response) => {

                    // console.log(response.data.data)


                    let productSelected=response.data.data

                    // check if already exists
                    let filteredProduct = this.state.selectedProducts.filter(product => product.product._key !== productSelected.product._key);
                    this.setState({selectedProducts: [...filteredProduct, productSelected]});

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



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


    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const classesBottom = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <Layout>

                <div className="wrapper">



                    <div className="container  mb-150  pb-5 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="Sites"
                            subTitle="All sites created can be found here"
                        />

                        <div className="row">
                            <div className="col-md-9 d-flex justify-content-start">
                                <Link onClick={()=> {
                                    this.props.setSiteForm({show:true,item:this.props.item,type:"new",heading:"Add New Site"})
                                }}  className="btn btn-sm blue-btn mr-2 click-item">
                                   Add Sites/Address
                                </Link>

                                <Link  className="btn btn-sm blue-btn mr-2 click-item">
                                    Bulk Upload Sites/Address(CSV)
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
                                    {
                                        this.props.siteList.length > 0 ? this.props.siteList.length : "... "
                                    }
                                    <span className="ml-1">Sites</span>
                                </p>
                            </div>
                            <div className="text-mute col-auto pl-0">
                                <span style={{ fontSize: "18px" }}>Created</span>
                            </div>
                        </div>
                        <div className={"listing-row-border mb-3"}></div>

                        {this.props.siteList.map((site, index) => (
                            <React.Fragment key={index}>
                                <SitePageItem  showEdit={true} item={site}/>
                            </React.Fragment>
                        ))}

                    </div>


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
            </Layout>
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
        productWithoutParentListPage: state.productWithoutParentListPage,
        productWithoutParentList: state.productWithoutParentList,
        productPageOffset:state.productPageOffset,
        productPageSize:state.productPageSize,
        siteList: state.siteList,

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
        dispatchLoadProductsWithoutParentPage: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentPagination(data)),

        dispatchLoadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Sites);
