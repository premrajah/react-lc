import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import {useParams} from 'react-router-dom';
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import DescriptionIcon from '@mui/icons-material/Description';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import MoreMenu from "../MoreMenu";
const DocumentsDisplay = (props) => {
    const { artifacts, pageRefreshCallback } = props;

    const [show, setShow] = useState(false);
    const [docKey, setDocKey] = useState(null);
    let {slug} = useParams();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDocumentKey = (key) => {
        handleShow();
        setDocKey(key);
    }

    const handleDeleteDocument = (key) => {


        let afterRemoveDoc = artifacts.filter(item => item._key !== key);
        let artifactIds = [];

        afterRemoveDoc.forEach(item => artifactIds.push(item._key));

        const payload = {
            "site_id": slug,
            "artifact_ids": artifactIds
        }

        handleClose();

        handleReplaceArtifacts(payload);

    }

   const callBackResult=(action,key,blob_url) =>{

        if (action === "download") {


            window.location.href = blob_url

        } else if (action === "delete") {

            setDocKey(key);

            handleDeleteDocument(key)

        }
    }



    const handleReplaceArtifacts = (payload) => {
        axios.post(`${baseUrl}site/artifact/replace`, payload)
            .then(response => {
                if(response.status === 200) {
                    handleClose();

                    props.loadCurrentSite(payload.site_id)
                    props.showSnackbar({show:true,severity:"success",message:"Artifact removed successfully from product. Thanks"})


                }
            })
            .catch(error => {
                console.log('artifact replace error ', error);
            })
    }



    return (
        <>
            <div className="row">
                <div className="col">

                    {artifacts.length > 0 ? (
                        artifacts.map((artifact, index) => {
                            // if (
                            //     artifact.mime_type === "application/pdf" ||
                            //     artifact.mime_type === "application/rtf" ||
                            //     artifact.mime_type === "application/msword" ||
                            //     artifact.mime_type === "text/rtf" ||
                            //     artifact.mime_type ===
                            //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                            //     artifact.mime_type ===
                            //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                            //     artifact.mime_type === "application/vnd.ms-excel"
                            // ) {
                                return (

                                    <>
                                        {index===0 &&  <p className=" custom-label text-bold text-blue mt-4 mb-4">

                                            Files Uploaded

                                        </p>}
                                    <div key={index} className="mt-3 mb-3 text-left pt-3 pb-3 bg-white row">

                                        <div className={"col-10"}>

                                        <DescriptionIcon style={{background:"#EAEAEF", opacity:"0.5", fontSize:" 2.5rem"}} className={" p-1 rad-4"} />
                                        <span

                                            className="ms-4  text-blue text-bold"
                                            // href={artifact.blob_url}
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            {artifact.name}
                                        </span>

                                        </div>
                                        <div className={"col-2"}>


                                               <MoreMenu

                                            triggerCallback={(action) =>
                                                callBackResult(action,artifact._key,artifact.blob_url)
                                            }

                                            download={
                                               true
                                            }

                                            delete={
                                                props.isLoggedIn
                                            }
                                        />


                                        {!props.hideAdd &&    <span
                                            className="ms-2 text-danger d-none"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleDocumentKey(artifact._key)}>
                                            <IndeterminateCheckBoxIcon style={{opacity:"0.5"}} className={"text-blue"}  />
                                        </span>}
                                        </div>

                                    </div>

                                    </>
                                );
                            // }
                        })
                    ) : (
                        <div>No documents added.</div>
                    )}
                </div>
            </div>




            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove document</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-green mr-1" onClick={() => handleDeleteDocument()}>Yes</button>
                    <button className="btn btn-close" onClick={handleClose}>Cancel</button>
                </Modal.Footer>
            </Modal>


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
        showSubProductView: state.showSubProductView,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadCurrentSite: (data) =>
            dispatch(actionCreator.loadCurrentSite(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};
export default connect(mapStateToProps, mapDispachToProps)(DocumentsDisplay);

