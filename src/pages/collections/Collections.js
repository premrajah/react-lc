import React, { Component } from "react";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import PageHeader from "../../components/PageHeader";
import {
    baseUrl, COLLECTION_FILTER_VALUES_KEY,
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
import CollectionForm from "../../components/Collection/CollectionForm";

class Collections extends Component {
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
            showProductEditPopUp: false,
            showQuickView: false,
            selectedRows: [],
            selectionMode: null,
            selectedFilter: null,
            selectedSearch: null,
            queryData: {},
            initialFilter: {},
            loadingMore:true,
            menuOptions: {
                ProductKinds: { url: "name=ProductKind&no_parent=true&relation=belongs_to&include-to=Site:located_at" },
                Service: { url: "name=ProductKind&relation=service_agent_for&no_parent=true&relation=belongs_to&include-to=Site:located_at", actions: ["view"] },
                Records: { url: "name=ProductKind&relation=past_owner&relation=belongs_to&no_parent=true&include-to=Site:located_at", actions: ["view"] },
                Track: { url: "name=ProductKind&relation=tracked_by&no_parent=true&relation=belongs_to&include-to=Site:located_at", actions: ["view"] },
                Archive: { url: "name=ProductKind&relation=archived&no_parent=true&relation=belongs_to&include-to=Site:located_at", actions: ["view"] },
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

    showProductEdit() {
        this.setState({
            showProductEditPopUp: !this.state.showProductEditPopUp,
            productDuplicate: false,
        });
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
            let linkUrl = `collection`
            let linkParams = ''
            // if (!queryData.reset){
            if (queryData.filter) {
                linkParams = `${linkParams}&filter=${queryData.filter}`
            }
            if (queryData.keyword) {
                linkParams = `${linkParams}&keyword=${queryData.keyword}`
            }
            // }


            let data = {
                dataUrl: "Collection",
                linkUrl: linkUrl,
                linkField: "name",
                objKey:  "Collection",
                linkParams: linkParams,
                headers: COLLECTION_FILTER_VALUES_KEY,
                keyword: queryData.keyword,
                filter: queryData.filter,
                reset: queryData.reset,
                sort: queryData.sort,
                page: queryData.page?queryData.page:0
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
                    COLLECTION_FILTER_VALUES_KEY.forEach((item) =>
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

        url = `${url}&count=true`;



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
            let url = `${baseUrl}seek?name=${data.dataUrl}`;

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

            url = `${url}&count=false&offset=${tempOffset?tempOffset:0}&size=${newSize}`;

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
            const filter = new URLSearchParams(params).get("filter");
            const keyword = new URLSearchParams(params).get("keyword");

            let iniValues = {
                filter: filter,
                keyword: keyword,
            }
                this.setState({
                    initialFilter: iniValues
                })

            this.setQueryData({
                reset: true,
                filter: filter,
                keyword: keyword
            })
        } else {

            this.setQueryData({
                reset: true
            })

        }


    }

    render() {

        return (
            <Layout
                sendParams={this.initializeData}
                params={{ type: this.state.selectionMode, filter: this.state.selectedFilter, keyword: this.state.selectedSearch }}
            >
                <>


                    <div className="container  mb-150  pb-4 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle={this.state.selectionMode}
                            subTitle="All your added products can be found here"
                        />

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
                                // actions={this.state.selectionMode && this.state.menuOptions[this.state.selectionMode].actions ?
                                //     this.state.menuOptions[this.state.selectionMode].actions : ["edit", "view"]}
                                checkboxSelection={(this.state.selectionMode !== "Issues") && !this.state.selectAll}
                                setMultipleSelectFlag={this.setMultipleSelectFlag}
                                actionCallback={this.actionCallback}
                                data={this.state.queryData}
                                initialFilter={this.state.initialFilter}
                                loadingMore={this.state.loadingMore}

                            >
                                <div className="row  d-flex align-items-center">

                                    <div className="col-12">

                                            <BlueSmallBtn
                                                classAdd={'ms-2'}
                                                title={"Add Collection"}
                                                onClick={()=>this.showProductEdit()}
                                            >

                                            </BlueSmallBtn>

                                        </div>


                                </div>

                            </PaginationGrid>
                        </ErrorBoundary>

                    </div>
                </>


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
                    size="lg"
                    heading={"Add Collection"}

                    show={this.state.showProductEditPopUp}
                    hide={()=> {
                        this.showProductEdit();
                    }} >

                    <div className="form-col-left col-12">
                        {this.state.showProductEditPopUp &&
                            <CollectionForm
                                refreshData={ ()=> {

                                    this.initializeData();
                                    this.showProductEdit();
                                }}
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
export default connect(mapStateToProps, mapDispatchToProps)(Collections);
