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
import DownloadIcon from '@material-ui/icons/GetApp';
import MapIcon from '@material-ui/icons/Map';

import {CSVLink} from "react-csv";
import {Modal, ModalBody, Spinner} from "react-bootstrap";
import UploadMultiSiteOrProduct from "../../components/UploadImages/UploadMultiSiteOrProduct";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {CURRENT_PRODUCT, LOGIN, LOGIN_ERROR} from "../../store/types";
import {UploadMultiplePopUp} from "../../components/Products/UploadMultiplePopUp";
import {saveKey, saveUserToken} from "../../LocalStorage/user";
import {getMessages, getNotifications} from "../../store/actions/actions";
import {ProductsGoogleMap} from "../../components/Map/ProductsMapContainer";
import Close from "@material-ui/icons/Close";
import AutocompleteCustom from "../../components/AutocompleteCustom";
import SelectArrayWrapper from "../../components/FormsUI/ProductForm/Select";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";

class Campaign extends Component {

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
            loading:false

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

        this.props.loadSites();
        this.props.dispatchLoadProductsWithoutParent({offset:this.props.productPageOffset,size:this.props.productPageSize});

    // this.loadNewPageSetUp()

        // this.getSitesForProducts()

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
                   // console.log(res)

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
        console.log(errors)
        this.setState({ errors: errors });
        return formIsValid;
    }

    downloadMultipleQrCodes = (event) => {

        event.preventDefault();


        console.log("submit called")

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

                <div className="wrapper">

                    {this.state.selectedProducts.length > 0 ?
                        <div className="sticky-top-csv slide-rl" style={{top: '68px',position:"fixed",zIndex:"100"}}>
                        <div className="float-right mr-1 p-3" style={{width: '220px', maxWidth: '300px', height: 'auto',  boxShadow: '0 2px 30px 0 rgba(0,0,0,.15)', backgroundColor: '#fff'}}>
                            <div className="row no-gutters mb-2 pb-2 " style={{borderBottom: '1px solid #70707062'}}>
                                <div className="col-7  ">
                                    <a onClick={this.getSitesForProducts}  className="btn btn-sm btn-green"><MapIcon style={{fontSize:"20px"}} /> Locations</a>
                                </div>
                                <div className="col-5 text-right">
                                    <CSVLink data={this.handleSaveCSV()} headers={headers} filename={`product_list_${new Date().getDate()}.csv`} className="btn btn-sm btn-green"><><DownloadIcon  style={{fontSize:"20px"}} /> CSV</></CSVLink>
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
                                                overflow: "hidden"}}><RemoveIcon color="secondary" /> {product.product.name}</div>
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
                            <div className="col-md-8 d-flex justify-content-start">
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


                            <div className="col-md-4 d-flex justify-content-end">
                                <button className="btn btn-sm blue-btn" onClick={() => this.toggleDownloadQrCodes()} type="button">Download QR Codes</button>
                                <button className="d-none btn btn-sm blue-btn ml-1" onClick={() => this.toggleMultiSite()} type="button">Upload Multiple Products</button>
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
                                    {this.props.productWithoutParentList.filter((site)=>
                                            this.state.filterValue?( this.state.filterValue==="name"?
                                                site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                this.state.filterValue==="condition"? site.condition&&site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                                    this.state.filterValue==="brand"? site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue==="category"? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue==="type"? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                this.state.filterValue==="state"? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                    this.state.filterValue==="year of manufacture"? site.year_of_making&&site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                                        this.state.filterValue==="model"? site.sku.model&&site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                            this.state.filterValue==="serial no."?site.sku.serial&& site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                            null):
                                                (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                    site.condition&&site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                    site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                    site.category.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                    site.type.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                    site.state.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                    site.year_of_making&&site.year_of_making.toString().includes(this.state.searchValue.toLowerCase())||
                                                    site.sku.model&& site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                                    site.sku.serial&&site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                                        ).length

                                    }
                                    <span className="ml-1">Listable Products</span>
                                </p>
                            </div>
                            <div className="text-mute col-auto pl-0">
                                <span style={{ fontSize: "18px" }}>Created</span>
                            </div>
                        </div>
                        <div className={"listing-row-border mb-3"}></div>

                        {
                        this.props.productWithoutParentList.filter((site)=>
                            this.state.filterValue?( this.state.filterValue==="name"?
                                site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                this.state.filterValue==="condition"? site.condition&&site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                    this.state.filterValue==="brand"? site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                        this.state.filterValue==="category"? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue==="type"? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue==="state"? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue==="year of manufacture"? site.year_of_making&&site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue==="model"?site.sku.model&& site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue==="serial no."?site.sku.serial&& site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                null):
                                (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                    site.condition&&site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                    site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                    site.category.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                    site.type.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                    site.state.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                    site.year_of_making&&  site.year_of_making.toString().includes(this.state.searchValue.toLowerCase())||
                                    site.sku.model&&site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase())||
                                    site.sku.serial&& site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()))

                        )
                            .map((item, index) => (
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


                        {this.props.productWithoutParentList.filter((site)=>
                                this.state.filterValue?( this.state.filterValue==="name"?
                                    site.name.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                    this.state.filterValue==="condition"? site.condition&&site.condition.toLowerCase().includes(this.state.searchValue.toLowerCase()):
                                        this.state.filterValue==="brand"? site.sku.brand.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                            this.state.filterValue==="category"? site.category.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                this.state.filterValue==="type"? site.type.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                    this.state.filterValue==="state"? site.state.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                        this.state.filterValue==="year of manufacture"? site.year_of_making&&site.year_of_making.toString().includes(this.state.searchValue.toLowerCase()) :
                                                            this.state.filterValue==="model"? site.sku.model&&site.sku.model.toLowerCase().includes(this.state.searchValue.toLowerCase()) :
                                                                this.state.filterValue==="serial no."?site.sku.serial&& site.sku.serial.toLowerCase().includes(this.state.searchValue.toLowerCase()) :


                                                                    null):
                                    (site.name.toLowerCase().includes(this.state.searchValue.toLowerCase())||
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
                                    <div>No products found!</div>
                                </div>
                            </div>

                        }

                        {/*{this.props.productWithoutParentList.length!=0&&!this.props.lastPageReached &&*/}
                        {/*<div className="row  justify-content-center filter-row    pt-3 pb-3">*/}
                        {/*    <div  ref={loadingRef => (this.loadingRef = loadingRef)} className="col">*/}
                        {/*        <div>Loading products please wait ...</div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*}*/}
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
                                                <b>Add New Product</b>
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </Toolbar>
                        </AppBar>
                    </React.Fragment>
                </div>

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
        dispatchLoadProductsWithoutParentPage: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentPagination(data)),
        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
        dispatchLoadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Campaign);
