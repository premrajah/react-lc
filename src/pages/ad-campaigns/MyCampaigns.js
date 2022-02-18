import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {withStyles} from "@mui/styles/index";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import {baseUrl, CAMPAIGN_FILTER_VALUES} from "../../Util/Constants";
import moment from "moment/moment";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {UploadMultiplePopUp} from "../../components/Products/UploadMultiplePopUp";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {createCampaignUrl} from "../../Util/Api";
import AddIcon from '@mui/icons-material/Add';
import CreateCampaign from "./CreateCampaign";
import RightSidebar from "../../components/RightBar/RightSidebar";
import CampaignDetailContent from "../../components/Campaign/CampaignDetailContent";

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
            campaignMode:0// 0 nothing,1- create,2-view,3 -edit

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



        this.loadCampaigns()

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

        this.setState({
            campaignMode:3
        })

    }

    render() {
        const classesBottom = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <Layout>

                <div className="wrapper">

                    <RightSidebar  toggleOpen={()=>this.toggleRightBar()} open={this.state.toggleBar} width={"70%"}>

                        {this.state.campaignMode ==1 && <CreateCampaign  refreshData={

                            ()=> {this.loadCampaigns()
                                this.setState({
                                    campaignMode:0
                                });
                            }} />}
                        {this.state.campaignMode ==3 &&  this.state.editItem&& <CreateCampaign item={this.state.editItem} refreshData={()=> this.loadCampaigns()} />}

                        {this.state.campaignMode ==2 && this.state.editItem && <CampaignDetailContent toggleEditMode={this.toggleEditMode} item={this.state.editItem} />}

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

                        <div className="row d-none  justify-content-center search-container  pt-3 pb-4">
                            <div className={"col-12"}>
                                <SearchBar onSearch={(sv) => this.handleSearch(sv)}  onSearchFilter={(fv) => this.handleSearchFilter(fv)}  dropDown dropDownValues={CAMPAIGN_FILTER_VALUES} />
                            </div>
                        </div>
                        <div className={"d-none listing-row-border "}></div>

                        <div className="row d-none justify-content-center filter-row    pt-3 pb-3">
                            <div className="col-8">
                                <p style={{ fontSize: "18px" }} className="text-mute mb-1">
                                    {this.state.items.filter((site)=>
                                            this.state.filterValue?( this.state.filterValue==="name"?
                                                site.campaign.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                this.state.filterValue==="description"?site.campaign.description&&site.description.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                    null):
                                                (site.campaign.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                   site.campaign.description&&site.description.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                                        ).length

                                    }
                                    <span className="ml-1">Campaigns Found</span>
                                </p>
                            </div>
                            <div className="text-mute col-2 pl-0 text-right">
                                <span style={{ fontSize: "18px" }}>Start Data</span>
                            </div>
                            <div className="text-mute col-2 pl-0 text-right">
                                <span style={{ fontSize: "18px" }}>End Date</span>
                            </div>
                        </div>
                        <div className={" d-none listing-row-border mb-3"}></div>

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
                                            {
                                                this.state.items.filter((site)=>
                                                    this.state.filterValue?( this.state.filterValue==="name"?
                                                        site.campaign.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                        this.state.filterValue==="description"?site.campaign.description&&site.description.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                            null):
                                                        (site.campaign.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                           site.campaign.description&&site.description.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                                                )
                                                    .map((item, index) => (


                                                            <tr className="" role="alert">

                                                                <td>{index+1}</td>

                                                <td className="d-flex align-items-center">

                                                    {/*<Link to={"/campaign/"+item.campaign._key}>*/}
                                                        <div className="pl-3 email">
                                                        <span className={"title-bold text-blue text-capitlize"}>{item.campaign.name}</span>
                                                        <span className={"text-gray-light"}>{moment(item.campaign._ts_epoch_ms).format("DD MMM YYYY")}</span>
                                                    </div>
                                                    {/*</Link>*/}
                                                </td>
                                                <td className={"text-gray-light"}>{moment(item.campaign.start_ts).format("DD MMM YYYY")} - {moment(item.campaign.end_ts).format("DD MMM YYYY")}</td>
                                                <td className="status text-capitlize"><span className={item.campaign.stage==="active"?"active":"waiting"}>{item.campaign.stage}</span></td>

                                                                <td>
                                                                    <ul className="persons">

                                                                        {item.artifacts && item.artifacts.map((artifact, i)=>
                                                                            <li key={i}>
                                                                                <div className="d-flex justify-content-center align-items-center" style={{width: "60px", height: "60px"}}>
                                                                                    <div className="d-flex justify-content-center align-items-center" style={{  width: "50%", height: "50%"}}>
                                                                                        <img
                                                                                            src={artifact ? artifact.blob_url : ""}
                                                                                            className="img-fluid w-100 h-100"
                                                                                            alt={artifact.name}
                                                                                            style={{borderRadius: "50%", objectFit: "contain"}}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        )}

                                                                    </ul>
                                                                </td>
                                                       <td>
                                                           {/*<EditIcon onClick={()=>this.toggleRightBar(item)}  />*/}

                                                           <span className={"text-bold"} style={{cursor: "pointer"}} onClick={()=>
                                                           {

                                                           this.setState({
                                                               campaignMode:2
                                                           });
                                                               this.toggleRightBar(item)

                                                           } } >
                                                           View Details</span>
                                                </td>

                                            </tr>

                                                            ))}

                                            </tbody>
                                        </table>
                                    </div>

                            </div>
                        </div>



                        {this.state.items.filter((site)=>
                                this.state.filterValue?( this.state.filterValue==="name"?
                                    site.campaign.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                    this.state.filterValue==="condition"? site.condition&&site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                        this.state.filterValue==="brand"? site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue==="category"? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue==="type"? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue==="state"? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue==="year of manufacture"? site.year_of_making&&site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue==="model"? site.sku.model&&site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                this.state.filterValue==="serial no."?site.sku.serial&& site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                    null):
                                    (site.campaign.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                        site.condition&&site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                        site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                        site.category.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                        site.type.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                        site.state.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                        site.year_of_making&&site.year_of_making.toString().includes(this.state.searchValue.toLowerCase())||
                                        site.sku.model&& site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                        site.sku.serial&&site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                            ).length===0&&
                            <div className="row  justify-content-center filter-row    pt-3 pb-3">
                                <div   className="col">
                                    <div>No campaigns found!</div>
                                </div>
                            </div>

                        }

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

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyCampaigns);
