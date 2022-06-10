import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import "../../Util/upload-file.css";
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from '@mui/material/TextField';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import {StaticDatePicker,DatePicker} from "@mui/lab";
import EventItem from "./EventItem";
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
        <Tooltip enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
};

class CalenderEvents extends Component {

    slug = null;

    constructor(props) {
        super(props);

        this.state = {
          date:null,
            highlightedDays:[1,2,15]
        }
    }


     handleChange=(newValue)=>{

        this.setState({date:newValue});


    }



     popperSx = {
        "& .MuiPaper-root": {
            border: "1px solid black",
            padding: 2,
            marginTop: 1,
            backgroundColor: "rgba(120, 120, 120, 0.2)"
        },
        "& .MuiCalendarPicker-root": {
            backgroundColor: "rgba(45, 85, 255, 0.4)"
        },
        "& .PrivatePickersSlideTransition-root": {},
        "& .MuiPickersDay-dayWithMargin": {
            color: "rgb(229,228,226)",
            backgroundColor: "rgba(50, 136, 153)"
        },
        "& .MuiTabs-root": { backgroundColor: "rgba(120, 120, 120, 0.4)" }
    };

    render() {


        return (
            <>

                <div className={"row justify-content-center create-product-row"}>
                    <div className={"col-8"}>

                        <LocalizationProvider   dateAdapter={AdapterDateFns}>
                            <CalendarPicker
                                renderDay={(day, _value, DayComponentProps) => {
                                    const isSelected =
                                        !DayComponentProps.outsideCurrentMonth &&
                                        this.state.highlightedDays.indexOf(day.getDate()) > 0;

                                    return (
                                        <>
                                            {isSelected ? <Badge
                                                key={day.toString()}
                                                // overlap="circular"
                                                color={"secondary"}
                                                badgeContent={ '2' }
                                            >
                                                <PickersDay {...DayComponentProps} />
                                            </Badge>: <PickersDay {...DayComponentProps} />}
                                        </>
                                    );
                                }}

                                style={{widht:"100%"}}
                                PopperProps={{
                                    sx: this.popperSx
                                }}
                                date={this.state.date} onChange={(newDate) => this.handleChange(newDate)} />
                            {/*<StaticDatePicker*/}

                            {/*    PopperProps={{*/}
                            {/*        sx: this.popperSx*/}
                            {/*    }}*/}
                            {/*    renderDay={(day, _value, DayComponentProps) => {*/}
                            {/*        const isSelected =*/}
                            {/*            !DayComponentProps.outsideCurrentMonth &&*/}
                            {/*            this.state.highlightedDays.indexOf(day.getDate()) > 0;*/}

                            {/*        return (*/}
                            {/*            <>*/}
                            {/*                {isSelected ? <Badge*/}
                            {/*                key={day.toString()}*/}
                            {/*                // overlap="circular"*/}
                            {/*                color={"secondary"}*/}
                            {/*                badgeContent={ '2' }*/}
                            {/*            >*/}
                            {/*                <PickersDay {...DayComponentProps} />*/}
                            {/*            </Badge>: <PickersDay {...DayComponentProps} />}*/}
                            {/*                </>*/}
                            {/*        );*/}
                            {/*    }}*/}


                            {/*    // displayStaticWrapperAs="mobile"*/}
                            {/*    // minDate={addDays(new Date(0, 0, 0, 8), days)}*/}
                            {/*    // shouldDisableDate={disableWeekends}*/}

                            {/*    inputFormat={"yyyy-MM-dd HH:mm"}*/}
                            {/*    // ampm={false}*/}
                            {/*    // variant="inline"*/}
                            {/*    // toolbarTitle={"Datum und Uhrzeit auswählen"}*/}
                            {/*    variant="inline"*/}
                            {/*    value={this.state.date}*/}
                            {/*    label={""}*/}
                            {/*    toolbarPlaceholder={""}*/}
                            {/*    onChange={(newValue) => {*/}
                            {/*        this.handleChange(newValue)*/}
                            {/*    }}*/}

                            {/*    // minTime={new Date(0, 0, 0, 8)}*/}
                            {/*    // maxTime={new Date(0, 0, 0, 17, 0)}*/}
                            {/*    // shouldDisableTime={(timeValue, clockType) => {*/}
                            {/*    //     if (clockType === 'hours' && (timeValue ==12)) {*/}
                            {/*    //         return true;*/}
                            {/*    //     }*/}
                            {/*    //*/}
                            {/*    //     return false;*/}
                            {/*    // }}*/}
                            {/*    renderInput={(params) => <TextField*/}
                            {/*        sx={{width: '100%'}} {...params} />}*/}
                            {/*/>*/}
                        </LocalizationProvider>

                    </div>
                    <div className={"col-4"}>

                        <EventItem/>
                    </div>
                </div>

            </>
        );
    }
}




const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,
        parentProduct: state.parentProduct,
        product: state.product,
        showProductPopUp: state.showProductPopUp,
        siteList: state.siteList,
        productWithoutParentList: state.productWithoutParentList,
        productPageOffset:state.productPageOffset,
        productPageSize:state.productPageSize,
        createProductId:state.createProductId
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        setParentProduct: (data) => dispatch(actionCreator.setParentProduct(data)),
        setMultiplePopUp: (data) => dispatch(actionCreator.setMultiplePopUp(data)),
        setProduct: (data) => dispatch(actionCreator.setProduct(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
        loadCurrentProduct: (data) =>
            dispatch(actionCreator.loadCurrentProduct(data)),

        loadProductsWithoutParent: (data) =>
            dispatch(actionCreator.loadProductsWithoutParent(data)),
        loadProductsWithoutParentNoListing: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentNoListing(data)),

        loadProductsWithoutParentPagination: (data) =>
            dispatch(actionCreator.loadProductsWithoutParentPagination(data)),
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
        refreshPage: (data) => dispatch(actionCreator.refreshPage(data)),
        setCurrentProduct: (data) => dispatch(actionCreator.setCurrentProduct(data)),


    };
};
export default  connect(mapStateToProps, mapDispachToProps)(CalenderEvents);
