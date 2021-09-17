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
                <div className="row  justify-content-start search-container  pb-2">
                    <div className={"col-auto"}>
                        <p
                            style={{ fontSize: "18px" }}
                            className="text-mute text-bold text-blue mb-1">
                            Category
                        </p>
                        <p
                            style={{ fontSize: "18px" }}
                            className=" text-caps mb-1">
                                                            <span className="mr-1">
                                                                {this.props.item.product.category},
                                                            </span>
                            <span className="mr-1">
                                                                {this.props.item.product.type},
                                                            </span>
                            <span className="text-caps mr-1">
                                                                {capitalize(this.props.item.product.state)}
                                                            </span>
                            {this.props.item.product.purpose!=="aggregate"&&  <span>
                                                                {this.props.item.product.volume} </span>}
                            {this.props.item.product.purpose!=="aggregate"&&  <span>
                                                                {this.props.item.product.units}
                                                            </span>}
                        </p>
                    </div>
                </div>

                {(this.props.item && this.props.item.product.purpose) && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p style={{fontSize: "18px"}} className="text-mute text-bold text-blue mb-1">Purpose</p>
                        <p style={{fontSize: "18px"}}>{capitalizeFirstLetter(this.props.item.product.purpose)}</p>
                    </div>
                </div> }

                {(this.props.item && this.props.item.product.condition) && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p style={{fontSize: "18px"}} className="text-mute text-bold text-blue mb-1">Condition</p>
                        <p style={{fontSize: "18px"}}>{capitalizeFirstLetter(this.props.item.product.condition)}</p>
                    </div>
                </div> }

                {this.props.item &&
                (this.props.item.product.year_of_making || this.props.item.product.year_of_making > 0) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Year Of Manufacturer
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {
                                    this.props.item.product
                                        .year_of_making
                                }
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.product.sku.model && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Model Number
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item &&
                                this.props.item.product.sku
                                    .model}
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.product.sku.serial && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Serial Number
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item &&
                                this.props.item.product.sku
                                    .serial}
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.product.sku.brand && (
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Brand
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item &&
                                this.props.item.product.sku
                                    .brand}
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.product.sku.sku && (
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Sku
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item &&
                                this.props.item.product.sku
                                    .sku}
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.product.sku.upc && (
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                UPC
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item &&
                                this.props.item.product.sku
                                    .upc}
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.product.sku.part_no && (
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-mute text-bold text-blue mb-1">
                                Part No.
                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="  mb-1">
                                {this.props.item &&
                                this.props.item.product.sku
                                    .part_no}
                            </p>
                        </div>
                    </div>
                )}

                <div className="row  justify-content-start search-container  pb-2 ">
                    <div className={"col-auto"}>
                        <p
                            style={{ fontSize: "18px" }}
                            className="text-mute text-bold text-blue mb-1">
                            Located At
                        </p>
                        <p
                            style={{ fontSize: "18px" }}
                            className="  mb-1">
                                                            <span className="mr-1">
                                                                {this.props.item.site.name},
                                                            </span>
                            <span>
                                                                {this.props.item.site.address}
                                                            </span>
                        </p>
                    </div>
                </div>
                <div className="row  justify-content-start search-container  pb-2 ">
                    <div className={"col-auto"}>
                        <p
                            style={{ fontSize: "18px" }}
                            className="text-mute text-bold text-blue mb-1">
                            Service Agent
                        </p>
                        <div
                            style={{ fontSize: "18px" }}
                            className="  mb-1">
                            <Org
                                orgId={
                                    this.props.item.service_agent
                                        ._id
                                }
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}



export default (InfoTabContent);
