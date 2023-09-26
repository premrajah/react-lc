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
            <div className={"bg-white mt-4 rad-8 p-2 gray-border"}>

                {this.props.item &&
                (this.props.item.collection.stage) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className=" text-bold text-blue mb-1">
                                Stage
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-gray-light  mb-1">
                                {
                                    this.props.item.collection.stage
                                }
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.collection._ts_epoch_ms) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className=" text-bold text-blue mb-1">
                                Created On
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-gray-light  mb-1">

                                {moment(this.props.item.collection._ts_epoch_ms).format("DD MMM YYYY")}

                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.collection.start_ts) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className=" text-bold text-blue mb-1">
                                Start Date
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-gray-light  mb-1">
                                {moment(this.props.item.collection.start_ts).format("DD MMM YYYY")}


                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.collection.end_ts) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className=" text-bold text-blue mb-1">
                                End Date
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className=" text-gray-light mb-1">
                                {moment(this.props.item.collection.end_ts).format("DD MMM YYYY")}
                            </p>
                        </div>
                    </div>
                )}


            </div>
        );
    }
}



export default (InfoTabContent);
