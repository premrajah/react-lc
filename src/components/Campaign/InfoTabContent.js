import React, {Component} from "react";
import moment from "moment/moment";

class InfoTabContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }


    render() {


        return (
            <>

                {this.props.item &&
                (this.props.item.campaign.stage) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Stage
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {
                                    this.props.item.campaign.stage
                                }
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.campaign._ts_epoch_ms) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Created On
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">

                                {moment(this.props.item.campaign._ts_epoch_ms).format("DD MMM YYYY")}

                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.campaign.start_ts) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Start Date
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {moment(this.props.item.campaign.start_ts).format("DD MMM YYYY")}


                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.campaign.end_ts) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                End Date
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {moment(this.props.item.campaign.end_ts).format("DD MMM YYYY")}
                            </p>
                        </div>
                    </div>
                )}


            </>
        );
    }
}



export default (InfoTabContent);
