import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {withStyles} from "@mui/styles/index";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import {baseUrl, SITES_FILTER_VALUES} from "../../Util/Constants";
import {Modal} from "react-bootstrap";
import UploadMultiSiteOrProduct from "../../components/UploadImages/UploadMultiSiteOrProduct";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import SitePageItem from "../../components/Sites/SitePageItem";

class Sites extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            filterValue: '',
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
        console.log("searchValue ",searchValue)
        this.setState({searchValue: searchValue});
    }

    handleSearchFilter = (filterValue) => {
        console.log("filtervalue ",filterValue)
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

        // this.props.loadSites();

        this.props.loadParentSites();
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

        this.props.loadSites();
    }


    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const classesBottom = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <Layout>

                    <div className="container  mb-150  pb-4 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="Sites"
                            subTitle="All your added sites can be found here"
                        />

                        <div className="row">
                            <div className="col-md-9 d-flex justify-content-start">
                                <Link onClick={()=> {
                                    this.props.setSiteForm({show:true,item:this.props.item,type:"new",heading:"Add New Site"})
                                }}  className="btn-gray-border  mr-2 click-item">
                                    Add Sites / Address
                                </Link>

                                <Link onClick={this.toggleMultiSite} className="btn-gray-border  mr-2 click-item">
                                    Upload Multiple Sites / Addresses (CSV)
                                </Link>
                            </div>
                        </div>
                        <div className="row  justify-content-center search-container  pt-3 pb-3">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={SITES_FILTER_VALUES} />
                            </div>
                        </div>

                        <div className="row  justify-content-center filter-row   pb-3">
                            <div className="col">
                                <p style={{ fontSize: "18px" }} className="text-gray-light ">
                                    {this.props.siteParentList.filter((site)=>
                                        this.state.filterValue?( this.state.filterValue==="name"?
                                            site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                            this.state.filterValue==="site id"? site.external_reference&&site.external_reference.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                this.state.filterValue==="address"? site.address.toLowerCase().includes(this.state.searchValue.toLowerCase()):null):
                                            (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                site.external_reference&&site.external_reference.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                site.address.toLowerCase().includes(this.state.searchValue.toLowerCase()))



                                    ).length
                                    }
                                    <span className="ml-1 ">Sites Listed</span>
                                </p>
                            </div>

                        </div>


                        {this.props.siteParentList.filter((site)=>
                                this.state.filterValue?( this.state.filterValue==="name"?
                                site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                this.state.filterValue==="site id"? site.external_reference&&site.external_reference.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                this.state.filterValue==="address"? site.address.toLowerCase().includes(this.state.searchValue.toLowerCase()):null):
                                (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                            site.external_reference&&site.external_reference.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                            site.address.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                            )

                            .map((site, index) => (
                            <React.Fragment key={index}>
                                <SitePageItem  showEdit={true} item={site}/>
                            </React.Fragment>
                        ))}

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
        siteParentList: state.siteParentList,
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
        loadParentSites: (data) => dispatch(actionCreator.loadParentSites(data)),
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Sites);
