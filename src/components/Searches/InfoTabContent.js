import React, {Component} from "react";
import {capitalize} from "../../Util/GlobalFunctions";
import {capitalizeFirstLetter} from "../../Util/Constants";
import moment from "moment";

class InfoTabContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }


    render() {


        return (
            <div className={"bg-white p-3 mt-4 rad-8"}>

                {this.props.item && (
                    <div className="row justify-content-start pb-2 ">

                    <div className={"col-12"}>
                        <p
                            style={{ fontSize: "18px" }}
                            className=" text-bold text-blue mb-1">
                            Category
                        </p>
                        <span

                            className=" text-capitlize mb-1 cat-box text-left ">
                                                            <span className="">
                                                                {this.props.item.category}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                            <span className=" text-capitlize">
                                                                {capitalize(this.props.item.type)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                            <span className="  text-capitlize">
                                                                {capitalize(this.props.item.state)}
                                                            </span>



                        </span>
                    </div>
                    </div>
                )}

                {this.props.item.search_type &&    <div className="row justify-content-start search-container ">
                    <div className="col-auto">
                        <p  className=" text-bold text-label text-blue mb-1">Type</p>
                        <p className="text-gray-light mb text-capitlize" >{this.props.item.search_type} </p>
                    </div>
                </div>}

              <div className="row justify-content-start search-container ">
                    <div className="col-auto">
                        <p  className=" text-bold text-label text-blue mb-1">Amount</p>
                        <p className={"text-gray-light mb "} >{ this.props.item.volume} {capitalizeFirstLetter( this.props.item.units)}</p>
                    </div>
                </div>

                <div className="row justify-content-start search-container ">
                    <div className="col-auto">
                        <p  className=" text-bold text-label text-blue mb-1">Units</p>
                        <p className={"text-gray-light mb "} >{capitalizeFirstLetter( this.props.item.units)}</p>
                    </div>
                </div>

                <div className="row justify-content-start search-container ">
                    <div className="col-auto">
                        <p  className=" text-bold text-label text-blue mb-1">Required From</p>
                        <p className={"text-gray-light mb "}> {moment(
                            this.props.item.require_after_epoch_ms
                        ).format("DD MMM YYYY")}</p>
                    </div>
                </div>

                <div className="row justify-content-start search-container ">
                    <div className="col-auto">
                        <p  className=" text-bold text-label text-blue mb-1">Required By</p>
                        <p className={"text-gray-light mb "}>{moment(
                            this.props.item.expire_after_epoch_ms
                        ).format("DD MMM YYYY")}</p>
                    </div>
                </div>




            </div>
        );
    }
}



export default (InfoTabContent);
