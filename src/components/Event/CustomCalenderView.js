import React, {Component} from "react";
import "../../Util/upload-file.css";
import {createPlugin, sliceEvents} from "@fullcalendar/react";


class CustomCalenderView extends Component {

    render(props) {
        let segs = sliceEvents(props, true); // allDay=true

        return (
            <Fragment>
                <div class='view-title'>
                    {props.dateProfile.currentRange.start.toUTCString()}
                </div>
                <div class='view-events'>
                    {segs.length} events
                </div>
            </Fragment>
        );
    }

}
// export default createPlugin({
//     views: {
//         custom: CustomCalenderView
//     }
// });
