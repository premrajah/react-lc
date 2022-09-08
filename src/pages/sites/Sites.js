import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {withStyles} from "@mui/styles/index";
import PageHeader from "../../components/PageHeader";
import {baseUrl, SITES_FILTER_VALUES} from "../../Util/Constants";
import {Modal} from "react-bootstrap";
import UploadMultiSiteOrProduct from "../../components/UploadImages/UploadMultiSiteOrProduct";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import SitePageItem from "../../components/Sites/SitePageItem";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import {seekAxiosGet} from "../../Util/GlobalFunctions";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import SiteFormNew from "../../components/Sites/SiteFormNew";

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

            offset:0,
            pageSize:50,
            loadingResults:false,
            count:0,
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




    componentDidUpdate(prevProps, prevState, snapshot) {


        if (prevProps!==this.props) {

            if (this.props.refresh){
                this.props.refreshPage(false)

                this.setState({
                    items:[],
                    offset:0,
                })

            }
        }

    }


    componentDidMount() {

        this.setState({
            items:[]
        })

    }


    setFilters=(data)=>{


        let subFilter=[]

        let searchValue= data.searchValue
        let activeFilter= data.searchFilter

        if (searchValue){

            if (activeFilter){

                subFilter.push({key:activeFilter, value:searchValue})

            }else{

                SITES_FILTER_VALUES.forEach((item)=>
                    subFilter.push({key:item.key, value:searchValue})
                )


            }
        }


        this.filters= subFilter

    }



    seekCount=async () => {

        let url = `${baseUrl}seek?name=Site&no_parent=true&count=true`;

        this.filters.forEach((item)=>{

            url = url+`&or=${item.key}~%${item.value}%`

        })


        let result = await seekAxiosGet(url)


        this.setState({
            count: result.data?result.data.data:0,


        })



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



    loadSitesWithoutParentPageWise= async (data) => {


        if (data&&data.reset){

            this.clearList()
        }

        if (data)
            this.setFilters(data)

        this.seekCount()

        this.setState({

            loadingResults: true
        })

        let newOffset = this.state.offset


        // let url = createSeekURL("product", true,
        //     false, data.reset?0:this.state.offset, this.state.pageSize, this.filters, "AND")


        let url = `${baseUrl}seek?name=Site&no_parent=true&count=false&offset=${this.state.offset}&size=${this.state.pageSize}`;

        this.filters.forEach((item)=>{

            url = url+`&or=${item.key}~%${item.value}%`

        })


        let result = await seekAxiosGet(url)


        if (result && result.data && result.data.data) {

            this.state.offset= newOffset + this.state.pageSize

            this.setState({
                items: this.state.items.concat(result.data?result.data.data:[]),
                loadingResults: false,
                lastPageReached: (result.data?(result.data.data.length === 0 ? true : false):true),
                offset: newOffset + this.state.pageSize

            })
        }else{

            if (result) {
                this.props.showSnackbar({show: true, severity: "warning", message: "Error: " + result})

                this.setState({

                    loadingResults: false,
                    lastPageReached:true

                })

            }
        }



    }

    clearList=()=>{

        this.setState({
            offset:0,
            items:[],
            lastPageReached:false,
            loadingResults: false,
        })
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

    toggleSite=(refresh) =>{
        if (refresh){

            this.loadSitesWithoutParentPageWise({reset:true})
        }

        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });
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
                                    this.toggleSite(false)
                                }}  className="btn-gray-border  me-2  click-item">
                                    Add Sites / Address
                                </Link>

                                <Link onClick={this.toggleMultiSite} className="btn-gray-border    me-2 click-item">
                                    Upload Multiple Sites (CSV)
                                </Link>
                            </div>
                        </div>


                        <PaginationLayout
                            dropDownValues={SITES_FILTER_VALUES}
                            count={this.state.count}
                            visibleCount={this.state.items.length}
                            loadingResults={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            loadMore={(data)=>this.loadSitesWithoutParentPageWise(data)}

                        >

                        {this.state.items&&this.state.items
                            .map((site, index) =>
                            <React.Fragment key={index}>
                                <SitePageItem  showEdit={true} item={site.Site}/>
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


                <GlobalDialog

                    size={"sm"}
                    hide={this.toggleSite}
                    show={this.state.showCreateSite}
                    heading={"Add new site"}>
                    <>
                        {this.state.showCreateSite && <div className="col-12 ">

                            <SiteFormNew refresh={()=>this.toggleSite(true)} />
                        </div>}
                    </>
                </GlobalDialog>
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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Sites);
