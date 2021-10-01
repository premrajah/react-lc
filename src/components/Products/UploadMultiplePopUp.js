import {Modal} from "react-bootstrap";
import UploadMultiSiteOrProduct from "../UploadImages/UploadMultiSiteOrProduct";
import React, { useState } from 'react';
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

 const UploadMultiplePopUp = (props) => {


    return (
        <>
            <Modal size="lg" show={props.showMultiplePopUp} backdrop="static" onHide={() => props.setMultiplePopUp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="row">
                            <div className="col">
                                <h4 className="text-center green-text">Upload Multiple</h4>
                            </div>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UploadMultiSiteOrProduct isProduct  />
                </Modal.Body>
            </Modal>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        showMultiplePopUp: state.showMultiplePopUp,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(UploadMultiplePopUp);
