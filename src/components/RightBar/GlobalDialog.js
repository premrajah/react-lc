import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CloseButtonPopUp from "../FormsUI/Buttons/CloseButtonPopUp";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

 function GlobalDialog(props) {

     const { children } = props

    const handleClose = (event,reason) => {

        if (props.disableBackdropClick&&reason==="backdropClick"){

        }else{
            props.hide()
        }

    };



    return (


            <Dialog

                open={props.show}
                TransitionComponent={Transition}
                keepMounted
                centerHeader
                onClose={handleClose}
                fullWidth={true}
                maxWidth={props.size?props.size:"sm"}
                    className={`${props.allowOverflow?" allow-overflow":""} custom-modal  ${props.allowScroll?" allow-scroll":""}`}


                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>

                    {!props.hideHeader &&!props.hideHeading ?
                        <div className=" row  justify-content-center align-items-center">
                         <div className="col-10">

                        <h4 className={"blue-text text-heading ellipsis-end mb-0 text-capitalize"}>{props.heading}</h4>
                        {props.subHeading&&<p className={"ellipsis-end mb-0 text-capitalize"}>{props.subHeading}</p>}
                    </div>
                    <div className="col-2 d-flex  justify-content-end">
                        {!props.hideClose && <CloseButtonPopUp onClick={handleClose}/>}
                    </div>
                </div>:
                        <div className="top-right mt-3 me-3 "><CloseButtonPopUp onClick={handleClose}/></div>
                    }
                    <div className={`${(props.removePadding||!props.hideHeading||!props.heading||!props.heading.length===0)?" p-0 ":"pb-3 "} row  justify-content-center align-items-center`}>

                        {children}
                    </div>

                </DialogContent>

            </Dialog>

    );
}


const mapStateToProps = (state) => {
    return {
        showGlobalDiaglog: state.showGlobalDiaglog,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        toggleGlobalDialog: (data) => dispatch(actionCreator.toggleGlobalDialog(data)),


    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalDialog);
