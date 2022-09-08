import React, { Fragment, useEffect, useMemo, useState ,useCallback} from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Calendar, DateLocalizer, momentLocalizer, Views,  } from "react-big-calendar";
import * as dates from "./dates";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventItem from "./EventItem";
import {addDays, LoaderAnimated, weekday} from "../../Util/GlobalFunctions";
import { baseUrl } from "../../Util/Constants";
import axios from "axios";
import Badge from "@mui/material/Badge";
import { Add, ArrowBack, ArrowForward } from "@mui/icons-material";
import GlobalDialog from "../RightBar/GlobalDialog";
import EventForm from "./EventForm";
import GrayBorderBtn from "../FormsUI/Buttons/GrayBorderBtn";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import CustomPopover from "../FormsUI/CustomPopover";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Year from "./Year";
import IconBtn from "../FormsUI/Buttons/IconBtn";
import {IconButton} from "@mui/material";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import GreenSmallBtn from "../FormsUI/Buttons/GreenSmallBtn";

const mLocalizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ({ children }) => {
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: "white",
        },
    });
};

const CustomDateCellWrapper = ({ children }) => {
    return <span className="custom-day-cell">{children}</span>;
};

const CustomDayview = ({ children }) => {
    return (
        <span className="custom-day-cell">
            <Add className="add-event-icon" />

            {children}
        </span>
    );
};

const CustomSlotView = ({ children }) => {
    return (
        <span className="custom-day-cell">
            <Add className="add-event-icon" />

            {children}
        </span>
    );
};

const CustomTimeGutterWrapper = ({ children }) => {
    return (
        <span className="custom-day-cell">
            <Add className="add-event-icon" />

            {children}
        </span>
    );
};

const CustomTimeGutterHeader = ({ children }) => {
    return console.log(">> ");
    return (
        <span className="custom-day-cell">
            <Add className="add-event-icon" />

            {children}
        </span>
    );
};
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
    const [events, setEvents] = useState([]);
    const [monthEvents, setMonthEvents] = useState([]);
    const [eventsTemp, setEventsTemp] = useState([]);
    const [calanderEvents, setCalanderEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState('month');
    const [tmpView, setTmpView] = useState('month');
    // const [navigate, setNavigate] = useState(new Date());


    const [showEventPopUp, setShowEventPopUp] = useState(false);
    const [showAddEventPopUp, setShowAddEventPopUp] = useState(false);


    useEffect(()=>{

        console.log("view changed", (view))
    },[view])

    const size = 50;
    const [loading, setLoading] = useState([]);
    // const [offset, setOffset] = useState(0);

    const showEvent = () => {
        setShowEventPopUp(!showEventPopUp);
    };

    const showAddEvent = () => {
        setShowAddEventPopUp(!showAddEventPopUp);
    };

    const Event = (props) => {
        let event = props.event;

        // console.log(event)

        return (
            <div
                onClick={(eventNew) => {

                    if (eventNew.detail==1){

                        setSelectedDate(event.start);
                        getEvents(
                            moment(event.start).startOf("day").format("x"),
                            moment(event.start).endOf("day").format("x")
                        );
                    }

                    if (eventNew.detail==2){
                        setShowAddEventPopUp(!showAddEventPopUp);
                    }

                }}
                className=" event-bx text-12 txt-gray-dark" >
                <span>
                    <Badge
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        className={"fc-event-" + event.process}
                        color="secondary"
                        overlap="circular"
                        badgeContent=""
                        variant="dot"
                    />
                    {event.title}
                </span>

                {event.desc && ":  " + event.desc}
            </div>
        );
    };

    const Day = ({ event }) => {
        return (
            <span className="text-blue text-12">
                <b>
                    <Badge
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        className={"fc-event-" + event.process}
                        color="secondary"
                        overlap="circular"
                        badgeContent=""
                        variant="dot"
                    />
                    {event.title}
                </b>

                {event.desc && ":  " + event.desc}
            </span>
        );
    };

    const DateHeader = (props) => {
        return (
            <>
                <div className="custom-date-header">
                    <Add className="add-event-icon" />
                </div>
            </>
        );
    };

    const CustomToolbar = (props) => {


        let navigate = (action) => {
            props.onNavigate(action);
        };

        // let viewSelect = (view) => {
        //     props.onView(view);
        // };


        const getLabel=( date)=>{

            if (view=="year"){

                return date.getFullYear()
            }
            else  if (view=="month") {
                return date.toLocaleString("default", { month: "long" })+", "+date.getFullYear()
            }
            else  if (view=="week") {

                const startDate= moment(date).startOf('week').toDate()
                const endDate=moment(date).endOf('week').toDate()

              return  startDate.getDate()+" "+startDate.toLocaleString("default", { month: "short" })+" "+ startDate.getFullYear()+
              " - "
              +endDate.getDate()+" "+endDate.toLocaleString("default", { month: "short" })+" "+ endDate.getFullYear()

            }

        }


        const handleAlignment = (event, newAlignment) => {

            if (newAlignment&&newAlignment!==tmpView){
                setTmpView(newAlignment)
                onView(newAlignment);
            }


        };



        return (
            <>
                <div className="rbc-toolbar-1 mb-2">
                    <div>
                          <div>
            <Paper
                elevation={0}
                sx={{
                    display: "flex",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: "wrap",
                }}>
                <StyledToggleButtonGroup
                    size="small"
                    value={view}
                    exclusive
                    color="secondary"
                    onChange={handleAlignment}
                    aria-label="text alignment">
                    {!props.hideYear &&  <ToggleButton value="year" aria-label="Year">
                        <span>Year</span>
                    </ToggleButton>}
                    <ToggleButton value="month" aria-label="Month">
                        <span>Month</span>
                    </ToggleButton>
                    <ToggleButton value="week" aria-label="Week">
                        <span>Week</span>
                    </ToggleButton>

                </StyledToggleButtonGroup>
            </Paper>
        </div>

                    </div>




                    <div className="rbc-btn-group d-flex justify-content-center align-items-center">
                       <span>
                           <IconButton className="">
                               <ArrowBack

                            className="arrow-back cal-arrows"
                            onClick={() => {
                                console.log(view)



                                if (view==="year"){
                                    setSelectedDate(moment(selectedDate).subtract(1, "years").toDate());
                                    handleNavigation(moment(selectedDate).subtract(1, "years").toDate(), true);
                                }
                               else if (view==="month"){
                                    setSelectedDate(moment(selectedDate).subtract(1, "M").toDate());
                                    handleNavigation(moment(selectedDate).subtract(1, "M").toDate(), true);
                                }
                               else if (view==="week"){
                                    setSelectedDate(moment(selectedDate).subtract(7, "days").toDate());
                                    handleNavigation(moment(selectedDate).subtract(7, "days").toDate(), true);
                                }


                            }}
                        /></IconButton>
                        </span>
  <div className=" title-bold ps-4 pe-4">
      {getLabel(selectedDate)}
  </div>

                     <div className="">
                          <IconButton className={""}><ArrowForward
                            className="arrow-forward   cal-arrows"
                            onClick={() => {
                                // Navigate("NEXT");


                                if (view==="year"){
                                    setSelectedDate(moment(selectedDate).add(1, "years").toDate());
                                    handleNavigation(moment(selectedDate).add(1, "years").toDate(), true);
                                }
                                else if (view==="month"){
                                    setSelectedDate(moment(selectedDate).add(1, "M").toDate());
                                    handleNavigation(moment(selectedDate).add(1, "M").toDate(), true);
                                }
                                else if (view==="week"){
                                    setSelectedDate(moment(selectedDate).add(7, "days").toDate());
                                    handleNavigation(moment(selectedDate).add(7, "days").toDate(), true);
                                }



                            }}
                        />
                          </IconButton>
                        </div>
                    </div>
                    <div>  <GreenSmallBtn
                       title={"Today"}
                        type="button"
                        onClick={() => {
                            // Navigate("TODAY");
                            setSelectedDate(new Date());
                            handleNavigation(new Date(),true);
                        }}>

                    </GreenSmallBtn>
                    </div>
                </div>
            </>
        );
    };

    const EventWrapper = ({ event, children }) => {
        const { title, className } = children.props;
        const customClass = `${className} rbc-event--${event.type}`;
        const hourStart = moment(event.start).hour();
        const hourStop = moment(event.end).hour();
        const gridRowStart = hourStart + 1;

        return (
            <div
                title={title}
                className={customClass}
                style={{ gridRow: `${gridRowStart} / span ${hourStop - hourStart}` }}>
                {children.props.children}
            </div>
        );
    };
    const { components, defaultDate, max, views } = useMemo(
        () => ({
            components: {
                // year:Year,
                // toolbar: CustomToolbar,
                //
                // month: {
                //     dateHeader: DateHeader,
                // },
                // timeSlotWrapper: ColoredDateCellWrapper,
                // dateCellWrapper:CustomDateCellWrapper,
                event: Event,
                eventWrapper: EventWrapper,
                // timeGutterHeader: CustomTimeGutterHeader,
                // timeGutterWrapper:function test(){},
                // dateCellWrapper:()=>{},
                // date:CustomDateCellWrapper
            },
            defaultDate: new Date(),
            max: dates.add(dates.endOf(new Date(2022, 17, 1), "day"), 1, "hours"),
            views: Object.keys({
                YEAR: "year",
                MONTH: "month",
                WEEK: "week",
                // WORK_WEEK: 'work_week',
                // DAY: 'day',
                AGENDA: "agenda",
            }).map((k) => (k != "YEAR" ? Views[k] : Year)),
        }),
        []
    );

    const getEvents = (start, end) => {
        setLoading(true);

        setEvents([]);
        let url = `${baseUrl}${
            props.productId ? "product/" + props.productId + "/event" : "event"
        }?`;

        if (start) {
            url = `${url}resolv_start=${start}`;
        }
        if (end) {
            url = `${url}&resolv_end=${end}`;
        }

        axios.get(url).then(
            (response) => {
                var responseAll = response.data.data;

                if (smallView) {
                    setMonthEvents(convertEvents(responseAll));
                }

                setEvents(responseAll);
                setCalanderEvents(convertEvents(responseAll));

                setLoading(false);
            },
            (error) => {
                // this.setState({
                //     notFound: true,
                // });
                setLoading(false);
            }
        );
    };

    const fetchMonthEventsPageWise = (start, end, url, offset) => {
        axios
            // .get(baseUrl + "site/" + encodeUrl(data) + "/expand"
            .get(url)
            .then(
                (response) => {
                    let responseAll = convertEvents(response.data.data, offset);

                    setMonthEvents((monthEvents) => monthEvents.concat(responseAll));

                    if (responseAll.length == size) {
                        getEventsByMonth(start, end, offset + size);
                    }
                },
                (error) => {
                    // this.setState({
                    //     notFound: true,
                    // });
                }
            );
    };

    const getEventsByMonth = (start, end, offset) => {
        let url = `${baseUrl}${
            props.productId ? "product/" + props.productId + "/event" : "event"
        }?`;

        if (start) {
            url = `${url}resolv_start=${start}`;
        }
        if (end) {
            url = `${url}&resolv_end=${end}`;
        }

        url = `${url}&offset=${offset}&size=${size}`;

        fetchMonthEventsPageWise(start, end, url, offset);
    };

    useEffect(() => {
        console.log("running");
        if (!smallView) {
            setMonthEvents([]);
            getEventsByMonth(
                moment().startOf("month").format("x"),
                moment().endOf("month").format("x"),
                0
            );

            getEvents(moment().startOf("day").format("x"), moment().endOf("day").format("x"));
        } else {
            getEvents();
        }
    }, []);

    const convertEvents = (events, offset) => {
        let calenderEvents = [];
        events.forEach((item, index) => {
            let date = new Date(item.event.resolution_epoch_ms);

            // console.log(date)
            // console.log(item)
            calenderEvents.push({
                id: item.event._key,
                index: index + 1,
                title: item.event.title,
                process: item.event.process,
                // allDay: true,
                start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
                end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),

                // end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0),
                className: "fc-event-" + item.event.process,
                desc: item.event.description,
            });
        });

        console.log(offset, calenderEvents.length);
        // console.log("cal events",calenderEvents)
        return calenderEvents;
    };

    const handleSelectSlot = (arg) => {
        console.log("<<<<<<<<<< args", arg);
        if (!smallView) {
            switch (arg.action) {
                case "click":
                    setSelectedDate(arg.start);
                    getEvents(
                        moment(arg.start).startOf("day").format("x")-10,
                        moment(arg.start).endOf("day").format("x")
                    );
                    break;
                case "doubleClick":
                    setShowAddEventPopUp(!showAddEventPopUp);
                    break;

                default:
                    return;
            }
        }
    };

    const handleNavigation = (arg, all) => {
        // bind with an arrow function
         console.log(arg)

        if (!smallView) {
            if (all) {
                setMonthEvents([]);

                getEventsByMonth(
                    moment(arg).startOf("month").format("x"),
                    moment(arg).endOf("month").format("x"),
                    0
                );
            }

            getEvents(
                moment(arg).startOf("day").format("x"),
                moment(arg).endOf("day").add(1, "days").format("x")
            );

            // setSelectedDate(new Date(arg.getFullYear(), arg.getMonth(), 1, 0, 0, 0));
        }
    };

        const handleDateCallback = (d) => {
            console.log("Date from year ", d)
            // navigate()
        try{
                 setTmpView('month')
                 onView('month')
                 setSelectedDate(d._d)
                 handleNavigation(d._d,true)
            // onNavigate(d._d)
        }catch (e){
                    console.log(e)
        }



        }

        const onView = useCallback((newView) => setView(newView), [setView])


    return (
        <Fragment>
            <GlobalDialog
                size="sm"
                heading={"Add event"}
                show={showAddEventPopUp}
                hide={() => {
                    showAddEvent();
                }}>
                <>
                    {showAddEventPopUp && (
                        <div className="form-col-left col-12">
                            <EventForm
                                date={selectedDate}
                                hide={() => {
                                    setMonthEvents([]);
                                    showAddEvent();
                                    getEventsByMonth(
                                        moment(selectedDate).startOf("month").format("x"),
                                        moment(selectedDate).endOf("month").format("x"),0
                                    );
                                    getEvents(
                                        moment(selectedDate).startOf("day").format("x"),
                                        moment(selectedDate).endOf("day").format("x")
                                    );
                                }}
                            />
                        </div>
                    )}
                </>
            </GlobalDialog>

            {!smallView ? (
                <div className={"row justify-content-center create-product-row "}>
                    <div
                        className={`bg-white-1 ${
                            smallView ? "col-12 mt-4 fc-small-calender" : "col-md-8"
                        }`}>
                        <div className="sticky-top">

                            <CustomToolbar />
                            <Calendar
                                toolbar={false}
                                className={` ${
                                    smallView ? " rbc-small-calender" : "rbc-big-calender"
                                }`}
                                style={{ height: "600px", maxHeight: "600px", overflowY: "scroll" }}
                                components={components}
                                defaultDate={defaultDate}
                                events={monthEvents}
                                localizer={localizer}
                                max={1}

                                showMultiDayTimes
                                step={60}
                                selectable={true}
                                // views={views}
                                views={{
                                    // day: true,
                                    week: true,
                                    month: true,
                                    // year: <Year handleYearClick={()=>{alert("here")}} />,
                                    year:Year,
                                }}
                                onView={onView}
                                view={view}
                                date={selectedDate}

                                messages={{ year: "Year" }}
                                startAccessor="start"
                                endAccessor="end"

                                onSelectSlot={handleSelectSlot}
                                // onNavigate={handleNavigation}
                                dateCallback={(d) => handleDateCallback(d)}

                            />
                        </div>
                    </div>
                    <div
                        className={`bg-white-1 ${
                            smallView ? "small-log-view mt-4 col-12" : "col-md-4"
                        }`}>
                        {!smallView && (
                            <div className="title-bold row d-flex align-items-center ">
                                <div className="text-left  col-8 justify-content-start">
                                    {weekday[selectedDate.getDay()] +
                                        ", " +
                                        selectedDate.toLocaleString("default", { month: "long" }) +
                                        " " +
                                        selectedDate.getDate() +
                                        " ," +
                                        selectedDate.getFullYear()}
                                </div>
                                <div className="text-right col-4 justify-content-end ml-2">
                                    <CustomPopover text={"Add event"}>
                                        <ActionIconBtn
                                            onClick={() => {

                                                setShowAddEventPopUp(!showAddEventPopUp);
                                            }}>
                                            <Add className="add-event-icon" />
                                        </ActionIconBtn>
                                    </CustomPopover>
                                </div>
                            </div>
                        )}

                        {loading && <LoaderAnimated />}

                        {events.length > 0 ? (
                            <>
                                <span className="">
                                    {events.length} {events.length > 1 ? "Events" : "Event"}
                                </span>

                                <EventItem
                                    refresh={(date) => handleNavigation(date,true)}
                                    smallView={smallView}
                                    events={events}
                                />
                            </>
                        ) : (
                            <>{!loading && <div className={``}>No Events exist</div>}</>
                        )}
                    </div>
                </div>
            ) : (
                <div className={"row justify-content-center create-product-row "}>
                    <GlobalDialog
                        size="md"
                        heading={"Events"}
                        subHeading={"(View Only)"}
                        show={showEventPopUp}
                        hide={() => {
                            showEvent();
                        }}>
                        <>
                            <CustomToolbar hideYear />
                            <Calendar

                                toolbar={false}

                                className={` ${
                                    smallView ? " rbc-small-calender" : "rbc-big-calender"
                                }`}
                                style={{ height: "600px", width: "100%" }}
                                components={components}
                                defaultDate={defaultDate}
                                events={monthEvents}
                                localizer={localizer}
                                max={1}
                                showMultiDayTimes
                                step={60}

                                startAccessor="start"
                                endAccessor="end"
                                views={{
                                    // day: true,
                                    week: true,
                                    month: true,
                                    // year:Year,
                                }}
                                onView={onView}
                                view={view}
                                date={selectedDate}
                            />
                        </>
                    </GlobalDialog>

                    <div
                        className={`bg-white-1 ${
                            smallView
                                ? "small-log-view mt-4 justify-content-end text-right col-12"
                                : "col-4"
                        }`}>
                        {loading && <LoaderAnimated />}

                        {!smallView && (
                            <div className="title-bold">
                                {weekday[selectedDate.getDay()] +
                                    ", " +
                                    selectedDate.toLocaleString("default", { month: "long" }) +
                                    " " +
                                    selectedDate.getDate() +
                                    " ," +
                                    selectedDate.getFullYear()}
                            </div>
                        )}

                        {events.length > 0 && (
                            <GrayBorderBtn title={"View Calender"} onClick={showEvent} />
                        )}

                        {events.length > 0 ? (
                            <>
                                <p className="mt-3">
                                    {events.length} {events.length > 1 ? "Events" : "Event"}
                                </p>

                                <EventItem refresh={() => getEvents()} events={events} />
                            </>
                        ) : (
                            <>{!loading && <div className={``}>No Events exist</div>}</>
                        )}
                    </div>
                </div>
            )}
        </Fragment>
    );
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    "& .MuiToggleButtonGroup-grouped": {
        margin: theme.spacing(0.5),
        border: 0,
        "&.Mui-disabled": {
            border: 0,
        },
        "&:not(:first-of-type)": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:first-of-type": {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

 const CustomizedDividers=(props)=> {

     const [view, setView] = React.useState('month');

     const handleAlignment = (event, newAlignment) => {
         // setCurrentView(newAlignment);
         // onView(newAlignment);
         setView(newAlignment)
     };


     return (
      <>
          <Paper
              elevation={0}
              sx={{
                  display: "flex",
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  flexWrap: "wrap",
              }}>
              <StyledToggleButtonGroup
                  size="small"
                  value={view}
                  exclusive
                  onChange={handleAlignment}
                  aria-label="text alignment">
                  <ToggleButton value="year" aria-label="Year">
                      <span>Year</span>
                  </ToggleButton>
                  <ToggleButton value="month" aria-label="Month">
                      <span>Month</span>
                  </ToggleButton>
                  <ToggleButton value="week" aria-label="Week">
                      <span>Week</span>
                  </ToggleButton>

              </StyledToggleButtonGroup>
          </Paper>
          </>
    );
}

BigCalenderEvents.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
    showDemoLink: PropTypes.bool,
};
