import React, {Fragment, useEffect, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import moment, {now} from 'moment'
import {
    Calendar,
    Views,
    DateLocalizer,
    momentLocalizer,
} from 'react-big-calendar'
// import DemoLink from './DemoLink.component'
import eventDatas from './events'
import * as dates from './dates'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import EventItem from "./EventItem";
import {LoaderAnimated, removeTime, weekday} from "../../Util/GlobalFunctions";
import {baseUrl} from "../../Util/Constants";
import axios from "axios";
import Badge from '@mui/material/Badge';
import {Add} from "@mui/icons-material";
import GlobalDialog from "../RightBar/GlobalDialog";
import EventForm from "./EventForm";
import BlueBorderLink from "../FormsUI/Buttons/BlueBorderLink";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import GrayBorderBtn from "../FormsUI/Buttons/GrayBorderBtn";
const mLocalizer = momentLocalizer(moment)

const ColoredDateCellWrapper = ({ children }) => {


    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: 'white',
        },
    })
}

const CustomDateCellWrapper = ({ children }) => {


    return (
        <span className="custom-day-cell">
            <Add className="add-event-icon"/>

            {children}
    </span>
    )
}
/**
 * We are defaulting the localizer here because we are using this same
 * example on the main 'About' page in Storybook
 */
export default function BigCalenderEvents({
                                  localizer = mLocalizer,
                                  showDemoLink = true,
                                              smallView,
                                  ...props
                              }) {

    const [events,setEvents]=useState([])
    const [monthEvents,setMonthEvents]=useState([])
    const [calanderEvents,setCalanderEvents]=useState([])
    const [selectedDate,setSelectedDate]=useState(new Date())
    const [showEventPopUp,setShowEventPopUp]=useState(false)
    const [showAddEventPopUp,setShowAddEventPopUp]=useState(false)

    const [loading,setLoading]=useState([])


   const showEvent=()=> {

      setShowEventPopUp(!showEventPopUp)

    }

    const showAddEvent=()=> {

        setShowAddEventPopUp(!showAddEventPopUp)

    }

    const Event=({ event }) =>{
        return (
            <span className="text-blue text-12">

            <b> <Badge  anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }} className={"fc-event-"+event.process} color="secondary" overlap="circular" badgeContent="" variant="dot">
                  </Badge> {event.title}</b>

                {event.desc && ':  ' + event.desc}
    </span>
        )
    }


    const Day=({ event }) =>{
        return (
            <span className="text-blue text-12">

            <b> <Badge  anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }} className={"fc-event-"+event.process} color="secondary" overlap="circular" badgeContent="" variant="dot">
                  </Badge> {event.title}</b>

                {event.desc && ':  ' + event.desc}
    </span>
        )
    }

    const { components, defaultDate, max, views } = useMemo(
        () => ({
            components: {
                timeSlotWrapper: ColoredDateCellWrapper,
                // dateCellWrapper:CustomDateCellWrapper,
                event: Event,
                // date:CustomDateCellWrapper
            },
            defaultDate: new Date(),
            max: dates.add(dates.endOf(new Date(2022, 17, 1), 'day'), 1, 'hours'),
            views: Object.keys({
                MONTH: 'month',
                // WEEK: 'week',
                // WORK_WEEK: 'work_week',
                // DAY: 'day',
                // AGENDA: 'agenda'
            }).map((k) => Views[k]),
        }),
        []
    )


  const  getEvents=(start,end)=>{

        setLoading(true)

      setEvents([])
        let url=`${baseUrl}${props.productId?"product/"+props.productId+"/event":"event"}?`

        if (start){
            url=`${url}resolv_start=${start}`
        }
        if (end){
            url=`${url}&resolv_end=${end}`
        }

        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(url)
            .then(
                (response) => {

                    var responseAll = response.data.data;

                    // this.setState({
                    //     events:responseAll,
                    //     calendarEvents:this.convertEvents(responseAll)
                    // })

                    if (smallView){

                        setMonthEvents(convertEvents(responseAll))
                    }

                    setEvents(responseAll)
                    setCalanderEvents(convertEvents(responseAll))

                    setLoading(false)
                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                    setLoading(false)
                }
            );



    }



    const  getEventsByMonth=(start,end)=>{

        setEvents([])
        let url=`${baseUrl}${props.productId?"product/"+props.productId+"/event":"event"}?`

        if (start){
            url=`${url}resolv_start=${start}`
        }
        if (end){
            url=`${url}&resolv_end=${end}`
        }

        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(url)
            .then(
                (response) => {

                    var responseAll = response.data.data;

                    // this.setState({
                    //     events:responseAll,
                    //     calendarEvents:this.convertEvents(responseAll)
                    // })


                    setMonthEvents(convertEvents(responseAll))
                    // setCalanderEvents(convertEvents(responseAll))
                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



    }


    useEffect(()=>{


        if (!smallView){
            getEventsByMonth(moment().startOf('month').format("x"),
                moment().endOf('month').format("x"))

            getEvents(moment().startOf('day').format("x"),
                moment().endOf('day').format("x"))
        }else{
            getEvents()
        }


    },[])

  const  convertEvents=(events)=>{



        let calenderEvents=[]
        events.forEach((item,index)=> {
            let date=new Date(item.event.resolution_epoch_ms)

            // console.log(date)
            // console.log(item)
                calenderEvents.push({
                    id: item.event._key,
                    index:index+1,
                    title: item.event.title,
                   process:item.event.process,
                    // allDay: true,
                    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
                    end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),

                    // end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0),
                    className:"fc-event-"+item.event.process,
                    desc: "Some description "+ item.event._key


                })
            }
        )

        return calenderEvents

    }


  const  handleSelectSlot = (arg) => { // bind with an arrow function

      // console.log("single click",arg.action);
if (!smallView) {

    switch (arg.action) {
        case "click":
            console.log("single click");
            if (!smallView) {
                setSelectedDate(arg.start)

                console.log(moment(arg.start).startOf('day').format("x"),
                    moment(arg.start).endOf('day').format("x"))

                // getEvents(new Date(arg.start).valueOf(), new Date(arg.end).valueOf())

                getEvents(moment(arg.start).startOf('day').format("x"),
                    moment(arg.start).endOf('day').format("x"))

            }
            break;
        case "doubleClick":
            console.log("double click");

            setShowAddEventPopUp(!showAddEventPopUp)
            break;
        // case 3:
        //     console.log("triple click");
        //     break;
        default:
            return;
    }

}
    }


    const  handleNaviation = (arg) => { // bind with an arrow function

        console.log(arg)
        if (!smallView) {

            getEventsByMonth(getEventsByMonth(moment(arg).startOf('month').format("x"),
                moment(arg).endOf('month').format("x")))

            getEvents(moment(arg).startOf('month').format("x"),
                moment(arg).startOf('month').add(1, 'days').format('x'))

            setSelectedDate(new Date(arg.getFullYear(), arg.getMonth(), 1, 0, 0, 0))
        }

    }

        return (
        <Fragment>


            <GlobalDialog
                size="sm"
                heading={"Add event"}
                show={showAddEventPopUp}
                hide={()=> {
                    showAddEvent();
                }}
            >
                <>
                    {showAddEventPopUp&&      <div className="form-col-left col-12">
                        <EventForm
                            date={selectedDate}
                            hide={()=> {

                                showAddEvent();

                                getEventsByMonth(  moment(selectedDate).startOf('month').format("x"),
                                    moment(selectedDate).endOf('month').format("x"))
                                getEvents(moment(selectedDate).startOf('day').format("x"), moment(selectedDate).endOf('day').format("x"))
                            }}

                               />
                    </div>}
                </>
            </GlobalDialog>



            {!smallView ?  <div className={"row justify-content-center create-product-row "}>



                <div className={`bg-white-1 ${smallView?"col-12 mt-4 fc-small-calender":"col-md-8" }`}

                >

             <div
                 className="sticky-top"
             >
                <Calendar

                    className={` ${smallView?" rbc-small-calender":"rbc-big-calender" }`}
                    style={{height:"600px"}}
                    components={components}
                    defaultDate={defaultDate}
                    events={monthEvents}
                    localizer={localizer}
                    max={1}
                    showMultiDayTimes
                    step={60}
                    views={views}

                    startAccessor="start"
                    endAccessor="end"
                    // popup
                    selectable
                    // onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    onNavigate={handleNaviation }

                />



                </div>

                </div>
                <div  className={`bg-white-1 ${smallView?"small-log-view mt-4 col-12":"col-md-4" }`}>
                    {!smallView && <div className="title-bold">{weekday[selectedDate.getDay()]+", "+selectedDate.toLocaleString('default', { month: 'long' })+" "+selectedDate.getDate()+" ,"+selectedDate.getFullYear() }</div>}

                    {loading&& <LoaderAnimated/>}

                {events.length>0 ?
                    <>

                        <span className="">{events.length} {events.length>1?"Events":"Event"}</span>

                        <EventItem refresh={()=>getEvents()} smallView={smallView} events={events}/>

                        </>
                    :
                    <>
                        {!loading &&  <div className={``}>
                            No Events exist</div>}
                    </>}
                </div>
            </div>

          :


                <div className={"row justify-content-center create-product-row "}>



                    <GlobalDialog
                        size="md"
                        heading={"Events"}
                        show={showEventPopUp}
                        hide={()=> {
                            showEvent();
                        }}
                    >
                        <>
                            <Calendar

                                className={` ${smallView?" rbc-small-calender":"rbc-big-calender" }`}
                                style={{height:"600px", width:"100%"}}
                                components={components}
                                defaultDate={defaultDate}
                                events={monthEvents}
                                localizer={localizer}
                                max={1}
                                showMultiDayTimes
                                step={60}
                                views={views}

                                startAccessor="start"
                                endAccessor="end"
                                // popup
                                // selectable
                                // onSelectEvent={handleSelectEvent}
                                // onSelectSlot={handleSelectSlot}
                                // onNavigate={handleNaviation }

                            />
                        </>
                    </GlobalDialog>


                {/*    </div>*/}

                {/*</div>*/}
                <div  className={`bg-white-1 ${smallView?"small-log-view mt-4 justify-content-end text-right col-12":"col-4" }`}>

                    {loading&& <LoaderAnimated/>}

                    {!smallView &&
                    <div className="title-bold">{weekday[selectedDate.getDay()]+", "
                    +selectedDate.toLocaleString('default', { month: 'long' })+
                    " "+selectedDate.getDate()+" ,"+selectedDate.getFullYear() }</div>}


                    {events.length>0 && <GrayBorderBtn  title={"View Calender"}   onClick={showEvent} />}

                    {events.length>0 ?
                        <>
                            <p className="">{events.length} {events.length>1?"Events":"Event"}</p>

                            <EventItem   refresh={()=>getEvents()}  events={events}/>

                        </>
                        :
                        <>
                            {!loading &&  <div className={``}>
                            No Events exist</div>}
                        </>
                        }

                </div>
            </div>}
        </Fragment>
    )
}

function DayComponent(props) {
    const { children, value } = props;

    return (
        <span className={"custom-day-cell"}>
            {/*{children}*/}
        </span>
    );
}


BigCalenderEvents.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
    showDemoLink: PropTypes.bool,
}
