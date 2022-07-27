import React, {Fragment, useEffect, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
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
import {removeTime} from "../../Util/GlobalFunctions";
import {baseUrl} from "../../Util/Constants";
import axios from "axios";

const mLocalizer = momentLocalizer(moment)

const ColoredDateCellWrapper = ({ children }) =>
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: 'lightblue',
        },
    })

/**
 * We are defaulting the localizer here because we are using this same
 * example on the main 'About' page in Storybook
 */
export default function BigCalenderEvents({
                                  localizer = mLocalizer,
                                  showDemoLink = true,
                                  ...props
                              }) {

    const [events,setEvents]=useState([])
    const [calanderEvents,setCalanderEvents]=useState([])

    const { components, defaultDate, max, views } = useMemo(
        () => ({
            components: {
                timeSlotWrapper: ColoredDateCellWrapper,
            },
            defaultDate: new Date(),
            max: dates.add(dates.endOf(new Date(2022, 17, 1), 'day'), 1, 'hours'),
            views: Object.keys(Views).map((k) => Views[k]),
        }),
        []
    )


  const  getEvents=(start,end)=>{

      setEvents([])
        let url=`${baseUrl}${props.productId?"product/"+props.productId+"/event":"event"}?`

        if (start){
            url=`${url}start=${start}`
        }
        if (end){
            url=`${url}&end=${end}`
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


                    setEvents(responseAll)
                    setCalanderEvents(convertEvents(responseAll))
                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );



    }


    useEffect(()=>{

        getEvents()

    },[])

  const  convertEvents=(events)=>{



        let calenderEvents=[]
        events.forEach(item=> {
            let date=new Date(item.event.resolution_epoch_ms)

            console.log(date)
            console.log(item)
                calenderEvents.push({
                    id: item.event._key,
                    title: item.event.title,
                    // allDay: true,
                    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
                    end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0),
                    className:"fc-event-"+item.event.process,
                    desc: "Some description "+ item.event._key


                })
            }
        )

        return calenderEvents

    }


  const  handleSelectSlot = (arg) => { // bind with an arrow function

        console.log(arg)
        // var now = arg.date;
        // var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        // var timestamp = startOfDay / 1000;

        // alert(arg.dateStr)


        getEvents(new Date(arg.start).getTime(), new Date(arg.end).getTime())

    }

    return (
        <Fragment>
            <div className={"row justify-content-center create-product-row"}>

                <div className={`bg-white-1 ${props.smallView?"col-6 fc-small-calender":"col-8" }`}
                     style={{position:"sticky!important",top:0}}
                >


                <Calendar
                    components={components}
                    defaultDate={defaultDate}
                    events={calanderEvents}
                    localizer={localizer}
                    max={1}
                    showMultiDayTimes
                    step={60}
                    views={views}
                    style={{height:"600px"}}
                    startAccessor="start"
                    endAccessor="end"
                    popup
                    selectable
                    // onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                />



                </div>
                {events.length>0 ?
                    <div  className={`bg-white-1 ${props.smallView?"small-log-view col-6":"col-4" }`}>
                        <EventItem refresh={()=>getEvents()} smallView={props.smallView} events={events}/>
                    </div>:
                    <div className={`bg-white-1 ${props.smallView?"col-6":"col-4" }`}>
                        No Events exist</div>}

            </div>
        </Fragment>
    )
}
BigCalenderEvents.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
    showDemoLink: PropTypes.bool,
}
