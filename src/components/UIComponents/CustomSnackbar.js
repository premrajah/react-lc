import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";


function CustomSnackbar(props) {

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div >

            <Snackbar anchorOrigin={{ vertical:"bottom",horizontal: "right" }} open={props.snackbarMessage.show} autoHideDuration={props.snackbarMessage.duration?props.snackbarMessage.duration:4000} onClose={()=> props.showSnackbar({show:false})}>
                <Alert variant="filled"  onClose={()=> props.showSnackbar({show:false})} severity={props.snackbarMessage.severity?props.snackbarMessage.severity:"info"}>
                    {props.snackbarMessage.message}
                </Alert>
            </Snackbar>

        </div>
    );
}
const mapStateToProps = state => {
    return {

        snackbarMessage: state.snackbarMessage,


    };
};


const mapDispachToProps = dispatch => {
    return {

        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};
export default connect(
    mapStateToProps,
    mapDispachToProps
)(CustomSnackbar);
