import React, {useState} from "react";
import EditIcon from '@material-ui/icons/Edit';
import Close from "@material-ui/icons/Close";
import EditSite from "./EditSite";
import DeleteIcon from '@material-ui/icons/Delete'
import {GoogleMap} from "../Map/MapsContainer";
import MapIcon from '@material-ui/icons/Place';
import {Link} from "react-router-dom";
import PlaceholderImg from "../../img/place-holder-lc.png";
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
const SitePageItem = (props) => {
    const { key, name, address, email, contact, phone, others, itemKey, is_head_office } = props?props.item:null;
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showMap, setShowMap] = useState(false);
    const handleOpenModal = () => {
        setErrorMsg('')
        setShowModal(true);
    }



    const handleMapModal = () => {

        setShowMap(!showMap);
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

    const deleteSiteSelection=(event)=> {

        axios.delete(`${baseUrl}site/${props.item._key}`)
            .then(res => {
                if (res.status === 200) {


                      this.props.loadSites()
                    this.hidePopUp()
                    this.props.showSnackbar({show: true, severity: "success", message: "Site Deleted successfully. Thanks"})

                }
            })
            .catch(error => {

            })


    }

    return (
        <>

               <div id={props.item._key+"-site-item"} key={props.item._key+"-site-item"} className="row no-gutters justify-content-center mt-4 mb-4  pb-4">
                <div key={props.item._key+"-product-item-bpx"} className={"col-2 "}>
                    <Link to={props.isLoggedIn?"/site/" + props.item._key:"#"}>
                        <>

                            {props.item.geo_codes && props.item.geo_codes[0] ?
                            <img style={{height:"123px",width:"185px"}} className={"img-fluid"} src={`https://maps.googleapis.com/maps/api/staticmap?center=${props.item.geo_codes[0].address_info.geometry.location.lat},${props.item.geo_codes[0].address_info.geometry.location.lng}
                            &markers=color:0x212529%7Clabel:C%7C${props.item.geo_codes[0].address_info.geometry.location.lat},${props.item.geo_codes[0].address_info.geometry.location.lng}
                            &zoom=12&size=185x123&scale=2&key=AIzaSyAFkR_za01EmlP4uvp4mhC4eDDte6rpTyM`} alt="" />
                            :<img className={"img-fluid"} src={PlaceholderImg} alt="" />}

                        </>
                    </Link>
                </div>
                <div className={"col-7 pl-2  content-box-listing"}>

                    <p style={{ fontSize: "18px" }} className="text-caps mb-1">
                        <Link  to={props.isLoggedIn?"/site/" + props.item._key:"#"}> {props.item.name} {is_head_office&& <span className="mr-2 text-bold text-mute"><small>(Head Office)</small></span>}</Link>
                    </p>

                    {email &&    <p style={{ fontSize: "16px" }} className="text-mute mb-1 text-caps">
                       email
                    </p>}
                    {phone &&    <p style={{ fontSize: "16px" }} className="text-mute mb-1 text-caps">
                        {phone}
                    </p>}
                    {contact &&    <p style={{ fontSize: "16px" }} className="text-mute mb-1 text-caps">
                        {contact}
                    </p>}

                    {address &&    <p style={{ fontSize: "16px" }} className="text-mute mb-1  text-caps">
                        {address}
                    </p>}

                    <div>{errorMsg}</div>


                </div>
                <div style={{ textAlign: "right" }} className={"col-3"}>
                    {/*<p className={"text-gray-light small"}>*/}
                    {/*    {"data hrere"}*/}
                    {/*</p>*/}

                     <div>
                         <MapIcon className={"mr-2 click-item"} fontSize="small" onClick={() => handleMapModal()} />
                         {props.showEdit &&  <EditIcon className={" click-item"}  fontSize="small" onClick={() => editSiteSelection()} />}

                         {/*<DeleteIcon className={" click-item"}  fontSize="small" onClick={() => deleteSiteSelection()} />*/}
                     </div>


                        {/*<MoreMenu*/}
                        {/*    // triggerCallback={(action) => this.callBackResult(action)}*/}
                        {/*    // delete={props.delete}*/}
                        {/*    // edit={props.edit}*/}
                        {/*    // remove={props.remove}*/}
                        {/*    // duplicate={props.duplicate}*/}
                        {/*/>*/}

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
                                    <GoogleMap width={"100%"}  height={"300px"}
                                               locations={[{name:name,location:props.item.geo_codes[0].address_info.geometry.location,isCenter:true}]} />
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
