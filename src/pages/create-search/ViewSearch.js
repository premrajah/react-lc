import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import SearchIcon from "../../img/icons/search-icon.png";
import {Link} from "react-router-dom";
import {makeStyles} from "@mui/styles";
import axios from "axios/index";
import {baseUrl} from "../../Util/Constants";
import NotFound from "../../views/NotFound";
import ProductExpandItem from "../../components/Products/ProductExpandItem";
import SearchEditForm from "../../components/Searches/SearchEditForm";
import {Modal} from "react-bootstrap";
import MoreMenu from "../../components/MoreMenu";
import Layout from "../../components/Layout/Layout";
import OrgComponent from "../../components/Org/OrgComponent";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {GoogleMap} from "../../components/Map/MapsContainer";
import ResourceItem from "./ResourceItem";
import InfoTabContent from "../../components/Searches/InfoTabContent";
import Badge from '@mui/material/Badge';
import RightSidebar from "../../components/RightBar/RightSidebar";
import TextFieldWrapper from "../../components/FormsUI/ProductForm/TextField";
import GreenButton from "../../components/FormsUI/Buttons/GreenButton";
import SearchMatches from "./search-matches";
import BlueBorderButton from "../../components/FormsUI/Buttons/BlueBorderButton";
import ListingDetail from "../../components/Listings/ListingDetail";
import GlobalDialog from "../../components/RightBar/GlobalDialog";
import {fetchErrorMessage, getActionName} from "../../Util/GlobalFunctions";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

const useStylesTabs = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

class ViewSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            active: 0, //0 logn. 1- sign up , 3 -search,
            categories: [],
            subCategories: [],
            catSelected: {},
            subCatSelected: {},
            stateSelected: null,
            states: [],
            sites: [],
            page: 1,
            fields: {},
            errors: {},
            fieldsProduct: {},
            errorsProduct: {},
            fieldsSite: {},
            errorsSite: {},
            units: [],
            progressBar: 33,
            products: [],
            productSelected: null,
            nextBlue: false,
            nextBlueAddDetail: false,
            nextBlueViewSearch: false,
            matches: [],
            suggesstions: [],
            unitSelected: null,
            volumeSelected: null,
            title: null,
            description: null,
            volume: null,
            createSearchData: null,
            resourcesMatched: [],
            showCreateSite: false,
            siteSelected: null,
            productSelection: false,
            purpose: ["defined", "prototype", "aggregate"],
            site: {},
            dateRequiredBy: null,
            dateRequiredFrom: null,
            matchesCount: 0,
            notFound: false,
            previewImage: null,
            showEdit: false,
            showMatches:false,
            matchesView:true,
            showListing:false,
            requestMatch:false,
            listingId:null,
            listingSelected:null,
            matchSelected:null,
            acceptOffer:false,
            showActionOffer:false,
            headingOffer:"",
            offerSelected:null,
            offerAction:null
        };

        this.getPreviewImage = this.getPreviewImage.bind(this);

        this.slug = props.match.params.slug;

        this.nextClick = this.nextClick.bind(this);
        // this.resetPasswordSuccessLogin=this.resetPasswordSuccessLogin.bind(this)

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);

        // this.handleDateChange = this.handleDateChange.bind(this)
        this.createSearch = this.createSearch.bind(this);
        this.getSearch = this.getSearch.bind(this);
        this.loadMatches = this.loadMatches.bind(this);
        this.getSite = this.getSite.bind(this);
        this.toggleSite = this.toggleSite.bind(this);
        this.makeActive = this.makeActive.bind(this);
        this.selectCreateSearch = this.selectCreateSearch.bind(this);
        this.callBackResult = this.callBackResult.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);


    }


    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }
    callBackResult(action) {
        if (action === "edit") {
            this.showEdit();
        } else if (action === "delete") {
            this.deleteItem();
        }
    }


    toggleMatches = async () => {


        this.setState({
            showMatches: !this.state.showMatches,
            // editMode: edit,
            // selectedKey: key,
            // selectedEditItem: item,
        })

    }


    toggleRequestMatch = async (listing) => {

        this.setState({

            requestMatch: !this.state.requestMatch,
            listingSelected:listing,
            showListing: false,
            showMatches: false,
            // editMode: edit,
            // selectedKey: key,
            // selectedEditItem: item,
        })

    }

    toggleMakeOffer = async (matchSelected,acceptOffer,headingOffer) => {


        this.setState({
            showMakeOffer: !this.state.showMakeOffer,
            matchSelected: matchSelected,
            acceptOffer:acceptOffer,
            headingOffer:headingOffer
        })

    }

    toggleActionOffer = async (offer,actionName) => {


        this.setState({
            showActionOffer: !this.state.showActionOffer,
            offerSelected:offer,
            offerAction:actionName
            // matchSelected: matchSelected,
            // acceptOffer:acceptOffer,
            // headingOffer:headingOffer,
            // showActionOffer:showActionOffer
        })

    }

    submitActionOffer=(event)=> {

        event.preventDefault();

        const form = event.currentTarget;

        const formData = new FormData(event.target);

        const price = formData.get("price");
        const offer = formData.get("offer");

        var data;

        if (this.state.offerAction !== "counter") {
            data = {
                offer_id: offer,
                new_stage: this.state.offerAction,
            };
        } else {

            if (!this.handleValidationOffer()) {
                return
            }

            data = {
                offer_id:offer,
                new_stage: "counter",
                new_price: {
                    value: price,
                    currency: "gbp",
                },
            };
        }

        axios
            .post(
                baseUrl + "offer/stage",
                data,
            )
            .then((res) => {

               this.toggleActionOffer()

                this.props.showSnackbar({show:true,severity:"success",message:"Offer updated successfully. Thanks"})


            })
            .catch((error) => {
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
                this.toggleActionOffer()
                this.props.showSnackbar({show:true,severity:"warning",message:fetchErrorMessage(error)})

            });
    }


    requestMatch= (event) => {
        event.preventDefault();
        event.stopPropagation();

        let parentId;

        if (!this.handleValidation()) {
            return
        }

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);


        let formData={
            listing_id: this.state.item.listing._key,
            search_id: this.state.createSearchData.search._key,

        }

        if (data.get("message")){

            formData.note=data.get("message")
        }

        axios
            .post(
                baseUrl + "match",
                formData,
            )
            .then((res) => {

                // this.setState({
                //     showPopUp: false,
                //     matchExist: true,
                // });
                //
                // this.checkMatch();

                this.toggleRequestMatch()

                this.loadMatches()

                // this.getResources()
            })
            .catch((error) => {
                //

                this.setState({
                    showPopUp: true,
                    // loopError: error.response.data.data.message
                });
            });
    }


    submitOffer= (event) => {
        event.preventDefault();
        event.stopPropagation();

        let parentId;

        if ((!this.state.acceptOffer)&&!this.handleValidationOffer()) {
            return
        }

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        axios
            .put(
                baseUrl + "offer",
                {
                    match_id: this.state.matchSelected,

                    offer: {
                        amount: {
                            value: data.get("price"),
                            currency: "gbp",
                        },
                    },
                },

            )
            .then((res) => {

                this.props.showSnackbar({show:true,severity:"success",message:this.state.acceptOffer?"Offer accepted successfully.":"Offer created successfully. Thanks"})

                this.toggleMakeOffer()



            })
            .catch((error) => {
                // this.setState({
                //
                //     showPopUp: true,
                //     loopError: error.response.data.content.message
                // })
                this.toggleMakeOffer()

                this.props.showSnackbar({show:true,severity:"warning",message:fetchErrorMessage(error)})

            });


    }




    toggleListingView = async (id) => {


        this.setState({
            showListing: !this.state.showListing,
            listingId:id
            // editMode: edit,
            // selectedKey: key,
            // selectedEditItem: item,
        })

    }


    deleteItem() {
        axios
            .delete(baseUrl + "search/" + this.state.createSearchData.search._key, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    // var responseAll = response.data.data;

                    this.props.history.push("/my-search");
                    // this.props.loadProducts()
                },
                (error) => {}
            );
    }

    showEdit() {
        this.setState({
            showEdit: !this.state.showEdit,
        });
        this.getSearch();

    }

    getPreviewImage(productSelectedKey) {
        axios
            .get(baseUrl + "product/" + productSelectedKey.replace("Product/", "") + "/artifact", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    if (responseAll.length > 0) {
                        this.setState({
                            previewImage: responseAll[0].blob_url,
                        });
                    }
                },
                (error) => {}
            );
    }

    selectCreateSearch() {
        this.props.history.push("/search-form");
    }





    makeActive(event) {
        var active = event.currentTarget.dataset.active;

        this.setState({
            active: parseInt(active),
        });
    }

    getSearch() {
        axios
            .get(baseUrl + "search/" + this.slug + "/expand", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {
                    var responseData = response.data.data;

                    this.setState({
                        createSearchData: responseData,
                    });

                    if (responseData.product) {
                        this.getPreviewImage(responseData.product._id);
                    }
                },
                (error) => {
                    this.setState({
                        notFound: true,
                    });
                }
            );
    }

    getSite() {
        if (this.state.createSearchData)
            axios
                .get(baseUrl + "site/" + this.state.createSearchData.site._key, {
                    headers: {
                        Authorization: "Bearer " + this.props.userDetail.token,
                    },
                })
                .then(
                    (response) => {
                        var responseAll = response.data.data;

                        this.setState({
                            site: responseAll,
                        });
                    },
                    (error) => {
                        var status = error.response.status;
                    }
                );
    }

    getListingForSearch(matches) {
        axios
            .get(baseUrl + "search/" + this.slug + "/listing", {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then(
                (response) => {

                    var responseAll = response.data.data;

                    if (responseAll.length>0){
                        this.setState({
                            matchesCount: responseAll.filter((item)=>
                                !matches.find((match)=>item.listing._key==match.listing.listing._key)).length,

                            suggesstions: responseAll.filter((item)=>
                                !matches.find((match)=>item.listing._key==match.listing.listing._key)),
                        });
                    }else{

                        this.setState({
                            matchesCount: 0,
                        });
                    }


                },
                (error) => {}
            );
    }

    toggleSite() {
        this.setState({
            showCreateSite: !this.state.showCreateSite,
        });
    }

    createSearch() {
        var data = {
            name: this.state.title,
            description: this.state.description,
            category: this.state.catSelected.name,
            type: this.state.subCatSelected.name,
            units: this.state.unitSelected,
            volume: this.state.volumeSelected,
            state: this.state.stateSelected,
            site_id: this.state.siteSelected,
            require_after: {
                unit: "MILLISECOND",
                value: new Date(this.state.dateRequiredFrom).getTime(),
            },
            expiry: {
                unit: "MILLISECOND",
                value: new Date(this.state.dateRequiredBy).getTime(),
            },
        };

        axios
            .post(baseUrl + "search/" + this.state.productSelected.id, data, {
                headers: {
                    Authorization: "Bearer " + this.props.userDetail.token,
                },
            })
            .then((res) => {
                this.setState({
                    createSearchData: res.data.content,
                });

                this.getSite();
            })
            .catch((error) => {});
    }

    loadMatches() {
        axios
            .get(baseUrl + "match/search/" + this.slug)
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        matches: responseAll,
                    });

                    this.getListingForSearch(responseAll);

                },
                (error) => {}
            );
    }

    nextClick() {
        if (this.state.active < 4) {
            this.setState({
                active: 4,
            });
        } else if (this.state.active === 4) {
            this.setState({
                active: 7,
            });
        } else if (this.state.active === 7) {
            this.setState({
                active: 8,
            });
        }
    }

    handleBack() {
        if (this.state.page === 2) {
            if (this.handleValidation()) {
                this.setState({
                    page: 1,
                    active: 0,
                    progressBar: 33,
                });
            }
        }
    }

    handleNext() {
        this.getSites();
        if (this.state.page === 1) {
            if (this.handleValidation()) {
                this.setState({
                    active: 4,
                    page: 2,
                    progressBar: 66,
                });
            }
        } else if (this.state.page === 2) {
            if (this.handleValidationAddDetail()) {
                this.setState({
                    active: 6,
                    page: 3,
                    progressBar: 100,
                });

                this.createSearch();
            }
        } else if (this.state.page === 3) {
            this.setState({
                active: 7,
                page: 4,
                progressBar: 100,
            });
        } else if (this.state.active === 7) {
            this.setState({
                active: 8,
            });
        }
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }




    handleValidation() {


        let fields = this.state.fields;


        let validations = [
            // validateFormatCreate("message", [{check: Validators.required, message: 'Required'}], fields),
        ]


        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});
        return formIsValid;
    }

    handleValidationOffer() {


        let fields = this.state.fields;


        let validations = [
            validateFormatCreate("price", [{check: Validators.required, message: 'Required'},{check: Validators.number, message: 'Invalid input!'}], fields),
        ]


        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});
        console.log(errors)
        return formIsValid;
    }


    handleChange(value, field) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({fields});

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getSearch();
        this.loadMatches();
        this.interval = setInterval(() => {
            this.loadMatches();
        }, 10000);


        this.setState({
            activeKey:"0"
        })
    }




    render() {


        return (
            <Layout>

                {this.state.notFound ? (
                    <NotFound />
                ) : (
                    <>
                        {this.state.createSearchData && (
                            <>
                                <div className="container ">
                                    <div className="row  pt-4 pb-4  justify-content-start">
                                        <div className="text-left    col-sm-12 col-xs-12 breadcrumb-row">
                                            <Link to={"/my-search"}>My Searches</Link><span className={"divider-breadcrumb pl-2 pr-2"}>&#10095;</span><span className={"text-capitalize text-breadcrumb-light"}> {this.state
                                            .createSearchData
                                            .search.name}</span>

                                        </div>
                                    </div>
                                    <div className="row  justify-content-center  ">
                                        <div className="col-md-4 col-sm-12 col-xs-12 ">
                                            <div className="row stick-left-box  justify-content-center p-2 gray-border rad-8 bg-white ">
                                                {this.state.previewImage ? (
                                                    <img
                                                        className={"img-fluid"}
                                                        src={this.state.previewImage}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div style={{background:"#eeeeee"}} className="col-12 text-center p-5  rad-8 ">
                                                        <img

                                                            className={"my-search-icon-middle "}
                                                            src={SearchIcon}
                                                            alt=""
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-8 col-sm-12 col-xs-12 ">
                                            <div className="row ">
                                                <div className="col-12 ">
                                                    <div className="row justify-content-start ">
                                                        <div className="col-12 ">
                                                            <div className="row">
                                                                <div className="col-11 text-left">
                                                                    <h4
                                                                        className={
                                                                            "text-capitalize product-title"
                                                                        }>
                                                                        {
                                                                            this.state
                                                                                .createSearchData
                                                                                .search.name
                                                                        }
                                                                    </h4>
                                                                </div>
                                                                <div className="col-1 text-right">
                                                                    <MoreMenu
                                                                        triggerCallback={(action) =>
                                                                            this.callBackResult(
                                                                                action
                                                                            )
                                                                        }
                                                                        delete={true}
                                                                        duplicate={false}
                                                                        edit={true}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12">
                                                            <OrgComponent
                                                                org={
                                                                    this.state.createSearchData.org

                                                                }

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="row justify-content-start pb-3 pt-3 ">
                                                        <div className="col-auto">
                                                            <p

                                                                className={"text-gray-light "}>
                                                                {
                                                                    this.state.createSearchData
                                                                        .search.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className={"listing-row-border "}></div>
                                                    {this.state.createSearchData &&
                                                    <div className="row justify-content-start pb-3  tabs-detail">
                                                        <div className="col-12 ">

                                                            <Box sx={{ width: '100%', typography: 'body1' }}>
                                                                <TabContext value={this.state.activeKey}>
                                                                    <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                                                        <TabList
                                                                            variant="scrollable"
                                                                            scrollButtons="auto"
                                                                            textColor={"#27245C"}
                                                                            TabIndicatorProps={{
                                                                                style: {
                                                                                    backgroundColor: "#27245C",
                                                                                    padding: '2px',
                                                                                }
                                                                            }}
                                                                            onChange={this.setActiveKey}

                                                                            aria-label="lab API tabs example">


                                                                            <Tab label="Info" value="0"/>

                                                                            {/*<Tab label="Linked Product" value="1" />*/}

                                                                            <Tab label="Site" value="2" />

                                                                            <Tab label={<Badge color={"primary"} badgeContent={this.state.matches.length}>Active Matches</Badge>} value="3" />
                                                                        </TabList>
                                                                    </Box>

                                                                    <TabPanel value="0">

                                                                        <InfoTabContent item={this.state.createSearchData.search}/>
                                                                    </TabPanel>

                                                                    {/*{this.state.createSearchData.product &&  <TabPanel value="1">*/}

                                                                    {/*    <>*/}

                                                                    {/*        <div className={"mt-4"}></div>*/}


                                                                    {/*            {this.state.createSearchData && (*/}
                                                                    {/*                <ProductExpandItem*/}
                                                                    {/*                    hideMoreMenu={true}*/}
                                                                    {/*                    hideAddAll={true}*/}
                                                                    {/*                    productId={this.state.createSearchData.product._id.replace(*/}
                                                                    {/*                        "Product/",*/}
                                                                    {/*                        ""*/}
                                                                    {/*                    )}*/}
                                                                    {/*                />*/}
                                                                    {/*            )}*/}
                                                                    {/*        </>*/}

                                                                    {/*</TabPanel>}*/}


                                                                    {this.state.createSearchData.site &&
                                                                    <TabPanel value="2">
                                                                        <>

                                                                            <p className={"mt-4 mb-4"}>Linked Site:<span className={"text-bold"}> <Link to={"/ps/"+this.state.createSearchData.site._key}>{this.state.createSearchData.site.name}</Link></span></p>
                                                                            {this.state.createSearchData.site.geo_codes && this.state.createSearchData.site.geo_codes[0] &&

                                                                            <div className={"bg-white rad-8 p-2"}>
                                                                                <GoogleMap siteId={this.state.createSearchData.site._key} width={"100%"}
                                                                                           height={"300px"} locations={[{
                                                                                    name: this.state.createSearchData.site.name,
                                                                                    location: this.state.createSearchData.site.geo_codes[0].address_info.geometry.location,
                                                                                    isCenter: true
                                                                                }]}/>
                                                                            </div>

                                                                            }

                                                                        </>

                                                                    </TabPanel>}


                                                                    <TabPanel value="3">
                                                                        <>
                                                                            <div className="row mt-3">
                                                                                <div className="col-12 ">

                                                                            {this.state.matches
                                                                                // .filter((item)=> item.match.stage!="created")
                                                                                .map((item,index) => (
                                                                                <>

                                                                                    <ResourceItem

                                                                                        makeOffer={this.toggleMakeOffer}
                                                                                        actionOffer={this.toggleActionOffer}
                                                                                        hideCategory
                                                                                        key={index}

                                                                                        showDetails={(data)=> this.toggleListingView(data)}
                                                                                        onClick
                                                                                        hideStage
                                                                                        smallImage
                                                                                        matchedItem={item}
                                                                                        stage={item.match.stage}

                                                                                        history={this.props.history}
                                                                                        disableLink
                                                                                        searchId={this.slug}
                                                                                        item={item.listing}
                                                                                        hideMoreMenu
                                                                                    />


                                                                                </>
                                                                            ))}
                                                                                </div>
                                                                            </div>
                                                                            </>
                                                                    </TabPanel>


                                                                </TabContext>
                                                            </Box>

                                                        </div>
                                                    </div>}



                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Modal
                                    size="lg"
                                    show={this.state.showEdit}
                                    onHide={this.showEdit}
                                    className={"custom-modal-popup popup-form mb-5"}>
                                    <div className="">
                                        <button
                                            onClick={this.showEdit}
                                            className="btn-close close"
                                            data-dismiss="modal"
                                            aria-label="Close">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>

                                    <SearchEditForm
                                        triggerCallback={this.showEdit}
                                        searchId={this.state.createSearchData.search._key}
                                        item={this.state.createSearchData}
                                    />
                                </Modal>
                            </>
                        )}

                        {this.state.createSearchData && (
                            <React.Fragment>


                                <div

                                    color="#ffffff"
                                    className={ "custom-bottom-fixed-appbar  custom-bottom-appbar"}>

                                        <div
                                            className="row  justify-content-center search-container "
                                            style={{ margin: "auto" }}>

                                            <div className="col-auto">

                                                <BlueBorderButton
                                                    // to={"/matches/" + this.slug}
                                                    // type="button"
                                                    onClick={this.toggleMatches}
                                                    className="shadow-sm mr-2 btn btn-link blue-btn-border mt-2 mb-2 btn-blue">
                                                    <Badge className={""} anchorOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }} badgeContent= {
                                                        this.state.matchesCount
                                                    //+ this.state.matches.length
                                                    } color="primary">
                                                         View All Matches
                                                    </Badge>
                                                </BlueBorderButton>


                                            </div>
                                        </div>

                                </div>
                            </React.Fragment>
                        )}

                        <RightSidebar heading={"Matches"}
                                      subTitle={"Your search matches"} toggleOpen={this.toggleMatches} open={this.state.showMatches} width={"70%"}>

                            <>
                            {this.state.matchesView &&
                            <SearchMatches
                                suggesstions={this.state.suggesstions}
                                hideConfirmed
                                slug={this.slug}
                                           requestMatch={this.toggleRequestMatch}
                                           showDetails={(data)=> this.toggleListingView(data)}/>
                            }

                            </>
                        </RightSidebar>

                        <RightSidebar heading={"Listing Details"}  toggleOpen={()=>this.toggleListingView(null)} open={this.state.showListing} width={"70%"}>

                            <>
                                {this.state.listingId &&
                                <>
                                        <ListingDetail

                                            hideRequestMatch
                                            hideMatchesTab
                                            requestMatch={this.toggleRequestMatch}
                                            hideSearches
                                            hideBreadcrumbs
                                            type={"search"}
                                            searchId={this.state.createSearchData.search._key}
                                            listingId={this.state.listingId}
                                        />
                              </>}

                            </>
                        </RightSidebar>


                        <GlobalDialog size={"xs"} hide={this.toggleRequestMatch} show={this.state.requestMatch} heading={"Request Match"} >
                            <>
                                <form className={"full-width-field"} onSubmit={this.requestMatch}>


                                    <div className="col-12 ">

                                        <div className="row no-gutters">
                                            <div className="col-12 ">

                                                <TextFieldWrapper
                                                    onChange={(value)=>this.handleChange(value,"message")}
                                                    error={this.state.errors["message"]}
                                                    name="message" title="Message(Optional)" />

                                            </div>
                                        </div>


                                    </div>
                                    <div className="col-12 ">

                                        <div className="row mt-4 no-gutters">
                                            <div  className={"col-6 pr-2"}
                                                  style={{
                                                      textAlign: "center",
                                                  }}>
                                                <GreenButton

                                                    title={"Submit"}
                                                    type={"submit"}>

                                                </GreenButton>
                                            </div>
                                            <div
                                                className={"col-6 pl-2"}
                                                style={{
                                                    textAlign: "center",
                                                }}>
                                                <BlueBorderButton
                                                    type="button"

                                                    title={"Cancel"}

                                                    onClick={()=>
                                                        this
                                                            .toggleRequestMatch()
                                                    }
                                                >

                                                </BlueBorderButton>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </>
                        </GlobalDialog>

                        <GlobalDialog
                                      size={"xs"}
                                      hide={this.toggleMakeOffer}
                                      show={this.state.showMakeOffer}
                                      heading={this.state.headingOffer}
                        >
                            <>
                                <form className={"full-width-field"} onSubmit={this.submitOffer}>


                                    {!this.state.acceptOffer && <div className="col-12 ">

                                        <div className="row no-gutters">
                                            <div className="col-12 ">

                                                <TextFieldWrapper
                                                    onChange={(value) => this.handleChange(value, "price")}
                                                    error={this.state.errors["price"]}
                                                    name="price" title="Price"/>

                                            </div>
                                        </div>


                                    </div>}
                                    <div className="col-12 ">

                                        <div className="row mt-4 no-gutters">
                                            <div  className={"col-6 pr-2"}
                                                  style={{
                                                      textAlign: "center",
                                                  }}>
                                                <GreenButton

                                                    title={"Submit"}
                                                    type={"submit"}>

                                                </GreenButton>
                                            </div>
                                            <div
                                                className={"col-6 pl-2"}
                                                style={{
                                                    textAlign: "center",
                                                }}>
                                                <BlueBorderButton
                                                    type="button"

                                                    title={"Cancel"}

                                                    onClick={()=>
                                                        this
                                                            .toggleMakeOffer()
                                                    }
                                                >

                                                </BlueBorderButton>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </>
                        </GlobalDialog>

                        <GlobalDialog
                            size={"xs"}
                            hide={this.toggleActionOffer}
                                      show={this.state.showActionOffer}
                                      heading={getActionName(this.state.offerAction)+" Offer"} >
                            <>
                                <form
                                    className={"full-width-field"}
                                      onSubmit={this.submitActionOffer}>

                                    <input type={"hidden"} name={"offer"} value={this.state.offerSelected}/>


                                    {this.state.offerAction==="counter" &&
                                    <div className="col-12 ">

                                        <div className="row no-gutters">
                                            <div className="col-12 ">

                                                <TextFieldWrapper
                                                    onChange={(value)=>this.handleChange(value,"price")}
                                                    error={this.state.errors["price"]}
                                                    name="price" title="Price" />

                                            </div>
                                        </div>
                                    </div>}

                                    <div className="col-12 ">

                                        <div className="row mt-4 no-gutters">
                                            <div  className={"col-6 pr-2"}
                                                  style={{
                                                      textAlign: "center",
                                                  }}>
                                                <GreenButton

                                                    title={"Submit"}
                                                    type={"submit"}>

                                                </GreenButton>
                                            </div>
                                            <div
                                                className={"col-6 pl-2"}
                                                style={{
                                                    textAlign: "center",
                                                }}>
                                                <BlueBorderButton
                                                    type="button"

                                                    title={"Cancel"}

                                                    onClick={()=>
                                                        this
                                                            .toggleActionOffer()
                                                    }
                                                >

                                                </BlueBorderButton>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </>
                        </GlobalDialog>

                    </>



                )}
            </Layout>
        );
    }
}





const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        // cartItems: state.cartItems,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        // showLoginCheckoutPopUp: state.showLoginCheckoutPopUp,
        userDetail: state.userDetail,
        // abondonCartItem : state.abondonCartItem,
        // showNewsletter: state.showNewsletter
        loginPopUpStatus: state.loginPopUpStatus,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ViewSearch);
