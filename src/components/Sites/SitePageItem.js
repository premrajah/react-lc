import React, {useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import Close from "@mui/icons-material/Close";
import EditSite from "./EditSite";
import {GoogleMap} from "../Map/MapsContainer";
import MapIcon from '@mui/icons-material/Place';
import {Link} from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import IconButton from '@mui/material/IconButton';
import moment from "moment/moment";
import MoreMenu from "../MoreMenu";
import {Spinner} from "react-bootstrap";

const SitePageItem = (  props) => {
    const { key, name, address, email, contact, phone, others, itemKey, is_head_office } = props?props.item:null;
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(false);
    const [productCount, setProductCount] = useState(0);
    const handleOpenModal = () => {
        // setErrorMsg('')
        // setShowModal(true);


        setLoading(true)
        getProductsCount()
    }
    const getProductsCount=()=>{

        axios.get(`${baseUrl}site/${props.item._key}/product/no-parent`).then(
            (response) => {
                let responseAll = response.data.data;

                setProductCount(responseAll.length)

                setLoading(false);
                setShowMap(true);

            },
            (error) => {
                // this.setState({
                //     notFound: true,
                // });
                setLoading(false);
                setShowMap(true);
                // setShowMap(!showMap);
            }
        );
    }



    const handleMapModal = (show) => {

        // setShowMap(!showMap);

        if (show){
            setLoading(true)

            getProductsCount()
        }else{
            setShowMap(!showMap);
        }

    }
    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleSubmitCallback = (errorMessage) => {
        setErrorMsg(errorMessage);
        handleCloseModal();
    }


    const editSiteSelection=(event)=> {

        props.setSiteForm({show:true,
            item:props.item,type:"edit", heading:"Edit Site"});

    }

   const callBackResult=(action) =>{

        if (action === "remove") {
            removeSiteSelection();
        }
        // else if (action === "delete") {
        //     this.deleteItem();
        // } else if (action === "duplicate") {
        //     this.submitDuplicateProduct();
        // } else if (action === "release") {
        //     this.showReleaseProductPopUp();
        // } else if (action === "serviceAgent") {
        //     this.showServiceAgent();
        // }
    }


     const removeSiteSelection=(event)=> {



        axios.delete(`${baseUrl}site/${props.item._key}/parent`)
            .then(res => {

                    props.loadCurrentSite(props.parentId)
                    props.showSnackbar({show: true, severity: "success", message: "Site removed successfully. Thanks"})


            })
            .catch(error => {

            })


    }

    const deleteSiteSelection=(event)=> {

        axios.delete(`${baseUrl}site/${props.item._key}`)
            .then(res => {
                if (res.status === 200) {


                    //   this.props.loadSites()
                    // this.hidePopUp()
                    // this.props.showSnackbar({show: true, severity: "success", message: "Site Deleted successfully. Thanks"})

                }
            })
            .catch(error => {

            })


    }

    return (
        <>

               <div id={props.item._key+"-site-item"} key={props.item._key+"-site-item"} className="row no-gutters site-item-list justify-content-start  mb-4 bg-white rad-8  p-3 ">
                <div  className={`${props.smallItem?"col-md-2 p-0":"col-md-2 p-0"} col-xs-12 `}>
                    {/*<div className={"content-site   content-box-image"}>*/}
                    <Link to={props.isLoggedIn?"/ps/" + props.item._key:"#"}>
                        <>

                            {props.item.geo_codes && props.item.geo_codes[0] ?
                            <img className={`${props.smallItem?"small-image":""} img-fluid img-list rad-4`} src={`https://maps.googleapis.com/maps/api/staticmap?center=${props.item.geo_codes[0].address_info.geometry.location.lat},${props.item.geo_codes[0].address_info.geometry.location.lng}
                            &markers=color:0x212529%7Clabel:C%7C${props.item.geo_codes[0].address_info.geometry.location.lat},${props.item.geo_codes[0].address_info.geometry.location.lng}
                            &zoom=12&size=${props.smallItem?"110x110":"185x185"}&scale=2&key=AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM`} alt="" />
                            :<img className={"img-fluid img-list"} src={PlaceholderImg} alt="" />}

                        </>
                    </Link>
                    {/*</div>*/}

                </div>
                   <div  className={`${props.smallItem?"col-md-10":"col-md-10"} position-relative col-xs-12 pl-3-desktop `}>

                       <div className={"   content-site content-box-listing"}>

                           <p style={{ fontSize: "18px" }} className="text-capitlize mb-0">
                               <Link  to={props.isLoggedIn?"/ps/" + props.item._key:"#"}> <span className={"title-bold"}>{props.item.name}</span> {is_head_office&& <span className="mr-2 text-bold text-pink"><small>(Head Office)</small></span>}</Link>
                           </p>

                           {props.item.external_reference &&    <p  className="text-gray-light  mb-1 text-capitlize ">
                               Reference Id:  <span className={"text-blue"}>{props.item.external_reference}</span>
                           </p>}
                           {!props.smallItem &&  email &&    <p  className="text-gray-light  mb-1 ">
                               Email: <span className={"text-blue"}>{email}</span>
                           </p>}
                           {!props.smallItem&&phone &&    <p  className="text-gray-light  mb-1 text-capitlize ">
                               Phone: <span className={"text-blue"}>{phone}</span>
                           </p>}
                           {!props.smallItem&&contact &&    <p  className="text-gray-light mb-1 text-capitlize ">
                               Contact: <span className={"text-blue"}>{contact}</span>
                           </p>}

                           {address &&    <p  className="text-gray-light  mb-1 text-capitlize">
                               Address: <span className={"text-blue"}>{address}</span>
                           </p>}


                       </div>
                       <div style={{ textAlign: "right" }} className={"add-top-button"}>
                           {/*<p className={"text-gray-light small"}>*/}
                           {/*    {"data hrere"}*/}
                           {/*</p>*/}

                           <div className="d-flex align-items-center">
                               {!loading?   <IconButton className={"mr-1"}><MapIcon  fontSize="24px" onClick={() => handleMapModal(true)} /></IconButton>:
                                   <Spinner
                                       className="me-2"
                                       as="span"
                                       animation="border"
                                       size="sm"
                                       role="status"
                                       aria-hidden="true"
                                   />}



                               {props.showEdit &&
                               <IconButton> <EditIcon  fontSize="24px" onClick={() => editSiteSelection()} /></IconButton>}
                               {props.moreMenu&& <MoreMenu
                                   triggerCallback={(action) =>
                                       callBackResult(action)
                                   }
                                   remove={props.showRemove?true:false}
                                   // edit={props.showEdit ?true:false}

                               />}

                           </div>




                       </div>
                       <p className={"text-gray-light date-bottom"}>
                           {moment(props.item._ts_epoch_ms).format("DD MMM YYYY")}

                       </p>

                   </div>

            </div>


            {showModal && (
                <>
                    <div className={"body-overlay"}>
                        <div className={"modal-popup site-popup"}>
                            <div className=" text-right ">
                                <Close
                                    onClick={() => handleCloseModal()}
                                    className="blue-text click-item"
                                    style={{ fontSize: 32 }}
                                />
                            </div>

                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <EditSite editable site={props.item} submitCallback={(errMsg) => handleSubmitCallback(errMsg)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {showMap && (
                <>
                    <div className={"body-overlay"}>
                        <div className={"modal-popup site-popup"}>
                            <div className=" text-right ">
                                <Close
                                    onClick={() => handleMapModal()}
                                    className="blue-text click-item"
                                    style={{ fontSize: 32 }}
                                />
                            </div>

                            <div className={"row"}>
                                <div className={"col-12"}>
                                    {props.item.geo_codes&&props.item.geo_codes[0] &&
                                    <GoogleMap siteId={props.item._key} width={"100%"}  height={"300px"}
                                               locations={[{name:`${name} (${productCount} products)`,location:props.item.geo_codes[0].address_info.geometry.location,isCenter:true}]} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

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
        currentSite:state.currentSite
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadCurrentSite: (data) => dispatch(actionCreator.loadCurrentSite(data)),
        setSiteForm: (data) => dispatch(actionCreator.setSiteForm(data)),


    };
};
export default connect(mapStateToProps, mapDispachToProps)(SitePageItem);
