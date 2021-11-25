import React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert  from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';
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

            <Snackbar anchorOrigin={{ vertical:"bottom",horizontal: "right" }} open={props.snackbarMessage.show} autoHideDuration={2000} onClose={()=> props.showSnackbar({show:false})}>
                <Alert variant="filled"  onClose={()=> props.showSnackbar({show:false})} severity={props.snackbarMessage.severity}>
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
