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
import PaginationLayoutOld from "../../components/IntersectionOserver/PaginationLayoutOld";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";

class Sites extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            filterValue: '',
            selectedProducts: [],
            showMultiUpload: false,
            items:[],
            lastPageReached:false,
            currentOffset:0,
            productPageSize:50,
            loadingResults:false,
            count:0
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


        // this.props.loadParentSites();

        this.setState({
            items:[]
        })
        this.getTotalCount()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {


        if (prevProps!==this.props) {

            // if (this.props.refresh){
            //
            //     this.props.refreshPage(false)
            //
            //     this.setState({
            //         items:[],
            //         currentOffset:0,
            //     })
            //
            //
            //     if (this.state.currentOffset==0){
            //         this.getTotalCount()
            //
            //         this.loadProductsWithoutParentPageWise();
            //     }
            //
            //
            // }
        }

        }


    getTotalCount=()=>{


        axios
            // .get(`${baseUrl}product/no-parent/no-links`)
            .get(`${baseUrl}site/no-parent/count`)
            .then(
                (response) => {
                    if(response.status === 200) {

                        this.setState({
                            count:(response.data.data),

                        })
                    }

                },
                (error) => {
                }
            )
            .catch(error => {}).finally(()=>{

        });

    }



    loadProductsWithoutParentPageWise=()=>{


        let newOffset=this.state.currentOffset


        axios
            // .get(`${baseUrl}product/no-parent/no-links`)
            .get(`${baseUrl}site/no-parent?offset=${this.state.currentOffset}&size=${this.state.productPageSize}`)
            .then((response) => {
                    if(response.status === 200) {

                        this.setState({
                            items:this.state.items.concat(response.data.data),
                            loadingResults:false,
                            lastPageReached:(response.data.data.length===0?true:false)
                        })
                    }

                },
                (error) => {
                }
            )
            .catch(error => {}).finally(()=>{

        });

        this.setState({

            currentOffset:newOffset+this.state.productPageSize
        })

    }

    toggleMultiSite = () => {

        // this.setState({showMultiUpload: !this.state.showMultiUpload});

        this.props.setMultiplePopUp({show:true,type:"isSite"})
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
                            <div className="col-md-12  justify-content-start">
                                <Link onClick={()=> {
                                    this.props.setSiteForm({show:true,item:this.props.item,type:"new",heading:"Add New Site"})
                                }}  className="btn-gray-border  mr-2  click-item">
                                    Add Sites / Address
                                </Link>

                                <Link onClick={this.toggleMultiSite} className="btn-gray-border    mr-2 click-item">
                                    Upload Multiple Sites (CSV)
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
                                <p style={{ fontSize: "18px" }}
                                   className="text-gray-light ">Showing {this.state.items.filter((site)=>
                                        this.state.filterValue?( this.state.filterValue==="name"?
                                            site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                            this.state.filterValue==="site id"? site.external_reference&&site.external_reference.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                this.state.filterValue==="address"? site.address.toLowerCase().includes(this.state.searchValue.toLowerCase()):null):
                                            (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                site.external_reference&&site.external_reference.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                site.address.toLowerCase().includes(this.state.searchValue.toLowerCase()))).length
                                    }
                                    <span className="ml-1 "> of {this.state.count} Sites</span>
                                </p>
                            </div>

                        </div>


                        <PaginationLayout
                            hideSearch
                            hideCount
                            loadingResults={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            loadMore={this.loadProductsWithoutParentPageWise} >

                        {this.state.items&&this.state.items
                            .filter((site)=>
                                this.state.filterValue?( this.state.filterValue==="name"?
                                site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                this.state.filterValue==="site id"? site.external_reference&&site.external_reference.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                this.state.filterValue==="address"? site.address.toLowerCase().includes(this.state.searchValue.toLowerCase()):null):
                                (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                            site.external_reference&&site.external_reference.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                            site.address.toLowerCase().includes(this.state.searchValue.toLowerCase())))

                            .map((site, index) =>
                            <React.Fragment key={index}>
                                <SitePageItem  showEdit={true} item={site}/>
                            </React.Fragment>
                        )}
                        </PaginationLayout>

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
        lastPageReached:state.lastPageReached,
        refresh:state.refresh

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
        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        dispatchLoadProductsWithoutParentPage: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentPagination(data)),

        dispatchLoadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadParentSites: (data) => dispatch(actionCreator.loadParentSites(data)),
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),
        refreshPage: (data) => dispatch(actionCreator.refreshPage(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Sites);
