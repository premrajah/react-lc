import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CubeBlue from "../../img/icons/product-icon-big.png";
import {Link} from "react-router-dom";
import {withStyles} from "@mui/styles/index";
import PageHeader from "../../components/PageHeader";
import {baseUrl, CYCLE_FILTER_VALUES} from "../../Util/Constants";
import Layout from "../../components/Layout/Layout";
import {UploadMultiplePopUp} from "../../components/Products/UploadMultiplePopUp";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import {createSeekURL, seekAxiosGet} from "../../Util/GlobalFunctions";
import CycleItem from "../../components/Cycles/CycleItem";
import ErrorBoundary from "../../components/ErrorBoundary";

class MyCycles extends Component {

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
            url:baseUrl+"seek?name=Cycle&relation=&include-to=Product:product_of&include-to=Search:search_for&include-to=Listing:listing_of&include-to=Org:any&include-to=Offer:any&and=stage!=closed&and=stage!=settled",
            searchUrl:baseUrl+"seek?name=Cycle&relation=&include-to=Product:product_of&include-to=Search:search_for&include-to=Listing:listing_of&include-to=Org:any&include-to=Offer:any&and=stage!=closed&and=stage!=settled",

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
        setTimeout(() => {

        this.setState({
            offset:0,
            items:[],
            lastPageReached:false,
            loadingResults: false,
        })
        },250)
    }

    setFilters=(data)=>{


        let searchValue= data.searchValue
        let activeFilter= data.searchFilter



        if (searchValue){


            if (activeFilter){



                if (activeFilter==="listing_name")
                    this.setState({

                        searchUrl:this.state.url+(`&find-also-to=Listing:listing_of:description~%${searchValue}%&find-also-to=Listing:listing_of:name~%${searchValue}%`)
                    })


                if (activeFilter==="search_name")
                    this.setState({

                        searchUrl:this.state.url+(`&find-also-to=Search:search_for:description~%${searchValue}%&find-also-to=Search:search_for:name~%${searchValue}%`)
                    })

                if (activeFilter==="product_name")
                    this.setState({

                        searchUrl:this.state.url+(`&find-also-to=Product:product_of:description~%${searchValue}%&find-also-to=Product:product_of:name~%${searchValue}%`)
                    })
            }else{


                this.setState({

                    searchUrl:this.state.url+(`&or=name~%${searchValue}%&or=description~%${searchValue}%&find-also-to=Product:listing_of:description~%${searchValue}%&find-also-to=Product:listing_of:name~%${searchValue}%`)
                })

            }
        }else{
            this.setState({

                searchUrl:this.state.url
            })
        }
    }

    handleChange(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }


    seekCount=async () => {

        let url = createSeekURL("product", true, true, null, null,
            this.filters, "AND")


        let result = await seekAxiosGet(this.state.url+"&count=true&offset="+this.state.offset+"&size="+this.state.pageSize)



        this.setState({
            count: result.data?result.data.data:0,

        })



    }


    loadProductsWithoutParentPageWise= async (data) => {


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



        let result = await seekAxiosGet(this.state.url+"&count=false&offset="+this.state.offset+"&size="+this.state.pageSize)


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

    componentDidMount() {


    }



    UNSAFE_componentWillMount() {
        window.scrollTo(0, 0);
    }





    render() {
        const classesBottom = withStyles();
        const headers = ["Name", "Description", "Category", "Condition", "Purpose", "Units", "Volume", "Site Name", "Site Address", "Service Agent", "QRCode Name", "QRCode Link"];


        return (
            <Layout>

                <>
                    <div className="container  mb-150  pb-4 pt-4">
                        <PageHeader
                            pageIcon={CubeBlue}
                            pageTitle="Cycles"
                            subTitle="Cycles are your transactions in progress. View your created cycles here"
                        />

                        <div className="row">
                            <div className="col-md-12 btn-rows">
                                <Link to="/cycles-record" className="btn btn-sm btn-gray-border">
                                    Cycles Record
                                </Link>
                            </div>
                        </div>

                        <PaginationLayout

                            dropDownValues={CYCLE_FILTER_VALUES}
                            count={this.state.count}
                            visibleCount={this.state.items.length}
                            loadingResults={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            loadMore={(data)=>this.loadProductsWithoutParentPageWise(data)} >

                            {this.state.items.map((item, index) =>

                                <>
                                <ErrorBoundary skip>
                                <div id={item.Cycle._key} key={item.Cycle._key}>
                                    <CycleItem
                                        item={{cycle:item.Cycle}}
                                        product={item.CycleToProduct[0]?item.CycleToProduct[0].entries[0]
                                            ?item.CycleToProduct[0].entries[0].Product:null:null}
                                        listing={item.CycleToListing[0]?item.CycleToListing[0].entries[0]
                                            ?item.CycleToListing[0].entries[0].Listing:null:null}

                                        search={item.CycleToSearch[0]?item.CycleToSearch[0].entries[0]
                                            ?item.CycleToSearch[0].entries[0].Search:null:null}

                                        offer={item.CycleToOffer[0]?item.CycleToOffer[0].entries[0]
                                            ?item.CycleToOffer[0].entries[0].Offer:null:null}

                                        sender={item.CycleToOrg.find((org)=>

                                            org.entries[0].CycleToOrg._relation==="sender_of").entries[0].Org
                                        }

                                        receiver={item.CycleToOrg.find((org)=>

                                            org.entries[0].CycleToOrg._relation==="receiver_of").entries[0].Org
                                        }

                                        // receiver={item.CycleToOrg.find((org)=> {
                                        //
                                        //     if (org.entries[0].CycleToOrg._relation=="sender_of"){
                                        //         return org.entries[0].Org
                                        //     }
                                        // })}

                                        showMoreMenu={true}
                                        triggerCallback={() => this.callBackResult()}
                                        key={index}
                                    />
                                </div>
                                </ErrorBoundary>
                                </>
                            )}

                        </PaginationLayout>

                    </div>


                </>


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
export default connect(mapStateToProps, mapDispatchToProps)(MyCycles);
