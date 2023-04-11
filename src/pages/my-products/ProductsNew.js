import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {withStyles} from "@mui/styles/index";
import PageHeader from "../../components/PageHeader";
import {
    baseUrl,
    ISSUES_FILTER_VALUES_KEY,
    PRODUCTS_FIELD_SELECTION,
    PRODUCTS_FILTER_VALUES_KEY
} from "../../Util/Constants";
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
import {getSite, removeEmptyValuesObj, seekAxiosGet} from "../../Util/GlobalFunctions";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import BlueSmallBtn from "../../components/FormsUI/Buttons/BlueSmallBtn";
import ProductLines from "../../components/Account/ProductLines";
import CheckboxWrapper from "../../components/FormsUI/ProductForm/Checkbox";
import CircularProgressWithLabel from "../../components/FormsUI/Buttons/CircularProgressWithLabel";
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import PaginationGrid from "../../components/UIComponents/PaginationGrid";
import ProductForm from "../../components/ProductPopUp/ProductForm";
import SubproductItem from "../../components/Products/Item/SubproductItem";
import {GoogleMap} from "../../components/Map/MapsContainer";
import MenuDropdown from "../../components/FormsUI/MenuDropdown";
import ErrorBoundary from "../../components/ErrorBoundary";
import MapIcon from "@mui/icons-material/Place";

class ProductsNew extends Component {
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
            pageSize: 15,
            loadingResults: false,
            count: 0,
            showProductPopUp: false,
            productId: null,
            showProductLine: false,
            activeQueryUrl:null,
            allDownloadItems:[],
            showFieldSelection:false,
            productDisplayView: "large",
            showProductEdit:false,
            showQuickView:false,
            selectedRows:[],
            selectionMode:null,
            selectedFilter:null,
            selectedSearch:null,
            queryData:{},
            initialFilter:{},
            urlOptions:{
                Products:"name=Product&no_parent=true&relation=belongs_to&include-to=Site:located_at",
                Service:"name=Product&relation=service_agent_for&no_parent=true&relation=belongs_to&include-to=Site:located_at",
                Records:"name=Product&relation=past_owner&relation=belongs_to&no_parent=true&include-to=Site:located_at",
                Track:"name=Product&relation=tracked_by&no_parent=true&relation=belongs_to&include-to=Site:located_at",
                Archive:"name=Product&relation=archived&no_parent=true&relation=belongs_to&include-to=Site:located_at",
                Issues:"name=Issue"
            },
            defaultSort:{key: "_ts_epoch_ms",sort: "desc"}
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

    actionCallback=(key,action)=>{
        if (action=="edit"){
            this.showProductEditPopUp(key)
        }
        else if (action=="view"){
            this.showQuickViewPopUp(key)
        }
        else if (action=="map"){
            this.showSiteViewPopUp(key)
        }
    }

    clearList =  () => {
        // this.setState({
        //         offset: 0,
        //         items: [],
        //         lastPageReached: false,
        //         loadingResults: false,
        //     });
    };

    handleChange(value, field) {
        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });
    }


    setQueryData=(queryData)=>{

        try{

        // console.log("new queryData,reset")
        // console.log(queryData)
        removeEmptyValuesObj(queryData)

        if (!queryData.reset){
            queryData={...this.state.queryData, ...queryData}
        }else{
            queryData.page=0
        }

        // console.log("merged queryData,reset")
        // console.log(queryData)

        this.setState({
            selectionMode:queryData.type
        })
        let linkUrl=queryData.type==="Issues"?`issue`:queryData.type===`Records`?`p`:`product`
        let linkParams=`type=${queryData.type}`
        if (!queryData.reset){
                if (queryData.filter){
                    linkParams=`${linkParams}&filter=${queryData.filter}`
                }
                if (queryData.keyword){
                    linkParams=`${linkParams}&keyword=${queryData.keyword}`
                }
        }


        let data={
            dataUrl:this.state.urlOptions[queryData.type?queryData.type:"Products"],
            linkUrl:linkUrl,
            linkField:queryData.type==="Issues"?"title":"name",
            objKey:queryData.type==="Issues"?"Issue":"Product",
            linkParams:linkParams,
            headers:queryData.type==="Issues"?ISSUES_FILTER_VALUES_KEY:PRODUCTS_FILTER_VALUES_KEY,
            keyword: queryData.keyword,
            filter: queryData.filter,
            reset: queryData.reset,
            sort:queryData.sort,
            page:queryData.page
        }

        if (!data.sort&&this.state.defaultSort){
                data.sort=this.state.defaultSort
        }

        this.setState({
            queryData:data
        })

            // console.log("final queryData,reset")
            // console.log(data)

        this.setFilters(data,data.type)

        }catch (e){
            console.log(e)
        }

    }

    setFilters = (data) => {

        try {

            let subFilter = [];
            let searchValue = data.keyword;
            let activeFilter = data.filter;

            this.setState({
                selectedFilter: activeFilter ? activeFilter : null,
                selectedSearch: searchValue ? searchValue : null,
            })

            if (searchValue) {
                if (activeFilter) {
                    subFilter.push({key: activeFilter, value: searchValue});
                } else {
                    PRODUCTS_FILTER_VALUES_KEY.forEach((item) =>
                        subFilter.push({key: item.field, value: searchValue})
                    );
                }
            }

            this.filters = subFilter;

            setTimeout(() => {
                this.loadProductsWithoutParentPageWise(data, subFilter)
            }, 100)

        }catch (e){
            console.log(e)
        }
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

        if (this.state.selectedRows.length>0){

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

                        let list = this.state.allDownloadItems.length > 0?this.state.allDownloadItems.concat(responseAll) : responseAll
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


    setSelection=(selection)=>{


        this.setQueryData({
            type:selection,reset:true,
        })

    }

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

    showProductEditPopUp=(key)=> {

        if (key)
            axios.get(baseUrl + "product/" + key+"/expand")
                .then(
                    (response) => {

                        this.setState({
                            showProductEdit: !this.state.showProductEdit,
                            editItemSelected: response.data.data,
                        });

                    },
                    (error) => {


                    }
                );

        else{
            this.setState({
                showProductEdit: !this.state.showProductEdit,
                editItemSelected: null,
            });
        }

    }



    showSiteViewPopUp=(key)=> {

        if (key){
            this.setState({
                showSiteView: !this.state.showSiteView,
                viewSiteSelected: getSite(this.state.items.find(item=>item.Product._key==key)),
            });
        } else{
            this.setState({
                showSiteView: !this.state.showSiteView,
                viewSiteSelected: null,
            });
        }

    }
    showQuickViewPopUp=(key)=> {

        if (key){
            this.setState({
                showQuickView: !this.state.showQuickView,
                viewItemSelectedKey: key,
            });
        } else{
            this.setState({
                showQuickView: !this.state.showQuickView,
                viewItemSelectedKey: null,
            });
        }

    }

    seekCount = async (data,filters) => {
        this.controllerSeek.abort()
        let url = `${baseUrl}seek?${data.dataUrl}&count=true`;

        filters.forEach((item) => {
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
                this.initializeData()

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
    loadProductsWithoutParentPageWise = async (data,filters) => {

        // console.log("data,selection,filters")
        // console.log(data)
        // console.log(filters)
        try {
        if (data && data.reset){
         // await   this.clearList();
            this.setState({
                    offset: 0,
                    items: [],
                    lastPageReached: false,
                    loadingResults: false,
                });
        }

        this.controller.abort()

        // if (data) this.setFilters(data,selection?selection:this.state.selectionMode);
        this.seekCount(data,filters);

        this.setState({
            loadingResults: true,
        });

        let newOffset = data.page*this.state.pageSize;
        let url = `${baseUrl}seek?${data.dataUrl}`;

        filters.forEach((item) => {
            url = url + `&or=${item.key}~%${item.value}%`;
        });

        this.setState({
            activeQueryUrl:url
        })

        url = `${url}&count=false&offset=${newOffset?newOffset:0}&size=${this.state.pageSize}`;

        if (data.sort){
            url = `${url}&sort_by=${data.sort.key}:${data.sort.sort.toUpperCase()}`;
        }

        let result = await seekAxiosGet(url,null,this.controller);

        if (result && result.data && result.data.data) {

            this.setState({
                // items: this.state.items.concat(result.data ? result.data.data : []),
                items: result.data ? result.data.data : [],
                loadingResults: false,
                lastPageReached: result.data
                    ? result.data.data.length === 0
                        ? true
                        : false
                    : true,
                offset: newOffset,
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

}catch (e){
    console.log(e)
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


      // this.setQueryData(this.state.selectionMode)


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

    setMultipleSelectFlag=(rows)=>{
        // console.log(rows)
        this.setState({
            selectedRows: rows,
        });
    }

    toggleProductView = (viewType) => {
        this.setState({
            productDisplayView: viewType
        });
    }

    getSitesForProducts = () => {

        try {


            let mapData=this.mapProductToSite(this.state.selectedRows)

            this.setState({
                mapData: mapData,
                showMap: !this.state.showMap,

            });


        }catch (e){
            console.log(e)
        }
    };



    mapProductToSite=(selectedData)=>{

        let products=selectedData
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

    initializeData=(params)=>{

        this.setState({
            paramsString:params
        })
        // console.log("params from layout",params)

        if (params){

            const type=new URLSearchParams(params).get("type");
            const filter=new URLSearchParams(params).get("filter");
            const keyword=new URLSearchParams(params).get("keyword");

            let iniValues={
                filter:filter,
                keyword:keyword,
                type:type
            }
            // console.log("inivalues",iniValues)

            if (type){
                this.setState({
                    initialFilter:iniValues
                })
            }


            this.setQueryData({
                type:type?type:"Products",
                reset:false,
                filter:filter,
                keyword:keyword
            })
        }else{

            this.setQueryData({
                type:"Products",reset:true
            })

        }


    }

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
            <Layout
                sendParams={this.initializeData}
                params={{type:this.state.selectionMode,filter:this.state.selectedFilter,keyword:this.state.selectedSearch}}
            >
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
                            pageTitle={this.state.selectionMode}
                            subTitle="All your added products can be found here"
                        />

                        <div className="row d-none">
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

                        <ErrorBoundary>
                        <PaginationGrid
                            count={this.state.count}
                            items={this.state.items}
                            pageSize={this.state.pageSize}
                            offset={this.state.offset}
                            visibleCount={this.state.items.length}
                            loading={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            currentPage={this.state.queryData.page?this.state.queryData.page:0}
                            loadMore={(data) =>{
                                    this.setQueryData({
                                        type: this.state.selectionMode,
                                        filter:data.searchFilter,
                                        keyword:data.searchValue,
                                        sort:data.sort,
                                        page:data.newPage,
                                        reset:data.reset
                                    })
                            }}
                            actions={this.state.selectionMode==="Issues"?[]:["map","edit","view"]}
                            checkboxSelection={this.state.selectionMode!=="Issues"}
                            setMultipleSelectFlag={this.setMultipleSelectFlag}
                            actionCallback={this.actionCallback}
                            data={this.state.queryData}
                            initialFilter={this.state.initialFilter}
                        >
                            <div className="row ">
                                {this.state.selectedRows.length===0? <>
                                <div className="col-md-2 btn-rows">
                                    <MenuDropdown
                                        initialValue={this.state.initialFilter.type?this.state.initialFilter.type:null}
                                        setSelection={this.setSelection}
                                        options={["Products","Service","Records","Track","Issues","Archive"]}

                                    />
                                </div>
                                <div className="col-md-10 d-flex flex-row">

                                    <div className="me-2">
                                    <CustomPopover text=" Cyclecode is a unique product’s ID. An open Cyclecode isn’t attached to a specific product yet, allowing you to print multiple stickers before assigning them to products.">
                                        <button
                                            className="btn btn-sm mt-mobile btn-gray-border"
                                            onClick={() => this.toggleDownloadQrCodes()}
                                            type="button">
                                            Download Open Cyclecodes
                                        </button>
                                    </CustomPopover>
                                    </div>
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
                                </div>
                                      </>:

                                    <div className="col-md-12 ">
                                        <BlueSmallBtn
                                            title={"Locations"}
                                            onClick={this.getSitesForProducts}
                                        >
                                            <MapIcon style={{fontSize:"20px"}} />
                                        </BlueSmallBtn>

                                    <BlueSmallBtn
                                        classAdd={'ms-2'}
                                    title={"CSV"}
                                    onClick={()=>this.fieldSelection()}>
                                    <DownloadIcon style={{ fontSize: "20px" }} />
                                    </BlueSmallBtn>

                                    </div>
                                }

                            </div>

                        </PaginationGrid>
                        </ErrorBoundary>

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
                    heading={"Download Products"}>
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
                                                disabled={this.state.downloadAllLoading}>
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

                <GlobalDialog
                    size="md"
                    removePadding
                    hideHeader
                    show={this.state.showQuickView}
                    hide={()=> {
                        this.showQuickViewPopUp();
                    }} >

                    <div className="form-col-left col-12">
                        {this.state.showQuickView &&
                            <SubproductItem hideMoreMenu hideDate smallImage={true} productId={this.state.viewItemSelectedKey} />
                        }
                    </div>

                </GlobalDialog>
                <GlobalDialog
                    size="md"
                    removePadding
                    hideHeader
                    show={this.state.showSiteView}
                    hide={()=> {
                        this.showSiteViewPopUp();
                    }} >

                    <div className="form-col-left col-12">
                        {this.state.showSiteView &&
                            <div className="col-12">
                                {this.state.viewSiteSelected  && this.state.viewSiteSelected.geo_codes && this.state.viewSiteSelected.geo_codes.length>0&&
                                    <GoogleMap searchLocation
                                               siteId={this.state.viewSiteSelected._key}
                                               width={"100%"} height={"300px"}
                                               location={{
                                                   name: `${this.state.viewSiteSelected.name}`,
                                                   location: this.state.viewSiteSelected.geo_codes[0].address_info.geometry.location,
                                                   isCenter: true
                                               }}/>}
                            </div>
                        }
                    </div>

                </GlobalDialog>
                <GlobalDialog
                    size="md"
                    heading={"Add Product"}
                    hideHeading
                    show={this.state.showProductEdit}
                    hide={()=> {
                        this.showProductEditPopUp();
                    }} >

                    <div className="form-col-left col-12">
                        {this.state.showProductEdit &&
                            <ProductForm hideUpload edit
                                         triggerCallback={(action) => this.callBackSubmit(action)}
                                         heading={"Edit Product"}
                                         item={this.state.editItemSelected}
                            />
                        }
                    </div>

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
export default connect(mapStateToProps, mapDispatchToProps)(ProductsNew);
