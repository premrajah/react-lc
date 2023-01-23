import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {withStyles} from "@mui/styles/index";
import ProductItem from "../../components/Products/Item/ProductItem";
import PageHeader from "../../components/PageHeader";
import {baseUrl, PRODUCTS_FIELD_SELECTION, PRODUCTS_FILTER_VALUES_KEY} from "../../Util/Constants";
import DownloadIcon from "@mui/icons-material/GetApp";
import {Modal, ModalBody} from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import {UploadMultiplePopUp} from "../../components/Products/UploadMultiplePopUp";
import {ProductsGoogleMap} from "../../components/Map/ProductsMapContainer";
import Close from "@mui/icons-material/Close";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import CustomPopover from "../../components/FormsUI/CustomPopover";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import {getSite, seekAxiosGet} from "../../Util/GlobalFunctions";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import BlueSmallBtn from "../../components/FormsUI/Buttons/BlueSmallBtn";
import ProductLines from "../../components/Account/ProductLines";
import CheckboxWrapper from "../../components/FormsUI/ProductForm/Checkbox";
import CircularProgressWithLabel from "../../components/FormsUI/Buttons/CircularProgressWithLabel";
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ProductsCondensedView from "./ProductsCondensedView";
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';

class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProducts: [],
            showMultiUpload: false,
            isIntersecting: false,
            intersectionRatio: 0,
            mapData: [],
            showMap: false,
            showDownloadQrCodes: false,
            fields: {},
            errors: {},
            loading: false,
            downloadAllLoading:false,
            items: [],
            lastPageReached: false,
            offset: 0,
            pageSize: 50,
            loadingResults: false,
            count: 0,
            showProductPopUp: false,
            productId: null,
            showProductLine: false,
            activeQueryUrl:null,
            allDownloadItems:[],
            showFieldSelection:false,
            productDisplayView: "large",
        };

        this.showProductSelection = this.showProductSelection.bind(this);
    }
    filters = [];
    searchValue = "";
    filterValue = "";
    offset = 0;
    pageSize = 50;

    toProducts() {
        this.context.router.history.push("/about");
    }

    showProductSelection() {
        this.props.showProductPopUp({ type: "create_product", show: true });
    }


    clearList = () => {

       setTimeout(() => {
            this.setState({
                offset: 0,
                items: [],
                lastPageReached: false,
                loadingResults: false,
            });
        },250)
    };

    handleChange(value, field) {
        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });
    }

    setFilters = (data) => {
        let subFilter = [];

        let searchValue = data.searchValue;
        let activeFilter = data.searchFilter;

        if (searchValue) {
            if (activeFilter) {
                subFilter.push({ key: activeFilter, value: searchValue });
            } else {
                PRODUCTS_FILTER_VALUES_KEY.forEach((item) =>
                    subFilter.push({ key: item.key, value: searchValue })
                );
            }
        }

        this.filters = subFilter;
    };

    addProductLine = () => {
        this.setState({
            showProductLine: !this.state.showProductLine,
        });
    };


    fieldSelection= () => {
        this.setState({
            showFieldSelection: !this.state.showFieldSelection,
        });
    };
    downloadAll = (page=0,size=100,data) => {



        if (this.state.selectedProducts.length>0){

            this.formatData(data,true)

        }
        else {
            if (page === 0)
                this.setState({
                    allDownloadItems: []
                })
            this.setState({
                downloadAllLoading: true,
            });


            let url = `${this.state.activeQueryUrl}&offset=${page}&size=${size}`;


            axios.get(encodeURI(url)).then(
                (response) => {
                    let responseAll = response.data.data;

                    if (responseAll.length === 0) {
                        this.setState({
                            downloadAllLoading: false,
                        });

                        this.formatData(data)

                    } else {


                        let list = this.state.allDownloadItems.length > 0 ?
                            this.state.allDownloadItems.concat(responseAll) : responseAll

                        this.setState({
                            allDownloadItems: list
                        })

                        this.downloadAll(page + size, 100, data)

                    }


                },
                (error) => {

                    this.setState({
                        downloadAllLoading: false,
                    });
                }
            );
        }

    };


    formatData=(selectedKeys,selected=false)=>{


        try {

            let productList=[]
            if (selected){

                productList=this.state.selectedProducts
            }else{
                productList=this.state.allDownloadItems
            }
        let csvDataNew = [];
        productList.forEach(item => {


                const {Product, event, service_agent} = item;
                let itemTmp=[]
                for (const key of selectedKeys.keys()) {
                    let keys=key.toString().split(".")
                    // console.log("keys",keys, key,Product[key],Product[key])
                    if (keys&&keys.length>1){

                        itemTmp.push(Product[keys[0]][keys[1]])
                    }else{

                        if (key==="site"){
                            itemTmp.push(getSite(item).name)
                        }else{
                            itemTmp.push(Product[key])
                        }

                    }

                }
                csvDataNew.push(itemTmp)


        })
        this.exportToCSV(csvDataNew,selectedKeys,selected)

        }catch (e){
            // console.log(e)
        }

    }

    exportToCSV=(csvData,selectedKeys,selected) =>{

        let data = "";
        let tableDataNew = [];


        const rows=csvData

        // rows.unshift(["Title","Description","Category","Condition","Purpose","Units",
        //     "Volume"])

        let itemTmp=[]
        for (const key of selectedKeys.keys()) {
            // console.log(key,selectedKeys.get(key));
            itemTmp.push(PRODUCTS_FIELD_SELECTION.
            find((itemTmp)=> itemTmp.key===key).value)
        }

        rows.unshift(itemTmp)

        for (const row of rows) {
            const rowData = [];
            for (const column of row) {
                rowData.push(column);
            }
            tableDataNew.push(rowData.join(","));
        }

        data += tableDataNew.join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
        a.setAttribute("download", `product_list_${new Date().getDate()}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (selected){
            this.setState({
                selectedProducts:[]
            })
        }
        this.fieldSelection()


    }

    seekCount = async () => {
        this.controllerSeek.abort()
        let url = `${baseUrl}seek?name=Product&no_parent=true&relation=belongs_to&count=true&include-to=Site:located_at`;

        this.filters.forEach((item) => {
            url = url + `&or=${item.key}~%${item.value}%`;
        });

        let result = await seekAxiosGet(url,null,this.controllerSeek);

        this.setState({
            count: result.data ? result.data.data : 0,
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.detectChange();

            if (this.props.refresh) {
                this.props.refreshPage(false);

                this.setState({
                    items: [],
                    offset: 0,
                });

                // if (this.timeout) clearTimeout(this.timeout);
                //
                // this.timeout = setTimeout(() => {
                //     this.loadMore(true);
                //     this.loadProductsWithoutParentPageWise({reset: true});
                // }, 500);
            }
        }
    }
     controller = new AbortController();
    controllerSeek = new AbortController();
    loadProductsWithoutParentPageWise = async (data) => {
        if (data && data.reset) {

            this.clearList();
        }



        this.controller.abort()

        if (data) this.setFilters(data);

        this.seekCount();

        this.setState({
            loadingResults: true,
        });

        let newOffset = this.state.offset;

        // let url = `${baseUrl}seek?name=Product&relation=belongs_to&no_parent=true&count=false&offset=${this.state.offset}&size=${this.state.pageSize}`;

        let url = `${baseUrl}seek?name=Product&no_parent=true&relation=belongs_to&count=false&include-to=Site:located_at`;

        this.filters.forEach((item) => {
            url = url + `&or=${item.key}~%${item.value}%`;
        });

        this.setState({
            activeQueryUrl:url
        })

         url = `${url}&offset=${this.state.offset}&size=${this.state.pageSize}`;


        let result = await seekAxiosGet(url,null,this.controller);

        if (result && result.data && result.data.data) {
            this.state.offset = newOffset + this.state.pageSize;

            this.setState({
                items: this.state.items.concat(result.data ? result.data.data : []),
                loadingResults: false,
                lastPageReached: result.data
                    ? result.data.data.length === 0
                        ? true
                        : false
                    : true,
                offset: newOffset + this.state.pageSize,
            });
        } else {
            if (result) {
                this.props.showSnackbar({
                    show: true,
                    severity: "warning",
                    message: "Error: " + result,
                });

                this.setState({
                    loadingResults: false,
                    lastPageReached: true,
                });
            }
        }
    };

    detectChange = () => {
        if (this.props.match.params.id) {
            let id = this.props.match.params.id;

            if (id && id === "new") {
                this.setState({
                    productId: null,
                });
                this.toggleProductPopUp();
            } else {
                this.setState({
                    productId: id,
                });

                if (!this.state.showProductPopUp) this.toggleProductPopUp();
            }
        } else {
            this.setState({
                redirect: false,
            });
        }
    };

    componentDidMount() {
        // this.detectChange()
    }

    handleAddToProductsExportList = (returnedItem) => {

        // console.log(returnedItem)

        let filteredProduct = this.state.selectedProducts.filter(
                    (product) => product.Product._key !== returnedItem.Product._key
                );
                this.setState({ selectedProducts: [...filteredProduct, returnedItem] });


        // axios.get(baseUrl + "product/" + returnedItem._key + "/expand").then(
        //     (response) => {
        //         let productSelected = response.data.data;
        //
        //         // check if already exists
        //         let filteredProduct = this.state.selectedProducts.filter(
        //             (product) => product.product._key !== productSelected.product._key
        //         );
        //         this.setState({ selectedProducts: [...filteredProduct, productSelected] });
        //     },
        //     (error) => {
        //         // this.setState({
        //         //     notFound: true,
        //         // });
        //     }
        // );
    };

    removeFromSelectedProducts = (i) => {
        this.setState((state) => {
            const selectedProducts = state.selectedProducts.filter((product, j) => i !== j);
            return {
                selectedProducts,
            };
        });
    };

    handleSaveCSV = (allData) => {
        const csvData = [];

        if (allData){

            // console.log("all csv data",this.state.allDownloadItems)
            this.state.allDownloadItems.forEach((item) => {
                const { Product } = item;
                return csvData.push([
                    Product.name,
                    Product.description,
                    Product.category,
                    Product.condition,
                    Product.purpose,
                    Product.units,
                    Product.volume,
                    // site.name,
                    // site.address,
                    // service_agent.name,
                    // qr_artifact.name,
                    // qr_artifact.blob_url,
                ]);
            });
        }else{
            this.state.selectedProducts.forEach((item) => {
                const { product, site, service_agent, qr_artifact } = item;
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
                    qr_artifact.blob_url,
                ]);
            });
        }


        return csvData;
    };

    toggleMultiSite = () => {
        this.setState({ showMultiUpload: !this.state.showMultiUpload });

        this.props.setMultiplePopUp(true);
    };

    handleMultiUploadCallback = () => {
        this.props.dispatchLoadProductsWithoutParent();
    };

    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }

    toggleMap = () => {
        this.setState({
            showMap: !this.state.showMap,
        });
    };

    toggleDownloadQrCodes = () => {
        this.setState({
            showDownloadQrCodes: !this.state.showDownloadQrCodes,
        });
    };

    toggleProductView = (viewType) => {
        this.setState({
            productDisplayView: viewType
        });
    }

    getSitesForProducts = () => {



        try {
            // let products = [];
            //
            // let mapData = [];
            //
            // this.state.selectedProducts.forEach((item) => {
            //
            //     mapData.push({_key: item.Product._key, name: item.Product.name,site:getSite(item)});
            //     return products.push(item.Product._key);
            // });





            // let sites = res.data.data;
            //
            // for (let i = 0; i < mapData.length; i++) {
            //     let site = sites.find(
            //         (site) => site.product_id.replace("Product/", "") === mapData[i]._key
            //     );
            //     mapData[i].site = site.site;
            // }

            let mapData=this.mapProductToSite()
            this.mapProductToSite()
            this.setState({
                mapData: mapData,
                showMap: !this.state.showMap,

            });
            // axios
            //     .post(baseUrl + "product/site/get-many", {product_ids: products})
            //     .then((res) => {
            //         if (res.status === 200) {
            //             let sites = res.data.data;
            //
            //             for (let i = 0; i < mapData.length; i++) {
            //                 let site = sites.find(
            //                     (site) => site.product_id.replace("Product/", "") === mapData[i]._key
            //                 );
            //                 mapData[i].site = site.site;
            //             }
            //
            //             this.setState({
            //                 showMap: !this.state.showMap,
            //                 mapData: mapData,
            //             });
            //         } else {
            //         }
            //     })
            //     .catch((error) => {
            //         if (error.response) console.log(error);
            //     });

        }catch (e){
            console.log(e)
        }
    };



    mapProductToSite=()=>{

        let products=this.state.selectedProducts
        let data=[]
        products.forEach(product=>{

            let site=getSite(product)
            let productTmp=product.Product

            if (data.length>0&&data.find(item=>item.site._key===site._key)){

                data.find(item=>item.site._key===site._key).products.push(productTmp)
            }
            else{
             data.push({
                 site:site,
                 products:[productTmp]
             })
            }
    })


        console.log(data)
        return data

    }
    handleValidationScaling() {
        let fields = this.state.fields;

        let validations = [
            validateFormatCreate(
                "count",
                [
                    { check: Validators.required, message: "Required" },
                    { check: Validators.number, message: "This field should be a number." },
                ],
                fields
            ),
        ];

        let { formIsValid, errors } = validateInputs(validations);
        this.setState({ errors: errors });
        return formIsValid;
    }

    downloadMultipleQrCodes = (event) => {
        event.preventDefault();

        if (this.state.type !== "delete" && !this.handleValidationScaling()) {
            return;
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

        this.toggleDownloadQrCodes();
    };

    toggleProductPopUp = () => {
        this.setState({
            showProductPopUp: !this.state.showProductPopUp,
        });
    };

    handleSubmit = (event) => {


        event.preventDefault();
        event.stopPropagation()

        const data = new FormData(event.target);

        this.downloadAll(0,100,data)


    };


    render() {
        const classesBottom = withStyles();
        const headers = [
            "Name",
            "Description",
            "Category",
            "Condition",
            "Purpose",
            "Units",
            "Volume",
            "Site Name",
            "Site Address",
            "Service Agent",
            "QRCode Name",
            "QRCode Link",
        ];

        return (
            <Layout>
                <>
                    {this.state.selectedProducts.length > 0 ? (
                        <div
                            className="sticky-top-csv slide-rl"
                            style={{ top: "68px", position: "fixed", zIndex: "100" }}>
                            <div
                                className="float-right me-1 p-3"
                                style={{
                                    width: "240px",
                                    maxWidth: "300px",
                                    height: "auto",
                                    boxShadow: "0 2px 30px 0 rgba(0,0,0,.15)",
                                    backgroundColor: "#fff",
                                }}>
                                <div
                                    className="row no-gutters mb-2 pb-2 "
                                    style={{ borderBottom: "1px solid #70707062" }}>
                                    <div className="col-12  ">
                                        <a
                                            href
                                            onClick={this.getSitesForProducts}
                                            className=" btn-sm btn-gray-border  me-2">
                                            {/*<MapIcon style={{fontSize:"20px"}} /> */}
                                            Locations
                                        </a>


                                        <BlueSmallBtn
                                        title={"CSV"}

                                        onClick={()=>this.fieldSelection()}

                                        >
                                            <DownloadIcon style={{ fontSize: "20px" }} />
                                        </BlueSmallBtn>

                                        {/*<CSVLink*/}
                                        {/*    data={this.handleSaveCSV()}*/}
                                        {/*    headers={headers}*/}
                                        {/*    filename={`product_list_${new Date().getDate()}.csv`}*/}
                                        {/*    className=" btn-sm btn-gray-border  me-2">*/}
                                        {/*    <>*/}
                                        {/*        <DownloadIcon style={{ fontSize: "20px" }} />*/}
                                        {/*        CSV*/}
                                        {/*    </>*/}
                                        {/*</CSVLink>*/}
                                    </div>
                                </div>
                                <div className="row  no-gutters mb-1">
                                    <div className="col blue-text">Selected Products</div>
                                    <button
                                        className=" btn-pink "
                                        onClick={() => this.setState({ selectedProducts: [] })}>
                                        <>Clear</>
                                    </button>
                                </div>

                                <div
                                    className="row"
                                    style={{ overflowY: "auto", maxHeight: "250px" }}>
                                    <div className="col">
                                        {this.state.selectedProducts.map((product, index) => (
                                            <div
                                                key={index}
                                                onClick={() =>
                                                    this.removeFromSelectedProducts(index)
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                }}>
                                                <IndeterminateCheckBoxIcon
                                                    style={{ opacity: "0.5" }}
                                                    className={"text-blue"}
                                                />
                                                {product.Product.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className="container  mb-150  pb-4 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="Products"
                            subTitle="All your added products can be found here"
                        />

                        <div className="row">
                            <div className="col-md-7 btn-rows">
                                <Link
                                    to="/products-service"
                                    className=" btn-sm btn-gray-border me-2">
                                    <CustomPopover
                                        text={
                                            " All of the products that you are responsible for as the Service Agent. The service agent is responsible for solving any issues that are reported by the owner of the product. "
                                        }>
                                        Service
                                    </CustomPopover>
                                </Link>

                                <Link
                                    to="/product-archive"
                                    className=" btn-sm btn-gray-border  me-2">
                                    <CustomPopover
                                        text={
                                            "All of your products that have been released to another and are now out of your possession. Records gives you the ability to interact with the user of the product and by seeing the provenance of where the products are currently. "
                                        }>
                                        Records
                                    </CustomPopover>
                                </Link>

                                <Link
                                    to="/product-tracked"
                                    className=" btn-sm btn-gray-border  me-2">
                                    <CustomPopover
                                        text={
                                            "Products that have entered the platform from another user that have your Brand attached to them. You have therefore wanted to know the provenance of these products and have now tracked these"
                                        }>
                                        Tracked
                                    </CustomPopover>
                                </Link>

                                <Link to="/issues" className=" btn-sm btn-gray-border me-2  ">
                                    Issues
                                </Link>
                                <CustomPopover text=" Cyclecode is a unique product’s ID. An open Cyclecode isn’t attached to a specific product yet, allowing you to print multiple stickers before assigning them to products.">
                                    <button
                                        className="btn btn-sm mt-mobile btn-gray-border"
                                        onClick={() => this.toggleDownloadQrCodes()}
                                        type="button">
                                        Download Open Cyclecodes
                                    </button>
                                </CustomPopover>
                                <button
                                    className="d-none btn btn-sm btn-gray-border ms-1"
                                    onClick={() => this.toggleMultiSite()}
                                    type="button">
                                    Upload Multiple Products
                                </button>
                            </div>
                            <div className="col-md-5 d-flex justify-content-end">
                                <div className="me-2">
                                <CustomPopover text={"Export all products to csv."}>
                                    <BlueSmallBtn
                                        title={"Export To CSV"}
                                        // disabled={this.state.downloadAllLoading}
                                        // progressLoading={this.state.downloadAllLoading}
                                        // progressValue={this.state.downloadAllLoading?((this.state.allDownloadItems.length/this.state.count)*100):0}
                                        // onClick={()=>this.downloadAll(0,100)}
                                    onClick={this.fieldSelection}
                                    >

                                    </BlueSmallBtn>
                                </CustomPopover>
                                </div>
                                <div className="me-2">
                                    <CustomPopover text={"Add Product Lines"}>
                                        <BlueSmallBtn onClick={this.addProductLine}>
                                            Product Lines
                                        </BlueSmallBtn>
                                    </CustomPopover>
                                </div>
                                {(this.state.items.length > 0 && this.state.productDisplayView === "large") ? <CustomPopover text="Product list view">
                                    <BlueSmallBtn onClick={() => this.toggleProductView("compact")}>
                                        <ViewHeadlineIcon/>
                                    </BlueSmallBtn>
                                </CustomPopover> : <CustomPopover text="Product list view">
                                    <BlueSmallBtn onClick={() => this.toggleProductView("large")}>
                                        <ViewAgendaIcon/>
                                    </BlueSmallBtn>
                                </CustomPopover>}
                            </div>
                        </div>

                        <PaginationLayout
                            dropDownValues={PRODUCTS_FILTER_VALUES_KEY}
                            count={this.state.count}
                            visibleCount={this.state.items.length}
                            loadingResults={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            loadMore={(data) => this.loadProductsWithoutParentPageWise(data)}
                        >

                            {/* Headings for condensed view */}
                            {this.state.productDisplayView !== "large" && <div className="row bg-white rad-4 p-1 mb-1">
                                <div className="col-md-4">Product Name</div>
                                <div className="col-md-3">Site Name</div>
                                <div className="col-md-2 d-flex justify-content-center">Serial No</div>
                                <div className="col-md-2" />
                                <div className="col-md-1 d-flex justify-content-end">Date added</div>
                            </div>}

                            {this.state.items.map((item, index) => (
                                <div id={`${item._key}-${index}`} key={item._key + "-" + index}>
                                    {this.state.productDisplayView === "large" ?
                                        <ProductItem
                                        showPreview
                                        index={index}
                                        goToLink={true}
                                        delete={false}
                                        edit={false}
                                        remove={false}
                                        duplicate={false}
                                        item={item.Product}
                                        site={getSite(item)}
                                        hideMore
                                        listOfProducts={(returnedItem) =>
                                            this.handleAddToProductsExportList(item)
                                        }
                                        showAddToListButton
                                    /> : <div id={`${item._key}-${index}`} key={item._key + "-" + index}>
                                        <ProductsCondensedView product={item.Product} index={index} site={getSite(item)}  />
                                    </div>}
                                </div>
                            ))}
                        </PaginationLayout>
                    </div>
                </>
                <GlobalDialog
                    allowScroll
                    size={"lg"}
                    hide={this.addProductLine}
                    show={this.state.showProductLine}
                    heading={"Product Lines"}>
                    <>
                        {this.state.showProductLine && (
                            <>
                                <div className="col-12 ">
                                    <ProductLines />
                                </div>
                            </>
                        )}
                    </>
                </GlobalDialog>

                <GlobalDialog
                    allowScroll
                    size={"md"}
                    hide={this.fieldSelection}
                    show={this.state.showFieldSelection}
                    heading={"Download Product"}>
                    <>
                        {this.state.showFieldSelection && (
                            <>
                                <div className="col-12 ">
                                    <form id={"product-field-form"} onSubmit={this.handleSubmit}>
                                    <div className="row  mt-2">
                                        {PRODUCTS_FIELD_SELECTION.map((item)=>

                                            <div className="col-md-3 col-sm-6  justify-content-start align-items-center">

                                                <CheckboxWrapper

                                                    id={`${item.key}`}
                                                    // details="When listed, product will appear in the marketplace searches"
                                                    initialValue={item.checked}
                                                    // onChange={(checked)=>this.checkListable(checked)}
                                                    color="primary"
                                                    name={`${item.key}`}
                                                    title={`${item.value}`} />

                                            </div>
                                        )}
                                    </div>
                                        <div className="row  mt-2">
                                            <div className="col-12 d-flex justify-content-center">

                                                {!this.state.downloadAllLoading?
                                                <BlueSmallBtn
                                                type={"submit"}
                                            title={this.state.downloadAllLoading?"":" Download"}
                                            disabled={this.state.downloadAllLoading}
                                            // progressLoading={this.state.downloadAllLoading}
                                            // progressValue={this.state.downloadAllLoading?((this.state.allDownloadItems.length/this.state.count)*100):0}
                                            // onClick={()=>this.downloadAll(0,100)}

                                        >

                                        </BlueSmallBtn>:<CircularProgressWithLabel value={this.state.downloadAllLoading?((this.state.allDownloadItems.length/this.state.count)*100):0} />}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}
                    </>
                </GlobalDialog>
                <Modal
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
                            {this.state.mapData.length>0 &&
                            <ProductsGoogleMap
                                mapData={this.state.mapData}
                                width="700px"
                                height="400px"
                            />}
                        </div>
                    </ModalBody>
                </Modal>
                }
                <Modal
                    aria-labelledby="contained-modal-title-vcenter"
                    show={this.state.showDownloadQrCodes}
                    centered
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
                            <div className={"col-12 text-left"}>
                                <h5
                                    style={{ textTransform: "Capitalize" }}
                                    className={"text-bold text-blue"}>
                                    Download Multiple Cyclecodes
                                </h5>
                            </div>
                        </div>

                        <div className={"row justify-content-center"}>
                            <form onSubmit={this.downloadMultipleQrCodes}>
                                <div className="row mb-2 text-center">
                                    <div className="col-12 ">
                                        <TextFieldWrapper
                                            numberInput
                                            // readonly ={this.state.disableVolume}
                                            initialValue={
                                                this.state.selectedItem &&
                                                this.state.selectedItem.factor + ""
                                            }
                                            // value={this.state.disableVolume?"0":""}
                                            onChange={(value) => this.handleChange(value, "count")}
                                            error={this.state.errors["count"]}
                                            placeholder={"Enter required number of Cyclecodes"}
                                            name="count"
                                        />
                                    </div>
                                </div>

                                <div className={"row"}>
                                    <div className="col-12 d-flex justify-content-center mt-2">
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
        productPageOffset: state.productPageOffset,
        pageSize: state.pageSize,
        refresh: state.refresh,
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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        refreshPage: (data) => dispatch(actionCreator.refreshPage(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Products);
