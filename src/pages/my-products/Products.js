import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {withStyles} from "@mui/styles/index";
import ProductItem from "../../components/Products/Item/ProductItem";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import {baseUrl, PRODUCTS_FILTER_VALUES, PRODUCTS_FILTER_VALUES_KEY} from "../../Util/Constants";
import DownloadIcon from '@mui/icons-material/GetApp';
import MapIcon from '@mui/icons-material/Map';
import {CSVLink} from "react-csv";
import {Modal, ModalBody} from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {UploadMultiplePopUp} from "../../components/Products/UploadMultiplePopUp";
import {ProductsGoogleMap} from "../../components/Map/ProductsMapContainer";
import Close from "@mui/icons-material/Close";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import CustomPopover from "../../components/FormsUI/CustomPopover";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import {createSeekURL, seekAxiosGet} from "../../Util/GlobalFunctions";

class Products extends Component {

    constructor(props) {
        super(props);
        this.state = {

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
            lastPageReached:false,
            offset:0,
            pageSize:50,
            loadingResults:false,
            count:0,


        }

        this.showProductSelection = this.showProductSelection.bind(this);
    }
    filters=[]
    searchValue=''
    filterValue= ''
    offset=0
    pageSize=50




    showProductSelection() {
        this.props.showProductPopUp({ type: "create_product", show: true });
    }




    clearList=()=>{

        this.setState({
            offset:0,
            items:[],
            lastPageReached:false,
            loadingResults: false,
        })
    }

    setFilters=(data)=>{

        let filters= []
        let subFilter=[]

        let searchValue= data.searchValue
        let activeFilter= data.filterValue

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

    handleChange(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }


    seekCount=async () => {

        let url = createSeekURL("product", true, true, null, null,
            this.filters, "AND")


        let result = await seekAxiosGet(url)



        this.setState({
            count: result.data.data,

        })



    }

    loadProductsWithoutParentPageWise= async (data) => {

        console.log(data)

        if (data.reset){

            this.clearList()
        }
        this.setFilters(data)

        this.seekCount()

        this.setState({

            loadingResults: true
        })

        let newOffset = this.state.offset


        let url = createSeekURL("product", true, false, data.reset?0:this.state.offset, this.state.pageSize, this.filters, "AND")

        let result = await seekAxiosGet(url)


        if (result && result.data && result.data.data) {

            this.state.offset= newOffset + this.state.pageSize

            this.setState({
                items: this.state.items.concat(result.data.data),
                loadingResults: false,
                lastPageReached: (result.data.data.length === 0 ? true : false),
                offset: newOffset + this.state.pageSize

            })
        }else{

            if (result) {
                this.props.showSnackbar({show: true, severity: "warning", message: "Error: " + result})

                this.setState({

                    loadingResults: false,

                })

            }
        }

        // console.log(result)


    }

    componentDidMount() {


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

    downloadMultipleQrCodes = (event) => {

        event.preventDefault();


        if (this.state.type!="delete"&&!this.handleValidationScaling()){

            return

        }

        this.setState({
            loading: true,
        });

        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);
        const count = data.get("count");

        window.location.href = `${baseUrl}product/multi-qr?count=${count}`;

        this.toggleDownloadQrCodes()




    }

    render() {
        const classesBottom = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <Layout>

                <>

                    {this.state.selectedProducts.length > 0 ?
                        <div className="sticky-top-csv slide-rl" style={{top: '68px',position:"fixed",zIndex:"100"}}>
                            <div className="float-right mr-1 p-3" style={{width: '240px', maxWidth: '300px', height: 'auto',  boxShadow: '0 2px 30px 0 rgba(0,0,0,.15)', backgroundColor: '#fff'}}>
                                <div className="row no-gutters mb-2 pb-2 " style={{borderBottom: '1px solid #70707062'}}>
                                    <div className="col-12  ">
                                        <a onClick={this.getSitesForProducts}  className=" btn-sm btn-gray-border  mr-2">
                                            {/*<MapIcon style={{fontSize:"20px"}} /> */}
                                            Locations</a>

                                        <CSVLink data={this.handleSaveCSV()} headers={headers} filename={`product_list_${new Date().getDate()}.csv`} className=" btn-sm btn-gray-border  mr-2"><>
                                            <DownloadIcon  style={{fontSize:"20px"}} />
                                            CSV</></CSVLink>
                                    </div>

                                </div>
                                <div className="row  no-gutters mb-1">
                                    <div className="col blue-text">Selected Products</div>

                                    <button className=" btn-pink " onClick={() => this.setState({selectedProducts: []})}><>Clear</></button>
                                </div>

                                <div className="row" style={{overflowY:"auto",maxHeight:"250px",}}>
                                    <div className="col">
                                        {this.state.selectedProducts.map((product, index) => (
                                            <div key={index} onClick={() => this.removeFromSelectedProducts(index)} style={{cursor: 'pointer',
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden"}}><IndeterminateCheckBoxIcon style={{opacity:"0.5"}} className={"text-blue"} /> {product.product.name}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div> : null }

                    <div className="container  mb-150  pb-4 pt-4">
                        <PageHeader

                            pageIcon={CubeBlue}
                            pageTitle="Products"
                            subTitle="All your added products can be found here"
                        />

                        <div className="row">
                            <div className="col-md-12 btn-rows">
                                <Link to="/products-service" className=" btn-sm btn-gray-border mr-2">
                                    <CustomPopover text={" All of the products that you are responsible for as the Service Agent. The service agent is responsible for solving any issues that are reported by the owner of the product. "}>Service</CustomPopover>
                                </Link>

                                <Link to="/product-archive" className=" btn-sm btn-gray-border  mr-2">
                                    <CustomPopover text={"All of your products that have been released to another and are now out of your possession. Records gives you the ability to interact with the user of the product and by seeing the provenance of where the products are currently. "}> Records</CustomPopover>
                                </Link>

                                <Link to="/product-tracked" className=" btn-sm btn-gray-border  mr-2">
                                    <CustomPopover text={"Products that have entered the platform from another user that have your Brand attached to them. You have therefore wanted to know the provenance of these products and have now tracked these"}>Tracked</CustomPopover>
                                </Link>

                                <Link to="/issues" className=" btn-sm btn-gray-border mr-2  ">Issues</Link>
                                <CustomPopover text=" Cyclecode is a unique product’s ID. An open Cyclecode isn’t attached to a specific product yet, allowing you to print multiple stickers before assigning them to products."><button className="btn btn-sm mt-mobile btn-gray-border" onClick={() => this.toggleDownloadQrCodes()} type="button">Download Open Cyclecodes</button></CustomPopover>
                                <button className="d-none btn btn-sm btn-gray-border ml-1" onClick={() => this.toggleMultiSite()} type="button">Upload Multiple Products</button>
                            </div>



                        </div>


                        <PaginationLayout

                            dropDownValues={PRODUCTS_FILTER_VALUES_KEY}
                            count={this.state.count}
                            visibleCount={this.state.items.length}
                            loadingResults={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            loadMore={(data)=>this.loadProductsWithoutParentPageWise(data)} >

                            {this.state.items.map((item, index) => (
                                <div id={item._key} key={item._key}>
                                    <ProductItem
                                        index={index}
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

                        </PaginationLayout>

                    </div>


                </>

                <Modal
                    // className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    show={this.state.showMap}
                    centered
                    size={"lg"}
                    onHide={this.toggleMap}
                    animation={false}>
                    <ModalBody>
                        <div className=" text-right web-only">
                            <Close
                                onClick={this.toggleMap}
                                className="blue-text click-item"
                                style={{ fontSize: 32 }}
                            />
                        </div>

                        <div className={"row justify-content-center"}>
                            <ProductsGoogleMap mapData={this.state.mapData} width="700px" height="400px"/>

                        </div>
                    </ModalBody>
                </Modal>
                }


                <Modal
                    // className={"loop-popup"}
                    aria-labelledby="contained-modal-title-vcenter"
                    show={this.state.showDownloadQrCodes}
                    centered
                    // size={"lg"}
                    onHide={this.toggleDownloadQrCodes}
                    animation={false}>
                    <ModalBody>
                        <div className=" text-right web-only">
                            <Close
                                onClick={this.toggleDownloadQrCodes}
                                className="blue-text click-item"
                                style={{ fontSize: 32 }}
                            />
                        </div>
                        <div className={"row justify-content-center"}>
                            <div className={"col-10 text-center"}>
                                <h5
                                    style={{ textTransform: "Capitalize" }}
                                    className={"text-bold text-blue"}>
                                    Download Multiple QR Codes
                                </h5>
                            </div>
                        </div>

                        <div className={"row justify-content-center"}>
                            <form onSubmit={this.downloadMultipleQrCodes}>

                                <div className="row mb-2 text-center">


                                    <div className="col-12 ">

                                        <TextFieldWrapper
                                            // readonly ={this.state.disableVolume}
                                            initialValue={this.state.selectedItem&&this.state.selectedItem.factor+""}
                                            // value={this.state.disableVolume?"0":""}
                                            onChange={(value)=>this.handleChange(value,"count")}
                                            error={this.state.errors["count"]}
                                            name="count" title="Enter required number of Qr codes to be downloaded" />

                                    </div>



                                </div>


                                <div className={"row"}>
                                    <div className="col-12 mt-4">
                                        <button
                                            type={"submit"}
                                            className={
                                                "btn btn-default btn-lg btn-rounded shadow  btn-green login-btn"
                                            }>
                                            {"Download"}
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </ModalBody>
                </Modal>

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
        pageSize:state.pageSize,
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
        // resetProductPageOffset: (data) =>
        //     dispatch(actionCreator.resetProductPageOffset(data)),

        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
        dispatchLoadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Products);
