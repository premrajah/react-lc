import React, {Component} from "react";
import {capitalizeFirstLetter} from "../../Util/Constants";
import Org from "../Org/Org";
import {capitalize} from "../../Util/GlobalFunctions";

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
                (this.props.item.external_reference) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Site ID
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {
                                    this.props.item.external_reference
                                }
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.email) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Email
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {
                                    this.props.item.email
                                }
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.phone) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Phone
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {
                                    this.props.item.phone
                                }
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                this.props.item.contact && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Contact
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item.contact}
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                this.props.item.address && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Address
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item.address}
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.others && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Other
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item.others}
                            </p>
                        </div>
                    </div>
                )}


            </>
        );
    }
}



export default (InfoTabContent);
