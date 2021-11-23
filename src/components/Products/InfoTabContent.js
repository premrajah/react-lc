import React, {Component} from "react";
import {capitalizeFirstLetter} from "../../Util/Constants";
import {capitalize} from "../../Util/GlobalFunctions";
import OrgComponent from "../Org/OrgComponent";

class InfoTabContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }


    render() {


        return (
            <>
                <div className="row  justify-content-start search-container no-gutters  pb-2">
                    <div className={"attribute-label col-12 text-blue mt-4 mb-4"}>
                        Product Info
                    </div>
                    <div className={"col-12"}>
                        <p
                            style={{ fontSize: "18px" }}
                            className=" text-bold text-blue mb-1">
                            Category
                        </p>
                        <span

                            className=" text-capitlize mb-1 cat-box text-left p-2">
                                                            <span className="">
                                                                {this.props.item.product.category}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                            <span className=" text-capitlize">
                                                                {capitalize(this.props.item.product.type)}
                                                            </span><span className={"m-1 arrow-cat"}>&#10095;</span>
                            <span className="  text-capitlize">
                                                                {capitalize(this.props.item.product.state)}
                                                            </span>



                        </span>
                    </div>
                </div>
                {this.props.item.product.purpose==="aggregate" && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p  className=" text-bold text-label text-blue mb-1">Units</p>
                        <p >{capitalizeFirstLetter( this.props.item.product.units)}</p>
                    </div>
                </div> }

                {this.props.item.product.purpose!=="aggregate" && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p  className=" text-bold text-label text-blue mb-1">Units</p>
                        <p >{this.props.item.product.volume} {capitalizeFirstLetter( this.props.item.product.units)}</p>
                    </div>
                </div> }
                {(this.props.item && this.props.item.product.purpose) && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p  className=" text-bold text-blue mb-1">Purpose</p>
                        <p >{capitalizeFirstLetter(this.props.item.product.purpose)}</p>
                    </div>
                </div> }

                {(this.props.item && this.props.item.product.condition) && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p  className=" text-bold text-label mb-1">Condition</p>
                        <p >{capitalizeFirstLetter(this.props.item.product.condition)}</p>
                    </div>
                </div> }

                {this.props.item &&
                (this.props.item.product.year_of_making || this.props.item.product.year_of_making > 0) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p

                                className=" text-bold text-blue text-label mb-1">
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

                                className="text-label  text-bold text-blue mb-1">
                                Model Number
                            </p>
                            <p

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

                                className=" text-label text-bold text-blue mb-1">
                                Serial Number
                            </p>
                            <p

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
                    <div className="row   justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p

                                className=" text-label text-bold text-blue mb-1">
                                Brand
                            </p>
                            <p

                                className="sub-title-text-pink  mb-1">
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

                                className=" text-label text-bold text-blue mb-1">
                                Sku
                            </p>
                            <p

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

                                className=" text-bold text-label text-blue mb-1">
                                UPC
                            </p>
                            <p

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

                                className=" text-bold text-blue mb-1 text-label">
                                Part No.
                            </p>
                            <p

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

                            className=" text-bold text-blue mb-1">
                            Located At
                        </p>
                        <p

                            className=" text-label mb-1">
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

                            className=" text-label text-bold text-blue mb-1">
                            Service Agent
                        </p>
                        <div

                            className="  mb-1">
                            <OrgComponent
                                org={
                                    this.props.item.service_agent

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
