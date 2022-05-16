import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {withStyles} from "@mui/styles/index";
import PageHeader from "../../components/PageHeader";
import {baseUrl, PRODUCTS_FILTER_VALUES_KEY} from "../../Util/Constants";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {UploadMultiplePopUp} from "../../components/Products/UploadMultiplePopUp";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {createCampaignUrl} from "../../Util/Api";
import AddIcon from '@mui/icons-material/Add';
import CreateCampaign from "./CreateCampaign";
import RightSidebar from "../../components/RightBar/RightSidebar";
import CampaignDetailContent from "../../components/Campaign/CampaignDetailContent";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import {seekAxiosGet} from "../../Util/GlobalFunctions";
import CampaignItem from "../../components/Campaign/CampaignItem";

class MyCampaigns extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            filterValue: '',
            selectedProducts: [],
            showMultiUpload: false,
            isIntersecting:false,
            intersectionRatio:0,
            mapData:[],
            showMap:false,
            showDownloadQrCodes:false,
            fields: {},
            errors: {},
            loading:false,
            items:[],
            createNew:false,
            toggleBar:false,
            editItem:null,
            campaignMode:0,// 0 nothing,1- create,2-view,3 -edit,
            lastPageReached:false,
            offset:0,
            pageSize:50,
            loadingResults:false,
            count:0,
            selectedItem:null

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


    handleChange(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

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


        // this.loadCampaigns()

    }



    setFilters=(data)=>{

        let filters= []
        let subFilter=[]

        let searchValue= data.searchValue
        let activeFilter= data.searchFilter

        if (searchValue){

            if (activeFilter){

                subFilter.push({key:activeFilter, value:"%" + searchValue + "%", operator:"~"})

            }else{

                PRODUCTS_FILTER_VALUES_KEY.forEach((item)=>
                    subFilter.push({key:item.key, value:"%" + searchValue + "%", operator:"~"})
                )


            }
        }


        filters.push({filters:subFilter,operator:"||"})


        this.filters= filters

    }

    seekCount=async () => {


        let url = baseUrl+"seek?name=Campaign&count=true"


        let result = await seekAxiosGet(url)


        this.setState({
            count: result.data?result.data.data:0,
        })
    }


    refreshList=()=>{
        this.setState({
            items:[],
            offset:0
        })

        this.loadCampaignsPageWise({data:{reset:true}})
    }
    loadCampaignsPageWise=async (data) => {


        this.seekCount()

        this.setState({

            loadingResults: true
        })

        let newOffset = this.state.offset

        let url = `${baseUrl}seek?name=Campaign&relation=belongs_to&include-to=Message:any&count=false&offset=${data.reset?0:this.state.offset}&size=${this.state.pageSize}`

        // let url = createSeekURL("Campaign", false, false, data.reset?0:this.state.offset, this.state.pageSize, this.filters, "AND")

        //let url = createSeekURL("campaign")

        let result = await seekAxiosGet(url)


        if (result && result.data && result.data.data) {

            this.state.offset = newOffset + this.state.pageSize

            this.setState({
                items: this.state.items.concat(result.data ? result.data.data : []),
                loadingResults: false,
                lastPageReached: (result.data ? (result.data.data.length === 0 ? true : false) : true),
                offset: newOffset + this.state.pageSize

            })
        } else {

            if (result) {
                this.props.showSnackbar({show: true, severity: "warning", message: "Error: " + result})

                this.setState({

                    loadingResults: false,
                    lastPageReached: true

                })

            }
        }

    }


     loadCampaigns = ()  => {

        axios
            .get(createCampaignUrl, {

            })
            .then(
                (response) => {
                    let responseAll = response.data.data;


                    this.setState({
                        items:responseAll
                    })

                },
                (error) => {
                    // let status = error.response.status
                }
            )
            .catch(error => {});

        // dispatch({ type: "PRODUCT_LIST", value: [] })
    };


    handleObserver=(entities, observer) =>{


       let [entry] = entities


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
                site.campaign.name,
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

        this.props.setMultiplePopUp(true)
    }

    handleMultiUploadCallback = () => {
        this.props.dispatchLoadProductsWithoutParent();
    }


    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }

    toggleMap=()=>{
        this.setState({
            showMap:!this.state.showMap,

        })
    }


    toggleCreate=()=>{
        this.setState({
            campaignMode:1,

        })
    }

    toggleRightBar=(item)=>{

        this.setState({
            toggleBar:!this.state.toggleBar
        })

        if (item){

            this.setState({
                editMode:true,
                editItem:item
            })

        }else{

            this.setState({
                editMode:false,
                editItem:null
            })
        }
              this.props.toggleRightBar()

    }

    toggleDownloadQrCodes=()=>{

        this.setState({
            showDownloadQrCodes:!this.state.showDownloadQrCodes,

        })
    }


    getSitesForProducts=()=>{


        let products=[]

        let mapData=[]

        this.state.selectedProducts.forEach(item => {

            mapData.push({_key:item.product._key,name:item.product.name})
            return products.push(item.product._key)
        })

        axios
            .post(baseUrl + "product/site/get-many", { product_ids:products })
            .then((res) => {

                if (res.status === 200) {

                    let sites=res.data.data


                    for (let i=0;i<mapData.length;i++){
                        let site=sites.find((site)=>site.product_id.replace("Product/","")==mapData[i]._key)

                        mapData[i].site=site.site

                    }


                    this.setState({
                        showMap:!this.state.showMap,
                        mapData: mapData
                    })

                } else {

                }
            })
            .catch((error) => {

                if (error.response)
                    console.log(error)
            });

    }


    handleValidationScaling() {


        let fields = this.state.fields;


        let validations=[
            validateFormatCreate("count", [{check: Validators.required, message: 'Required'},{check: Validators.number, message: 'This field should be a number.'}],fields)

        ]





        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });
        return formIsValid;
    }

    toggleEditMode=(item)=> {

        console.log(item)
        this.setState({
            selectedItem:item,
            campaignMode:3
        })

    }

    render() {
        const classesBottom = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <Layout>

                <div className="wrapper">

                    <RightSidebar heading={this.state.campaignMode ==1? "Create Campaign":this.state.campaignMode ==2?"Campaign Details":"Edit Campaign"} toggleOpen={()=>this.toggleRightBar()} open={this.state.toggleBar} width={"70%"}>
<>

                        {this.state.campaignMode ==1 &&
                        <CreateCampaign  refreshData={
                            ()=> {
                                this.setState({
                                    campaignMode:0
                                });
                                this.toggleRightBar()
                                this.refreshList()

                            }} />
                        }
                        {this.state.campaignMode ==3 && this.state.selectedItem&&
                        <CreateCampaign item={this.state.selectedItem}
                              refreshData={ ()=> { this.toggleRightBar()
                                        this.refreshList()
                                         this.setState({
                                         campaignMode:0
                                                     });
                                                }}
                        />}

                        {this.state.campaignMode ==2
                        && this.state.editItem &&
                        <CampaignDetailContent toggleEditMode={this.toggleEditMode} item={this.state.editItem} />}


                        </>
                    </RightSidebar>
                    <div className="container  mb-150  pb-4 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="Ad Campaigns"
                            subTitle="All your ad campaigns can be found here"
                        />

                        <div className="row text-right">
                            <div className="col-12 d-flex text-right">


                                <div  className={
                                    " mb-4  "}>
                                    <button

                                        onClick={()=> {
                                            this.setState({
                                                campaignMode:1
                                            })
                                            this.toggleRightBar()}}
                                        className={
                                            "btn-gray-border "
                                        }>
                                        <AddIcon />
                                        <span>
                                                        Create
                                                    </span>
                                    </button>

                                </div>

                            </div>


                        </div>

                        {this.state.createNew&&
                        <CreateCampaign />
                        }



                        <div className="row">
                                <div className="col-md-12">
                                    <div className="table-wrap">
                                        <table className="table custom-table ">
                                            <thead>
                                            <tr className={"text-bold"}>
                                                <th>&nbsp;</th>
                                                <th>Campaign Name</th>
                                                <th>Validity</th>
                                                <th>Stage</th>
                                                <th>Artifacts</th>
                                                <th>&nbsp;</th>
                                            </tr>
                                            </thead>
                                            <tbody>


                                            <PaginationLayout
                                                hideSearch
                                                hideCount

                                                dropDownValues={PRODUCTS_FILTER_VALUES_KEY}
                                                count={this.state.count}
                                                visibleCount={this.state.items.length}
                                                loadingResults={this.state.loadingResults}
                                                lastPageReached={this.state.lastPageReached}
                                                loadMore={(data)=>this.loadCampaignsPageWise(data)} >

                                                {this.state.items
                                                    .map((item, index) => (


                                                            <CampaignItem item={item} index={index}
                                                                          toggleRightBar={(data)=>{
                                                                              this.setState({
                                                                                  campaignMode:2
                                                                              });
                                                                              this.toggleRightBar(data);
                                                                          }}
                                                            />
                                                        )
                                                    )}
                                            </PaginationLayout>




                                            </tbody>
                                        </table>
                                    </div>

                            </div>
                        </div>


                    </div>

                </div>



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
        lastPageReached:state.lastPageReached,
        showRightBar:state.showRightBar,


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
        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
        dispatchLoadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        toggleRightBar: (data) => dispatch(actionCreator.toggleRightBar(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyCampaigns);
