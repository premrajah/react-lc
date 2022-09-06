import React, { Fragment, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Calendar, DateLocalizer, momentLocalizer, Views } from "react-big-calendar";
// import DemoLink from './DemoLink.component'
import * as dates from "./dates";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventItem from "./EventItem";
import { LoaderAnimated, weekday } from "../../Util/GlobalFunctions";
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
    const [showEventPopUp, setShowEventPopUp] = useState(false);
    const [showAddEventPopUp, setShowAddEventPopUp] = useState(false);
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
            <span
                onClick={() => {
                    setSelectedDate(event.start);
                    getEvents(
                        moment(event.start).startOf("day").format("x"),
                        moment(event.start).endOf("day").format("x")
                    );
                }}
                className="text-blue text-12">
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
            </span>
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
        // console.log(label, date)

        return (
            <>
                {/*{props.children}*/}

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

        let viewSelect = (view) => {
            props.onView(view);
        };

        return (
            <>
                <div className="rbc-toolbar">
                    <span>
                        <CustomizedDividers viewSelect={viewSelect} />
                    </span>

                    <span className="rbc-toolbar-label title-bold pl-2">{props.label}</span>
                    <span className="rbc-btn-group">
                        <ArrowBack
                            className="arrow-back cal-arrows"
                            onClick={() => {
                                // setMonthEvents([])
                                navigate("PREV");
                                setSelectedDate(moment(props.date).subtract(1, "M").toDate());
                                handleNaviation(moment(props.date).subtract(1, "M").toDate(), true);
                            }}
                        />

                        <button
                            className=""
                            type="button"
                            onClick={() => {
                                navigate("TODAY");
                                setSelectedDate(new Date());
                                handleNaviation(new Date());
                            }}>
                            today
                        </button>
                        <ArrowForward
                            className="arrow-forward  cal-arrows"
                            onClick={() => {
                                // setMonthEvents([])
                                navigate("NEXT");
                                setSelectedDate(moment(props.date).add(1, "M").toDate());

                                handleNaviation(moment(props.date).add(1, "M").toDate(), true);
                            }}
                        />
                    </span>
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
                toolbar: CustomToolbar,

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
                        moment(arg.start).startOf("day").format("x"),
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

    const handleNaviation = (arg, all) => {
        // bind with an arrow function

        console.log(arg);

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
                moment(arg).startOf("month").format("x"),
                moment(arg).startOf("month").add(1, "days").format("x")
            );

            // setSelectedDate(new Date(arg.getFullYear(), arg.getMonth(), 1, 0, 0, 0));
        }
    };

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
                                    showAddEvent();

                                    getEventsByMonth(
                                        moment(selectedDate).startOf("month").format("x"),
                                        moment(selectedDate).endOf("month").format("x")
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
                            <Calendar
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
                                // views={views}
                                views={{
                                    // day: true,
                                    week: true,
                                    month: true,
                                    year: Year,
                                }}
                                messages={{ year: "Year" }}
                                startAccessor="start"
                                endAccessor="end"
                                selectable
                                onSelectSlot={handleSelectSlot}
                                // onNavigate={handleNaviation}
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
                                    refresh={() => getEvents()}
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
                        show={showEventPopUp}
                        hide={() => {
                            showEvent();
                        }}>
                        <>
                            <Calendar
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
                                views={views}
                                startAccessor="start"
                                endAccessor="end"
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
                                <p className="">
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

function CustomizedDividers(props) {
    const [alignment, setAlignment] = React.useState("month");
    const [formats, setFormats] = React.useState(() => ["italic"]);

    const handleFormat = (event, newFormats) => {
        setFormats(newFormats);
    };

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
        props.viewSelect(newAlignment);
    };

    return (
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
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment">
                    <ToggleButton value="year" aria-label="left aligned">
                        <span>Year</span>
                    </ToggleButton>
                    <ToggleButton value="month" aria-label="centered">
                        <span>Month</span>
                    </ToggleButton>
                    <ToggleButton value="week" aria-label="right aligned">
                        <span>Week</span>
                    </ToggleButton>
                    {/*<ToggleButton value="agenda" aria-label="justified" >*/}
                    {/*    <span>Agenda</span>*/}
                    {/*</ToggleButton>*/}
                </StyledToggleButtonGroup>
            </Paper>
        </div>
    );
}

BigCalenderEvents.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
    showDemoLink: PropTypes.bool,
};
