import React, {Component} from "react";
import {connect} from "react-redux";
import {Image} from "react-bootstrap";
import {baseUrl, LISTING_FILTER_VALUES} from "../../Util/Constants";
import * as actionCreator from "../../store/actions/actions";
import ErrorBoundary from "../../components/ErrorBoundary";
import BuyProduct from "../../img/icons/buy-products-icon-blue.png";
import SellProduct from "../../img/icons/sell-products-icon-blue.png";
import BlueBorderLink from "../../components/FormsUI/Buttons/BlueBorderLink";
import MarketplaceResourceItem from "../../components/Resources/MarketplaceResourceItem";
import Layout from "../../components/Layout/Layout";
import {Link} from "react-router-dom";
import PaginationLayout from "../../components/IntersectionOserver/PaginationLayout";
import {seekAxiosGet} from "../../Util/GlobalFunctions";

const currentTime = new Date();

class FindResourcePage extends Component {
    state = {
        search: "",
    };

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
            url:baseUrl+"seek/entity/no-auth?name=Listing&relation=belongs_to&include-to=Product:listing_of&include-to=Org:any",
            searchUrl:baseUrl+"seek/entity/no-auth?name=Listing&relation=belongs_to&include-to=Product:listing_of&include-to=Org:any"


        }
    }


    filters=[]
    searchValue=''
    filterValue= ''
    offset=0
    pageSize=50

    clearList=()=>{

        this.setState({
            offset:0,
            items:[],
            lastPageReached:false,
            loadingResults: false,
        })
    }

    componentDidMount() {
        // this.props.dispatchListings();
        // this.updateNotifications();
    }


    setFilters=(data)=>{



        let searchValue= data.searchValue
        let activeFilter= data.searchFilter

        console.log(data)


        if (searchValue){


            if (activeFilter){

                console.log(activeFilter)

                if (activeFilter=="name")
                    this.setState({

                        searchUrl:this.state.url+(`&or=name~%${searchValue}%&or=description~%${searchValue}%`)
                    })

                if (activeFilter=="product_name")
                    this.setState({

                        searchUrl:this.state.url+(`&find-also-to=Product:listing_of:description~%${searchValue}%&find-also-to=Product:listing_of:name~%${searchValue}%`)
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


    seekCount=async () => {



        let result = await seekAxiosGet(this.state.searchUrl+
            "&count=true&offset="+this.state.offset+"&size="+this.state.pageSize)


        this.setState({
            count: result.data?result.data.data:0,

        })



    }


    loadProductsWithoutParentPageWise= async (data) => {


        if (data.reset){

            this.clearList()
        }
        await  this.setFilters(data)

        this.seekCount()

        this.setState({

            loadingResults: true
        })

        let newOffset = this.state.offset

        let result = await seekAxiosGet(this.state.searchUrl+
            "&count=false&offset="+this.state.offset+"&size="+this.state.pageSize+"&or=stage!=active")


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

    componentWillUnmount() {
        // clearInterval(this.interval);
    }

    updateNotifications() {
        // this.interval = setInterval(() => {
            this.props.dispatchListings();
        // }, 10000);
    }

    handleSearch = (searchValue) => {
        this.setState({ search: searchValue });
    };

    displayListings = () => {
        return this.props.allListings.length > 0
            ? this.props.allListings
                  .filter((item) => {
                      if (this.state.search.length === 0) {
                          return item;
                      } else if (
                          item.listing.name
                              .toLowerCase()
                              .includes(this.state.search.toLowerCase()) ||
                          item.org._key.toLowerCase().includes(this.state.search.toLowerCase())
                      ) {
                          return item;
                      }
                  })
                  .filter(
                      (item) =>
                          item.listing.available_from_epoch_ms < currentTime.getTime() &&
                          item.listing.expire_after_epoch_ms > currentTime.getTime()
                  )
                  .map((item, index) => (
                      <ErrorBoundary key={index}>
                          {/*<FindResourceListingItem key={item.listing._id} item={item} />*/}
                          <MarketplaceResourceItem
                              // triggerCallback={() => this.callBackResult()}
                              // history={this.props.history}
                              link={"/marketplace/" + item.listing._key }
                              item={item}
                              key={index}
                              hideMoreMenu
                          />
                      </ErrorBoundary>
                  ))
            : "Loading, no resources yet...";
    };

    render() {
        return (
            <Layout>
                <div className="container">
                    <div className="row mt-5 web-only " style={{ marginTop: "80px" }}>
                        <div className="col-12  marketplce-icon-container icon-container mt-4">
                            <div className="icon-bg icon-holder">
                                <Image className="" src={BuyProduct} rounded />

                                <h3 className="mt-4 blue-text icon-title">Buy Products</h3>
                                <span className="text-gray-light mt-2 mb-2">
                                    Search for a specific product and we’ll
                                    <br />
                                    notify you when you get a match.
                                </span>
                                <BlueBorderLink title="New search" to="/search-form" />
                            </div>
                            <div className="icon-bg icon-holder">
                                <Image className="" src={SellProduct} rounded />
                                <h3 className="mt-4 blue-text icon-title">Sell Products</h3>
                                <span className="text-gray-light mt-2 mb-2">
                                    List a new product for sale and we’ll <br />
                                    notify you when you get a match.
                                </span>
                                <BlueBorderLink title="New Listing" to="/list-form" />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-5 mb-2">
                        <div className="col-12">
                            <h4 className="blue-text text-heading">View All Listings</h4>
                        </div>
                    </div>
                    <div className="row mobile-only">
                        <div className="col-12 ">
                            <Link to="/search-form" className=" btn-sm btn-gray-border mr-2">
                                New Search
                            </Link>

                            <Link to="/list-form" className=" btn-sm btn-gray-border  mr-2">
                                New Listing
                            </Link>
                        </div>
                    </div>

                    {/*<div className="row  justify-content-center search-container  pt-3 pb-4">*/}
                    {/*    <div className={"col-12"}>*/}
                    {/*        <SearchBar*/}
                    {/*            dropDown*/}
                    {/*            dropDownValues={PRODUCTS_FILTER_VALUES}*/}
                    {/*            onSearch={(e) => this.handleSearch(e)}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="row mb-5">*/}
                    {/*    <div className="col-12">{this.displayListings()}</div>*/}
                    {/*</div>*/}


                    <PaginationLayout

                        dropDownValues={LISTING_FILTER_VALUES}
                        count={this.state.count}
                        visibleCount={this.state.items.length}
                        loadingResults={this.state.loadingResults}
                        lastPageReached={this.state.lastPageReached}
                        loadMore={(data)=>this.loadProductsWithoutParentPageWise(data)} >

                        {this.state.items.map((item, index) => (
                            <>
                                <ErrorBoundary skip>
                                    <div id={item.Listing._key} key={item.Listing._key}>

                                        <MarketplaceResourceItem
                                            // triggerCallback={() => this.callBackResult()}
                                            // history={this.props.history}
                                            link={"/marketplace/" + item.Listing._key }
                                            hideMoreMenu
                                            item={item.Listing}
                                            product={item.ListingToProduct[0]?item.ListingToProduct[0].entries[0]
                                                ?item.ListingToProduct[0].entries[0].Product:null:null}

                                            org={item.ListingToOrg[0]?item.ListingToOrg[0].entries[0]
                                                ?item.ListingToOrg[0].entries[0].Org:null:null}
                                            // org={item.Org}
                                            key={index}
                                        />
                                    </div>
                                </ErrorBoundary>
                            </>
                            ))}
                    </PaginationLayout>


                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        allListings: state.allListings,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        dispatchListings: (data) => dispatch(actionCreator.getListings()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindResourcePage);
