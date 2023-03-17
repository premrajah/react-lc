import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import encodeUrl from "encodeurl";
import {withStyles} from "@mui/styles/index";
import MatchItemSeller from "../../components/MatchItemSeller";
import NotFound from "../../views/NotFound";
import ProductExpandItem from "../../components/Products/ProductExpandItem";
import MoreMenu from "../../components/MoreMenu";
import OrgComponent from "../../components/Org/OrgComponent";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import InfoTabContent from "../../components/Listings/InfoTabContent";
import {GoogleMap} from "../../components/Map/MapsContainer";
import {fetchErrorMessage} from "../../Util/GlobalFunctions";
import Badge from "@mui/material/Badge";
import GlobalDialog from "../RightBar/GlobalDialog";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import ListEditForm from "./ListEditFormOld";
import ListForm from "./ListForm";
import ListEditFormNew from "./ListEditFormNew";
class ListingDetail extends Component {
    slug;
    search;
marteplace
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            item: null,
            showPopUp: false,
            matches: [],
            notFound: false,
            site: null,
            previewImage: null,
            showEdit: false,
            fields: {},
            errors: {},
        };



        this.getResources = this.getResources.bind(this);
        this.getSite = this.getSite.bind(this);
        this.acceptMatch = this.acceptMatch.bind(this);
        this.showPopUp = this.showPopUp.bind(this);

        this.getMatches = this.getMatches.bind(this);
        this.checkMatch = this.checkMatch.bind(this);

        this.getPreviewImage = this.getPreviewImage.bind(this);

        this.callBackResult = this.callBackResult.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }
    handleChange=(value, field) =>{

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({fields});

    }
    handleValidation=()=> {


        let fields = this.state.fields;


        let validations = [
            // validateFormatCreate("message", [{check: Validators.required, message: 'Required'}], fields),
        ]


        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});
        return formIsValid;
    }
    deleteItem() {

    try {

        axios
            .delete(baseUrl + "listing/" + this.state.item.listing._key, )
            .then(
                (response) => {
                    this.props.history.push("/my-listings");
                    // this.props.loadProducts()
                },
                (error) => {
                    console.log("error call delete listing", error)
                }
            );

    }catch (e){
        // console.log(e)
    }
    }

    callBackResult(action) {
        if (action === "edit") {
            this.showEdit();
        } else if (action === "delete") {
            this.deleteItem();
        }
    }


    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }

    showEdit() {
        this.setState({
            showEdit: !this.state.showEdit,
        });

        this.getResources();
    }

    getPreviewImage(productSelectedKey) {
        axios
            .get(baseUrl + "product/" + productSelectedKey + "/artifact", )
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


    showPopUp() {
        this.setState({
            showPopUp: !this.state.showPopUp,
        });
    }

    handleBack = () => {
        this.props.history.goBack();
    };

    handleForward = () => {
        this.props.history.go(+1);
    };

    getResources() {
        axios
            .get(baseUrl + "listing/" + encodeUrl(this.slug)+"/expand", )
            .then(
                (response) => {
                    var responseData = response.data;

                    this.setState({
                        item: responseData.data,
                    });

                    // this.getSite(responseData.data);

                    this.getPreviewImage(responseData.data.product._key);
                },
                (error) => {
                    this.setState({
                        notFound: true,
                    });
                }
            );
    }

    getSite(item) {
        axios
            .get(baseUrl + "site/" + item.site_id.replace("Site/", ""), )
            .then(
                (response) => {
                    var response = response.data;

                    this.setState({
                        site: response.data,
                    });
                },
                (error) => {
                    this.setState({
                        notFound: true,
                    });
                }
            );
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

    getMatches() {
        axios
            .get(baseUrl + "match/listing/" + encodeUrl(this.slug), )
            .then(
                (response) => {
                    var response = response.data;

                    this.setState({
                        matches: response.data,
                    });
                },
                (error) => {}
            );
    }

    checkMatch() {
        axios
            .get(
                baseUrl +
                    "match/search-and-listing/" +
                    "search-1609094173795-pzXfwMEzBp/" +
                    encodeUrl(this.slug),

            )
            .then(
                (response) => {
                    var response = response.data;

                    this.setState({
                        matches: response.data,
                    });
                },
                (error) => {}
            );
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props) {

            // this.setState({
            //     activeKey:"0"
            // })

            if (this.props.type==="detail"){

                this.slug = this.props.listingId;
                // this.marketplace = props.match.path.includes("marketplace")?"marketplace":"my-listings";
                this.marketplace=this.props.marketplace
                this.search = this.props.search;
            }


            if (this.props.type==="search"){
                this.slug = this.props.listingId;
                this.listing = this.props.listingId;
                this.search = this.props.searchId;
            }

            // this.checkMatch();
            this.getResources();

            this.getMatches();

            this.interval = setInterval(() => {
                this.getMatches();
            }, 5000);



        }
    }
    acceptMatch(event) {
        event.preventDefault();
        event.stopPropagation();

        axios
            .post(
                baseUrl + "match",
                {
                    listing_id: this.slug,
                    search_id: this.search,
                    // note for message
                },

            )
            .then((res) => {

                // this.getResources()
            })
            .catch((error) => {
                //

                this.setState({
                    showPopUp: true,
                    loopError: fetchErrorMessage(error),
                });
            });
    }


    submitRequestMatch= (event) => {

        event.preventDefault();
        event.stopPropagation();

        // let parentId;

        if (!this.handleValidation()) {

            return
        }

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);

        let formData={
            listing_id: this.state.item.listing._key,
            // search_id: this.state.createSearchData.search._key,

        }

        if (data.get("message")){

            formData.note=data.get("message")
        }

        axios
            .post(
                baseUrl + "match",
                formData
                ,
            )
            .then((res) => {

                // this.setState({
                //     showPopUp: false,
                //     matchExist: true,
                // });
                //
                // this.checkMatch();

                this.toggleRequestMatch()

                this.props.showSnackbar({show:true,severity:"success",message:"Match request has been generated successfully. Thanks"})

                // this.loadMatches()

                // this.getResources()
            })
            .catch((error) => {

                this.toggleRequestMatch()
                this.props.showSnackbar({show:true,severity:"warning",message:fetchErrorMessage(error)})


            });
    }


    componentDidMount() {


        window.scrollTo(0, 0);

        this.setState({
            activeKey:"0"
        })

        if (this.props.type==="detail"){

            this.slug = this.props.listingId;
            // this.marketplace = props.match.path.includes("marketplace")?"marketplace":"my-listings";
            this.marketplace=this.props.marketplace
            this.search = this.props.search;
        }


        if (this.props.type==="search"){
            this.slug = this.props.listingId;
            this.listing = this.props.listingId;
            this.search = this.props.searchId;
        }

        // this.checkMatch();
        this.getResources();

        this.getMatches();

        this.interval = setInterval(() => {
            this.getMatches();
        }, 5000);


    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>

                    {this.state.notFound ? (
                        <NotFound />
                    ) : (
                        <>
                            {this.state.item && (
                                <>
                                    <div className="container " >

                                        {!this.props.hideBreadcrumbs &&    <div className="row  pt-4   justify-content-start">
                                            <div className="text-left    col-sm-12 col-xs-12 breadcrumb-row">
                                                <Link to={"/"+this.marketplace}>{this.marketplace==="marketplace"?"All Listings":"My Listings"}</Link><span className={"divider-breadcrumb ps-2 pe-2"}>&#10095;</span><span className={"text-capitalize text-breadcrumb-light"}> {this.state.item.listing.name}</span>
                                            </div>
                                        </div>}
                                        <div className="row   justify-content-center mt-4 mb-4 pb-4">

                                            <div className="col-md-4 col-sm-12 col-xs-12 ">


                                                <div className="row   stick-left-box ">
                                                    <div className="col-12 text-center ">
                                                        <img
                                                            className={"img-fluid  rad-8 bg-white p-2"}
                                                            src={
                                                                this.state.previewImage
                                                                    ? this.state.previewImage
                                                                    : PlaceholderImg
                                                            }
                                                            alt=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={"col-md-8 col-sm-12 col-xs-12 "}>
                                                <div className="row justify-content-start  ">
                                                    <div className="col-12 ">
                                                        <div className="row">
                                                            <div className="col-12 position-relative">
                                                                <h4
                                                                    className={
                                                                        "text-capitalize product-title width-90"
                                                                    }>
                                                                    {this.state.item.listing.name}
                                                                </h4>
                                                                { this.props.isLoggedIn&&this.props.userDetail&&(this.state.item.org._id ===
                                                                    this.props.userDetail.orgId) &&    <div className="top-right text-right">
                                                                    <MoreMenu
                                                                        triggerCallback={(action) =>
                                                                            this.callBackResult(action)
                                                                        }
                                                                        delete={true}
                                                                        edit={true}
                                                                        remove={false}
                                                                        duplicate={false}
                                                                    />

                                                                </div>}
                                                            </div>


                                                        </div>
                                                    </div>

                                                    <div className="col-12 ">
                                                        <div className="row">
                                                            <div className="col-7">
                                                                <div>
                                                                    <OrgComponent
                                                                        org={
                                                                            this.state.item.org
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-5 blue-text text-blue text-bold  d-flex justify-content-end">
                                                                {this.state.item.listing.price&&(this.state.item.listing.price.value!==0) ? (
                                                                    <>
                                                                        GBP {
                                                                            this.state.item.listing
                                                                                .price.value
                                                                        }
                                                                    </>
                                                                ) : (
                                                                    "Free"
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={"col-12 "}>

                                                        <div className="row justify-content-start pb-3 pt-3 ">
                                                            <div className="col-auto">
                                                                <p
                                                                    style={{ fontSize: "16px" }}
                                                                    className={"text-gray-light  "}>
                                                                    {
                                                                        this.state.item.listing
                                                                            .description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={"listing-row-border "}></div>
                                                {this.state.item &&
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
                                                                        <Tab label="Linked Product" value="1" />
                                                                        <Tab label="Site" value="2" />
                                                                        {!this.props.hideMatchesTab &&
                                                                        <Tab label={<Badge color={"primary"} badgeContent={this.state.matches.length}>Matches Received</Badge>} value="3" />}
                                                                    </TabList>
                                                                </Box>

                                                                <TabPanel value="0">
                                                                    <InfoTabContent item={this.state.item.listing}/>
                                                                </TabPanel>
                                                                {this.state.item.product &&  <TabPanel value="1">

                                                                    <>

                                                                        <div className={"mt-4"}></div>


                                                                        {this.state.item && (
                                                                            <ProductExpandItem
                                                                                hideMoreMenu={true}
                                                                                hideAddAll={true}
                                                                                productId={this.state.item.product._key}
                                                                            />
                                                                        )}
                                                                    </>

                                                                </TabPanel>}
                                                                {this.state.item.site &&
                                                                <TabPanel value="2">
                                                                    <>

                                                                        <p className={"mt-4 mb-4"}>Linked Site:<span className={"text-bold"}> <Link to={"/ps/"+this.state.item.site._key}>{this.state.item.site.name}</Link></span></p>
                                                                        {this.state.item.site.geo_codes && this.state.item.site.geo_codes[0] &&

                                                                        <div className={"bg-white rad-8 p-2"}>
                                                                            <GoogleMap
                                                                                searchLocation
                                                                                siteId={this.state.item.site._key} width={"100%"}
                                                                                       height={"300px"} location={{
                                                                                name: this.state.item.site.name,
                                                                                location: this.state.item.site.geo_codes[0].address_info.geometry.location,
                                                                                isCenter: true
                                                                            }}/>
                                                                        </div>

                                                                        }

                                                                    </>

                                                                </TabPanel>}
                                                                <TabPanel value="3">

                                                                    {this.state.matches.length === 0 &&    <div className="row no-gutters mt-4 ">
                                                                        <div className="col-12  ">
                                                                            <p className="mb-1 text-gray-light">
                                                                               No Matches Received
                                                                            </p>
                                                                        </div>
                                                                    </div>}
                                                                    {!this.props.hideSearches&&this.state.matches &&
                                                                    this.state.matches.length > 0 && (
                                                                        <>


                                                                            {this.state.matches.map(
                                                                                (item, index) => (
                                                                                    <>
                                                                                        <MatchItemSeller
                                                                                            index={index}
                                                                                            item={item}
                                                                                        />
                                                                                    </>
                                                                                )
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </TabPanel>
                                                            </TabContext>
                                                        </Box>

                                                    </div>
                                                </div>}





                                            </div>
                                        </div>
                                    </div>


                                        <GlobalDialog

                                            size={"md"}
                                            hide={this.showEdit}
                                            show={this.state.showEdit}
                                            heading={"Edit Listing"}>
                                            <>
                                                <div className="col-12 ">


                                        <ListEditFormNew

                                            hide={this.showEdit}
                                            item={this.state.item}
                                        />




                                                </div>
                                            </>
                                        </GlobalDialog>

                                    <GlobalDialog size={"xs"}
                                                  hide={this.toggleRequestMatch}
                                                  show={this.state.requestMatch} heading={"Request Match"} >
                                        <div className="col-12">
                                            <p>

                                                We’ll let the seller know that your
                                                interested in this product. Do you
                                                want to send a message?
                                            </p>
                                            <div className="row">
                                            <form className={"full-width-field"} onSubmit={this.submitRequestMatch}>


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
                                                        <div  className={"col-6 pe-2"}
                                                              style={{
                                                                  textAlign: "center",
                                                              }}>
                                                            <GreenButton

                                                                title={"Submit"}
                                                                type={"submit"}>

                                                            </GreenButton>
                                                        </div>
                                                        <div
                                                            className={"col-6 ps-2"}
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
                                            </div>
                                        </div>
                                    </GlobalDialog>



                                </>
                            )}
                        </>
                    )}


                {!this.props.hideRequestMatch&&this.state.item&&(this.state.item.org._id !== this.props.userDetail.orgId) && (
                    <React.Fragment>


                        <div

                            color="#ffffff"
                            className={
                                "custom-bottom-fixed-appbar   custom-bottom-appbar"
                            }>

                            <div
                                className="row  justify-content-center search-container "

                            >
                                <div className="col-12 pt-1 pb-1 text-center">
                                    <GreenButton
                                        onClick={this.props.type==="search"?this.props.requestMatch:this.toggleRequestMatch}
                                        type="button"
                                        title={"Request A Match"}
                                    >
                                        Request A Match
                                    </GreenButton>
                                </div>
                            </div>

                        </div>
                    </React.Fragment>
                )}

            </>
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
export default connect(mapStateToProps, mapDispachToProps)(ListingDetail);
