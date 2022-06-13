import React, {Component} from "react";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import "../../Util/upload-file.css";
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import EventItem from "./EventItem";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import {removeTime} from "../../Util/GlobalFunctions";



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
            highlightedDays:[1,2,15],
            events:[],
            calendarEvents:[]
        }
    }


     handleChange=(newValue)=>{

        this.setState({date:newValue});


    }

    convertEvents=(events)=>{
        let calenderEvents=[]
        events.forEach(item=>

        calenderEvents.push({
            title:item.event.title,
            start:removeTime(item.event.resolution_epoch_ms),
            className:"fc-event-"+item.event.process

        })
        )

        return calenderEvents

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


    getEvents=()=>{

        this.setState({
            events:[]
        })

        let url=`${baseUrl}${this.props.productId?"product/"+this.props.productId+"/event":"event"}`
        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(url)
            .then(
                (response) => {

                    var responseAll = response.data.data;

                    this.setState({
                        events:responseAll,
                        calendarEvents:this.convertEvents(responseAll)
                    })

                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



    }


    componentDidMount() {

        this.getEvents()
    }

    render() {


        return (
            <>

                <div className={"row justify-content-center create-product-row"}>

                    <div className={`bg-white-1 ${this.props.smallView?"col-6 fc-small-calender":"col-8" }`}
                         style={{position:"sticky!important",top:0}}
                    >
                        {/*{(this.props.smallView&&(this.state.events.length>0))||(!this.props.smallView) &&*/}
                        <FullCalendar
                            defaultView="dayGridMonth"
                            header={{
                                left: "prev,next",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay"
                            }}
                            plugins={[dayGridPlugin, timeGridPlugin]}
                            events={this.state.calendarEvents}
                        />
                        {/*// }*/}
                    </div>

                    {this.state.events.length>0 ?
                    <div  className={`bg-white-1 ${this.props.smallView?"small-log-view col-6":"col-4" }`}>
                        <EventItem smallView={this.props.smallView} events={this.state.events}/>
                    </div>:
                        <div className={`bg-white-1 ${this.props.smallView?"col-6":"col-4" }`}>
                            No Events exist</div>}
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
