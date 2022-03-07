import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import {ChevronRight} from "@mui/icons-material";
import Backdrop from '@mui/material/Backdrop';
import PageHeader from "../PageHeader";


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

  function RightSidebar(props) {
    const theme = useTheme();
    const { children } = props


    const handleDrawerOpen = () => {
        props.toggleOpen()
    };



    const handleDrawerClose = () => {
        props.toggleOpen()
    };

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={props.open}
            // onClick={props.toggleOpen}
        >
        <Box sx={{ display: 'flex' }} >

            <Drawer
                className={"right-bar-custom"}
                sx={{
                    // width: props.width,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: props.width,
                    },
                }}

                variant="persistent"
                anchor="right"
                open={props.open}
            >
                <DrawerHeader className={"align-items-center d-flex"}>
                    <IconButton onClick={props.toggleOpen} className={"mr-4"}>
                        <ChevronRight />
                    </IconButton>

                    <h4 className="blue-text text-heading m-0">{props.heading}</h4>

                </DrawerHeader>
                <Divider />

                {children}


            </Drawer>
        </Box>
        </Backdrop>
    );
}


const mapStateToProps = (state) => {
    return {
        // showRightBar: state.showRightBar,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        toggleRightBar: (data) => dispatch(actionCreator.toggleRightBar(data)),


    };
};
export default connect(mapStateToProps, mapDispatchToProps)(RightSidebar);



