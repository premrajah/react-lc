import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import PageHeader from "../../components/PageHeader";
import {
    baseUrl,
    ISSUES_FILTER_VALUES_KEY,
    PRODUCTS_FIELD_SELECTION,
    PRODUCTS_FILTER_VALUES_KEY
} from "../../Util/Constants";
import DownloadIcon from "@mui/icons-material/GetApp";
import { Modal, ModalBody } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { ProductsGoogleMap } from "../../components/Map/ProductsMapContainer";
import Close from "@mui/icons-material/Close";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import { validateFormatCreate, validateInputs, Validators } from "../../Util/Validator";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import CustomPopover from "../../components/FormsUI/CustomPopover";
import { getSite, removeEmptyValuesObj } from "../../Util/GlobalFunctions";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import BlueSmallBtn from "../../components/FormsUI/Buttons/BlueSmallBtn";
import ProductLines from "../../components/Account/ProductLines";
import CheckboxWrapper from "../../components/FormsUI/ProductForm/Checkbox";
import CircularProgressWithLabel from "../../components/FormsUI/Buttons/CircularProgressWithLabel";
import PaginationGrid from "../../components/UIComponents/PaginationGrid";
import ProductForm from "../../components/ProductPopUp/ProductForm";
import SubproductItem from "../../components/Products/Item/SubproductItem";
import { GoogleMap } from "../../components/Map/MapsContainer";
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
            downloadAllLoading: false,
            items: [],
            lastPageReached: false,
            offset: 0,
            pageSize: 15,
            pageSizeDivide:3,
            loadingResults: true,
            count: 0,
            showProductPopUp: false,
            productId: null,
            showProductLine: false,
            activeQueryUrl: null,
            allDownloadItems: [],
            showFieldSelection: false,
            productDisplayView: "large",
            showProductEdit: false,
            showQuickView: false,
            selectedRows: [],
            selectionMode: null,
            selectedFilter: null,
            selectedSearch: null,
            queryData: {},
            initialFilter: {},
            loadingMore:true,
            menuOptions: {
                Products: { url: "name=Product&no_parent=true&relation=belongs_to&include-to=Site:located_at" },
                Service: { url: "name=Product&relation=service_agent_for&no_parent=true&relation=belongs_to&include-to=Site:located_at", actions: ["view"] },
                Records: { url: "name=Product&relation=past_owner&relation=belongs_to&no_parent=true&include-to=Site:located_at", actions: ["view"] },
                Track: { url: "name=Product&relation=tracked_by&no_parent=true&relation=belongs_to&include-to=Site:located_at", actions: ["view"] },
                Archive: { url: "name=Product&relation=archived&no_parent=true&relation=belongs_to&include-to=Site:located_at", actions: ["view"] },
                Issues: { url: "name=Issue", actions: [] }
            },
            defaultSort: { key: "_ts_epoch_ms", sort: "desc" },
            selectAll: false,
            resetSelection: false
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

    actionCallback = (key, action) => {
        if (action === "edit") {
            this.showProductEditPopUp(key)
        }
        else if (action === "view") {
            this.showQuickViewPopUp(key)
        }
        else if (action === "map") {
            this.showSiteViewPopUp(key)
        }
    }

    clearList = () => {
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


    setQueryData = (queryData, filterReset) => {

        this.resetSelection()

        try {

            removeEmptyValuesObj(queryData)

            if (!queryData.reset) {
                queryData = { ...this.state.queryData, ...queryData }
            } else {
                queryData.page = 0

            }

            if (filterReset) {

                queryData.filter = null
                queryData.keyword = null

            }


            this.setState({
                selectionMode: queryData.type
            })
            let linkUrl = queryData.type === "Issues" ? `issue` : queryData.type === `Records` ? `p` : `product`
            let linkParams = `type=${queryData.type}`
            // if (!queryData.reset){
            if (queryData.filter) {
                linkParams = `${linkParams}&filter=${queryData.filter}`
            }
            if (queryData.keyword) {
                linkParams = `${linkParams}&keyword=${queryData.keyword}`
            }
            // }


            let data = {
                dataUrl: this.state.menuOptions[queryData.type ? queryData.type : "Products"].url,
                linkUrl: linkUrl,
                linkField: queryData.type === "Issues" ? "title" : "name",
                objKey: queryData.type === "Issues" ? "Issue" : "Product",
                linkParams: linkParams,
                headers: queryData.type === "Issues" ? ISSUES_FILTER_VALUES_KEY : PRODUCTS_FILTER_VALUES_KEY,
                keyword: queryData.keyword,
                filter: queryData.filter,
                reset: queryData.reset,
                sort: queryData.sort,
                page: queryData.page?queryData.page:0
            }

            if (this.props.fromCollections){
                data.objKey=null
            }

            if (!data.sort && this.state.defaultSort) {
                data.sort = this.state.defaultSort
            }

            this.setState({
                queryData: data
            })


            this.setFilters(data, data.type)

        } catch (e) {
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
                    subFilter.push({ key: activeFilter, value: searchValue });
                } else {
                    PRODUCTS_FILTER_VALUES_KEY.forEach((item) =>
                        subFilter.push({ key: item.field, value: searchValue })
                    );
                }
            }

            this.filters = subFilter;

            setTimeout(() => {
                this.loadItemsPageWise(data, subFilter)
            }, 100)

        } catch (e) {
            console.log(e)
        }
    };

    addProductLine = () => {
        this.setState({
            showProductLine: !this.state.showProductLine,
        });
    };


    fieldSelection = () => {
        this.setState({
            showFieldSelection: !this.state.showFieldSelection,
        });
    };
    selectAll = () => {
        this.setState({
            selectAll: !this.state.selectAll,
        });

        this.resetSelection()


    };


    resetSelection = () => {

        if (this.state.selectAll) {
            this.setState({
                selectAll: false,
            });
        }
        setTimeout(() => {
            this.setState({
                resetSelection: !this.state.resetSelection,
            });
        }, 100)
        this.setState({
            resetSelection: !this.state.resetSelection,
        });

    }


    downloadAll = (page = 0, size = 100, selectedKeys, type = "csv") => {

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

                    if (type === "csv") {
                        this.formatData(selectedKeys)
                    } else {
                        this.getSitesForProducts()
                    }

                } else {

                    let list = this.state.allDownloadItems.length > 0 ? this.state.allDownloadItems.concat(responseAll) : responseAll
                    this.setState({
                        allDownloadItems: list
                    })
                    this.downloadAll(page + size, 100, selectedKeys, type)

                }
            },
            (error) => {

                this.setState({
                    downloadAllLoading: false,
                });
            }
        );
        // }

    };


    setSelection = (selection) => {
        this.setState({
            initialFilter: { type: selection }
        })

        this.setQueryData({
            type: selection,
            reset: true
        }, true)


    }

    formatData = (selectedKeys, selected = false) => {

        try {

            let productList = []
            if (selected) {
                productList = this.state.selectedRows
            } else {
                productList = this.state.allDownloadItems
            }
            let csvDataNew = [];
            productList.forEach(item => {

                const { Product } = item;
                let itemTmp = []
                for (const key of selectedKeys.keys()) {
                    let keys = key.toString().split(".")
                    if (keys && keys.length > 1) {

                        itemTmp.push(Product[keys[0]][keys[1]])
                    } else {

                        if (key === "site") {
                            itemTmp.push(getSite(item).name)
                        } else {
                            itemTmp.push(Product[key])
                        }

                    }

                }
                csvDataNew.push(itemTmp)


            })
            this.exportToCSV(csvDataNew, selectedKeys, selected)

        } catch (e) {
            // console.log(e)
        }

    }

    exportToCSV = (csvData, selectedKeys, selected) => {

        let data = "";
        let tableDataNew = [];


        const rows = csvData

        // rows.unshift(["Title","Description","Category","Condition","Purpose","Units",
        //     "Volume"])

        let itemTmp = []
        for (const key of selectedKeys.keys()) {
            itemTmp.push(PRODUCTS_FIELD_SELECTION.find((itemTmp) => itemTmp.key === key).value)
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

        if (selected) {
            this.setState({
                selectedProducts: []
            })
        }
        this.fieldSelection()


    }

    showProductEditPopUp = (key) => {

        if (key)
            axios.get(baseUrl + "product/" + key + "/expand")
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

        else {
            this.setState({
                showProductEdit: !this.state.showProductEdit,
                editItemSelected: null,
            });
        }

    }



    showSiteViewPopUp = (key) => {

        if (key) {
            this.setState({
                showSiteView: !this.state.showSiteView,
                viewSiteSelected: getSite(this.state.items.find(item => item.Product._key === key)),
            });
        } else {
            this.setState({
                showSiteView: !this.state.showSiteView,
                viewSiteSelected: null,
            });
        }

    }
    showQuickViewPopUp = (key) => {

        if (key) {
            this.setState({
                showQuickView: !this.state.showQuickView,
                viewItemSelectedKey: key,
            });
        } else {
            this.setState({
                showQuickView: !this.state.showQuickView,
                viewItemSelectedKey: null,
            });
        }

    }

    cancelTokenSeek
    seekCount = async (url) => {


        if (!this.props.fromCollections){
            url = `${url}&count=true`;
        }else{
            url = `${url}/count`;
        }




        if (typeof this.cancelTokenSeek != typeof undefined) {
            this.cancelTokenSeek.cancel()
        }

        this.cancelToken = axios.CancelToken.source()


        let result = await axios
            .get(encodeURI(url),
                { cancelToken: this.cancelToken.token }
            )
            .catch((error) => {

                console.error(error);

            });



        this.setState({
            count: result.data ? result.data.data : 0,
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.detectChange();

            if (Object.keys(this.props.refreshState).length !== 0 && this.props.refreshState.refresh) {

                if (this.props.refreshState.reset) {

                    this.setState({
                        items: [],
                        offset: 0,
                    });
                    this.initializeData()
                } else {

                    let queryData = this.state.queryData

                    if (queryData.type === undefined || !queryData.type) {
                        queryData.type = "Products"
                    }

                    this.setQueryData(queryData)
                }

                this.props.refreshPageWithSavedState({});

            } else {


            }
        }
    }

    cancelToken

    loadItemsPageWise = async (data, filters,tempOffset=0,iteration=1) => {

        try {
            if (data && data.reset) {
                // await   this.clearList();
                this.setState({
                    offset: 0,
                    lastPageReached: false,

                });

            }

            //Check if there are any previous pending requests
            if (typeof this.cancelToken != typeof undefined) {
                this.cancelToken.cancel()
            }

            let url = ``;
            if (this.props.fromCollections){
                url=`${baseUrl}collection/${this.props.collectionId}/product`
            }else{
                 url = `${baseUrl}seek?${data.dataUrl}`;
            }


            filters.forEach((item) => {
                url = url + `&or=${item.key}~%${item.value}%`;
            });

            this.setState({
                activeQueryUrl: url
            })


            if (data && data.reset) {
                this.seekCount(url);
                this.setState({
                    loadingResults: true,
                });
            }

            if (this.props.fromCollections)
            url = url + `?`;
            let newSize = this.state.pageSize/this.state.pageSizeDivide;

            this.setState({
                loadingMore: true,
            });
            if (iteration===1){
                tempOffset=data.page * this.state.pageSize

                    this.setState({
                        items: [],
                    })
            } else{
            }

            if (!this.props.fromCollections){
                url = `${url}&count=false`
            }

            url = `${url}&offset=${tempOffset?tempOffset:0}&size=${newSize}`;

            if (data.sort) {
                url = `${url}&sort_by=${data.sort.key}:${data.sort.sort.toUpperCase()}`;
            }

            this.cancelToken = axios.CancelToken.source()

            let result = await axios
                .get(encodeURI(url),
                    { cancelToken: this.cancelToken.token }
                )
                .catch((error) => {

                    console.error(error);
                    this.setState({
                        loadingMore: false,
                    });
                });


            // let result = await seekAxiosGet(url,null,this.controller);

            if (result && result.data && result.data.data) {

                this.setState({
                    loadingMore: false,
                });

                this.setState({
                    // items: this.state.items.concat(result.data ? result.data.data : []),
                    loadingResults: false,
                    lastPageReached: result.data
                        ? result.data.data.length === 0
                            ? true
                            : false
                        : true,
                    offset: tempOffset,
                });

                if (result.data.data.length !== 0){

                        tempOffset=newSize+tempOffset

                    this.setState({
                        items: this.state.items.concat(result.data ? result.data.data : []),
                    })

                    if (iteration<this.state.pageSizeDivide){

                        let dataTemp=data
                        dataTemp.reset=false
                        this.loadItemsPageWise(dataTemp,filters,tempOffset,iteration+1)
                    }



                }


            } else {
                this.setState({
                    loadingMore: false,
                });
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

        } catch (e) {
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

        if (allData) {

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
        } else {
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

    setMultipleSelectFlag = (rows) => {

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
            let mapData = []
            if (!this.state.selectAll) {
                mapData = this.mapProductToSite(this.state.selectedRows)
            } else {
                mapData = this.mapProductToSite(this.state.allDownloadItems)
            }


            this.setState({
                mapData: mapData,
                showMap: !this.state.showMap,

            });


        } catch (e) {
            console.log(e)
        }
    };



    mapProductToSite = (selectedData) => {

        let products = selectedData
        let data = []
        products.forEach(product => {

            let site = getSite(product)
            let productTmp = product.Product

            if (data.length > 0 && data.find(item => item.site._key === site._key)) {

                data.find(item => item.site._key === site._key).products.push(productTmp)
            }
            else {
                data.push({
                    site: site,
                    products: [productTmp]
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

        const selectedKeys = new FormData(event.target);

        if (this.state.selectAll) {
            this.downloadAll(0, 100, selectedKeys, "csv")
        } else {
            this.formatData(selectedKeys, true)
        }



    };

    initializeData = (params) => {

        this.setState({
            paramsString: params
        })

        if (params) {

            let type = new URLSearchParams(params).get("type");
            const filter = new URLSearchParams(params).get("filter");
            const keyword = new URLSearchParams(params).get("keyword");

            if (type === undefined || type === "undefined") {
                type = "Products"
            }

            let iniValues = {
                filter: filter,
                keyword: keyword,
                type: type
            }

            if (type) {
                this.setState({
                    initialFilter: iniValues
                })
            }

            this.setQueryData({
                type: type,
                reset: true,
                filter: filter,
                keyword: keyword
            })
        } else {

            this.setQueryData({
                type: "Products", reset: true
            })

        }


    }




    render() {

        return (

            <>
            <Layout
                skipLayout={this.props.skipLayout}
                sendParams={this.initializeData}
                params={{ type: this.state.selectionMode, filter: this.state.selectedFilter, keyword: this.state.selectedSearch }}
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

                                            onClick={() => this.fieldSelection()}

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
                        {!this.props.skipPageHeader?  <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle={this.state.selectionMode}
                            subTitle="All your added products can be found here"
                        />:<></>}

                        <ErrorBoundary>
                            <PaginationGrid
                                entityType={"Product"}
                                count={this.state.count}
                                resetSelection={this.state.resetSelection}
                                items={this.state.items}
                                pageSize={this.state.pageSize}
                                offset={this.state.offset}
                                visibleCount={this.state.items.length}
                                // loading={this.state.loadingResults}
                                lastPageReached={this.state.lastPageReached}
                                currentPage={this.state.queryData.page ? this.state.queryData.page : 0}
                                loadMore={(data) => {
                                    this.setQueryData({
                                        type: this.state.selectionMode,
                                        filter: data.searchFilter,
                                        keyword: data.searchValue,
                                        sort: data.sort,
                                        page: data.newPage,
                                        reset: data.reset
                                    })
                                }}
                                actions={this.state.selectionMode && this.state.menuOptions[this.state.selectionMode].actions ?
                                    this.state.menuOptions[this.state.selectionMode].actions : ["edit", "view"]}
                                checkboxSelection={(this.state.selectionMode !== "Issues") && !this.state.selectAll}
                                setMultipleSelectFlag={this.setMultipleSelectFlag}
                                actionCallback={this.actionCallback}
                                data={this.state.queryData}
                                initialFilter={this.state.initialFilter}
                                loadingMore={this.state.loadingMore}

                            >
                                <div className="row  d-flex align-items-center">
                                    {this.state.selectedRows.length === 0 && !this.state.selectAll ? <>
                                        {/*<div className="col-md-2 btn-rows">*/}
                                        {/*   */}
                                        {/*</div>*/}
                                        <div className="col-md-12 col-12 d-flex " style={{ flexFlow: "wrap" }}>

                                            {!this.props.skipDropdown? <MenuDropdown
                                                maxWidth={"200px"}
                                                initialValue={this.state.initialFilter.type ? this.state.initialFilter.type : null}
                                                setSelection={this.setSelection}
                                                options={["Products", "Service", "Records", "Track", "Issues", "Archive"]}
                                            />:<></>}
                                            {!this.props.skipDropdown &&this.state.selectionMode !== "Issues" &&
                                                <>
                                                    <div className="me-2">
                                                        <CustomPopover text=" Cyclecode is a unique product’s ID. An open Cyclecode isn’t attached to a specific product yet, allowing you to print multiple stickers before assigning them to products.">

                                                            <BlueSmallBtn
                                                                classAdd="mb-1"
                                                                title={"Download Open Cyclecodes"}
                                                                onClick={() => this.toggleDownloadQrCodes()}
                                                            >

                                                            </BlueSmallBtn>
                                                        </CustomPopover>
                                                    </div>
                                                    {/*<div className="me-2">*/}
                                                    {/*    <CustomPopover text={"Export all products to csv."}>*/}
                                                    {/*        <BlueSmallBtn*/}
                                                    {/*            classAdd="mb-1"*/}
                                                    {/*            title={"Export To CSV"}*/}
                                                    {/*            // disabled={this.state.downloadAllLoading}*/}
                                                    {/*            // progressLoading={this.state.downloadAllLoading}*/}
                                                    {/*            // progressValue={this.state.downloadAllLoading?((this.state.allDownloadItems.length/this.state.count)*100):0}*/}
                                                    {/*            // onClick={()=>this.downloadAll(0,100)}*/}
                                                    {/*            onClick={this.fieldSelection}*/}
                                                    {/*        >*/}

                                                    {/*        </BlueSmallBtn>*/}
                                                    {/*    </CustomPopover>*/}
                                                    {/*</div>*/}
                                                    <div className="me-2">
                                                        <CustomPopover text={"Add Product Lines"}>
                                                            <BlueSmallBtn
                                                                classAdd="mb-1"
                                                                onClick={this.addProductLine}>
                                                                Product Lines
                                                            </BlueSmallBtn>
                                                        </CustomPopover>
                                                    </div>
                                                </>}
                                        </div>
                                    </> :

                                        <div className="col-md-12 d-flex ">
                                            {this.state.selectAll ?
                                                <>{this.state.count} selected
                                                    <span onClick={() => this.selectAll()} className="ms-1 click-item text-bold text-underline">Clear Selection</span>
                                                </> : <></>}
                                            {!this.state.selectAll &&
                                                <BlueSmallBtn
                                                    classAdd={'ms-2  '}
                                                    title={`${!this.state.selectAll ? "Select All (" + this.state.count + ")" : "Unselect All (" + this.state.count + ")"}`}
                                                    onClick={() => this.selectAll()}
                                                >
                                                </BlueSmallBtn>}


                                            <BlueSmallBtn
                                                classAdd={'ms-2 align-items-center d-flex'}
                                                onClick={() => {
                                                    if (this.state.selectAll) {
                                                        this.downloadAll(0, 100, [], "location")
                                                    } else {
                                                        this.getSitesForProducts()
                                                    }
                                                }}
                                                title={this.state.downloadAllLoading ? "Loading.. " : " Locations"}
                                            >
                                                {!this.state.downloadAllLoading ? <MapIcon style={{ fontSize: "20px" }} /> : <><CircularProgressWithLabel textSize={10} size={24} value={this.state.downloadAllLoading ? ((this.state.allDownloadItems.length / this.state.count) * 100) : 0} /></>}
                                            </BlueSmallBtn>

                                            <BlueSmallBtn
                                                classAdd={'ms-2'}
                                                title={"Export To CSV"}
                                                onClick={() => this.fieldSelection()}>
                                                <DownloadIcon style={{ fontSize: "20px" }} />
                                            </BlueSmallBtn>

                                        </div>
                                    }

                                </div>

                            </PaginationGrid>
                        </ErrorBoundary>

                    </div>
                </>

            </Layout>


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
                                            {PRODUCTS_FIELD_SELECTION.map((item) =>
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
                                                {!this.state.downloadAllLoading ?
                                                    <BlueSmallBtn
                                                        type={"submit"}
                                                        title={this.state.downloadAllLoading ? "" : " Download"}
                                                        disabled={this.state.downloadAllLoading}>
                                                    </BlueSmallBtn> : <CircularProgressWithLabel value={this.state.downloadAllLoading ? ((this.state.allDownloadItems.length / this.state.count) * 100) : 0} />}
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
                            {this.state.mapData.length > 0 &&
                                <ProductsGoogleMap
                                    mapData={this.state.mapData}
                                    width="700px"
                                    height="400px"
                                />}
                        </div>
                    </ModalBody>
                </Modal>

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
                    hide={() => {
                        this.showQuickViewPopUp();
                    }} >

                    <div className="form-col-left col-12">
                        {this.state.showQuickView &&
                            <SubproductItem
                                customLink={`/${this.state.queryData["linkUrl"]}/${this.state.viewItemSelectedKey}?${this.state.queryData["linkParams"] ? this.state.queryData["linkParams"] : ""}`}
                                hideMoreMenu hideDate smallImage={true} productId={this.state.viewItemSelectedKey} />
                        }
                    </div>

                </GlobalDialog>
                <GlobalDialog
                    size="md"
                    removePadding
                    hideHeader
                    show={this.state.showSiteView}
                    hide={() => {
                        this.showSiteViewPopUp();
                    }} >

                    <div className="form-col-left col-12">
                        {this.state.showSiteView &&
                            <div className="col-12">
                                {this.state.viewSiteSelected && this.state.viewSiteSelected.geo_codes && this.state.viewSiteSelected.geo_codes.length > 0 &&
                                    <GoogleMap searchLocation
                                               siteId={this.state.viewSiteSelected._key}
                                               width={"100%"} height={"300px"}
                                               location={{
                                                   name: `${this.state.viewSiteSelected.name}`,
                                                   location: this.state.viewSiteSelected.geo_codes[0].address_info.geometry.location,
                                                   isCenter: true
                                               }} />}
                            </div>
                        }
                    </div>

                </GlobalDialog>


                <GlobalDialog
                    size="md"
                    heading={"Add Product"}
                    hideHeading
                    show={this.state.showProductEdit}
                    hide={() => {
                        this.showProductEditPopUp();
                    }} >

                    <div className="form-col-left col-12">
                        {this.state.showProductEdit &&
                            <ProductForm
                                hideUpload edit

                                triggerCallback={(action) => this.showProductEditPopUp()}

                                heading={"Edit Product"}
                                item={this.state.editItemSelected}
                            />
                        }
                    </div>

                </GlobalDialog>
            </>
        );
    }
}

// const OptionalLayout=({skipLayout,children,...otherProps})=>{
//
//
//     return (
//         !skipLayout?<Layout {...otherProps}>{children}</Layout>:children
//     )
//
//
// }


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
        refreshState: state.refreshState,

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
        refreshPageWithSavedState: (data) => dispatch(actionCreator.refreshPageWithSavedState(data)),


    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductsNew);
