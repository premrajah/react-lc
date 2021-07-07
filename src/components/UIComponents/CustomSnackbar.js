import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

function CustomSnackbar(props) {
    const classes = useStyles();
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
        <div className={classes.root}>

            <Snackbar open={props.snackbarMessage.show} autoHideDuration={6000} onClose={()=> props.showSnackbar({show:false})}>
                <Alert onClose={()=> props.showSnackbar({show:false})} severity={props.snackbarMessage.severity}>
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
