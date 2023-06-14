import React, { Component } from "react";
import { capitalizeFirstLetter } from "../../Util/Constants";
import { capitalize } from "../../Util/GlobalFunctions";
import OrgComponent from "../Org/OrgComponent";
import CustomPopover from "../FormsUI/CustomPopover";
import {Info, InfoOutlined} from "@mui/icons-material";

class InfoTabContent extends Component {
    slug;
    search;

    render() {


        return (
            <div className={"bg-white rad-8 mt-4 p-3"}>
                <div className="row  justify-content-start search-container no-gutters  pb-2">

                    <div className={"col-12"}>
                        <p
                            className=" text-label text-blue mb-1">
                            Category
                        </p>
                        <span

                            className=" text-capitlize mb-1 cat-box text-left ">
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
                {this.props.item.product.purpose === "aggregate" && this.props.item.product.units && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p className=" text-label text-label text-blue mb-1">Units</p>
                        <p className="text-gray-light">{(this.props.item.product.units)}</p>
                    </div>
                </div>}

                {this.props.item.product.purpose !== "aggregate" && this.props.item.product.units && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p className=" text-label  text-blue mb-1">Units</p>
                        <p className="text-gray-light" >{this.props.item.product.volume} {(this.props.item.product.units)}</p>
                    </div>
                </div>}
                {/*{(this.props.item && this.props.item.product.purpose) && <div className="row justify-content-start search-container  pb-2">*/}
                {/*    <div className="col-auto">*/}
                {/*        <p  className=" text-label text-blue mb-1">Purpose</p>*/}
                {/*        <p className="text-gray-light">{capitalizeFirstLetter(this.props.item.product.purpose)}</p>*/}
                {/*    </div>*/}
                {/*</div> }*/}

                {(this.props.item && this.props.item.product.condition) && <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p className=" text-label text-label mb-1">Condition</p>
                        <p className="text-gray-light" >{capitalizeFirstLetter(this.props.item.product.condition)}</p>
                    </div>
                </div>}

                {this.props.item &&
                    (this.props.item.product.year_of_making || this.props.item.product.year_of_making > 0) && (
                        <div className="row  justify-content-start search-container  pb-2">
                            <div className={"col-auto"}>
                                <p

                                    className=" text-label text-blue text-label mb-1">
                                    Year Of Manufacturer
                                </p>
                                <p

                                    className="text-gray-light  mb-1">
                                    {
                                        this.props.item.product
                                            .year_of_making
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                {this.props.item &&
                    this.props.item.product.external_reference && (
                        <div className="row  justify-content-start search-container  pb-2">
                            <div className={"col-auto"}>
                                <p

                                    className="text-label  text-label text-blue mb-1">
                                    External Reference
                                </p>
                                <p

                                    className=" text-gray-light mb-1">
                                    {this.props.item &&
                                        this.props.item.product
                                            .external_reference}
                                </p>
                            </div>
                        </div>
                    )}

                {this.props.item &&
                    this.props.item.product.sku.model && (
                        <div className="row  justify-content-start search-container  pb-2">
                            <div className={"col-auto"}>
                                <p

                                    className="text-label  text-label text-blue mb-1">
                                    Model Number
                                </p>
                                <p

                                    className=" text-gray-light mb-1">
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

                                    className=" text-label text-label text-blue mb-1">
                                    Serial Number
                                </p>
                                <p

                                    className=" text-gray-light mb-1">
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

                                    className=" text-label  text-label text-blue mb-1">
                                    Brand
                                </p>
                                <p

                                    className="sub-title-text-pink text-capitlize mb-1">
                                    {this.props.item &&
                                        this.props.item.product.sku
                                            .brand}
                                </p>
                            </div>
                        </div>
                    )}

                {/*{this.props.item &&*/}
                {/*this.props.item.product.sku.sku && (*/}
                {/*    <div className="row  justify-content-start search-container  pb-2 ">*/}
                {/*        <div className={"col-auto"}>*/}
                {/*            <p*/}

                {/*                className=" text-label text-label text-blue mb-1">*/}
                {/*                Sku*/}
                {/*            </p>*/}
                {/*            <p*/}

                {/*                className="text-gray-light  mb-1">*/}
                {/*                {this.props.item &&*/}
                {/*                this.props.item.product.sku*/}
                {/*                    .sku}*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}

                {/*{this.props.item &&*/}
                {/*this.props.item.product.sku.upc && (*/}
                {/*    <div className="row  justify-content-start search-container  pb-2 ">*/}
                {/*        <div className={"col-auto"}>*/}
                {/*            <p*/}

                {/*                className=" text-label text-label text-blue mb-1">*/}
                {/*                UPC*/}
                {/*            </p>*/}
                {/*            <p*/}

                {/*                className="text-gray-light  mb-1">*/}
                {/*                {this.props.item &&*/}
                {/*                this.props.item.product.sku*/}
                {/*                    .upc}*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}

                {this.props.item &&
                    this.props.item.product.sku.part_no && (
                        <div className="row  justify-content-start search-container  pb-2 ">
                            <div className={"col-auto"}>
                                <p

                                    className=" text-label text-blue mb-1 text-label">
                                    Part No.
                                </p>
                                <p

                                    className=" text-gray-light mb-1">
                                    {this.props.item &&
                                        this.props.item.product.sku
                                            .part_no}
                                </p>
                            </div>
                        </div>
                    )}

                {this.props.item &&
                    this.props.item.product.sku.power_supply && (
                        <div className="row  justify-content-start search-container  pb-2 ">
                            <div className={"col-auto"}>
                                <p

                                    className=" text-label text-blue mb-1 text-label">
                                    Power Supply
                                </p>
                                <p

                                    className=" text-gray-light mb-1 text-capitalize">
                                    {this.props.item &&
                                        this.props.item.product.sku
                                            .power_supply}
                                </p>
                            </div>
                        </div>
                    )}

                {(this.props.item && this.props.item.product.sku &&
                    this.props.item.product.sku.gross_weight_kgs && this.props.item.product.sku.gross_weight_kgs > 0) ? (
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p
                                className=" text-label text-blue mb-1 text-label">
                                Gross Weight (Kg)
                            </p>
                            <p

                                className=" text-gray-light mb-1 text-capitalize">
                                {this.props.item &&
                                    this.props.item.product.sku
                                        .gross_weight_kgs}
                            </p>
                        </div>
                    </div>
                ) : <></>}
                {(this.props.item && this.props.item.product.sku &&
                    this.props.item.product.sku.embodied_carbon_kgs && this.props.item.product.sku.embodied_carbon_kgs > 0) ? (
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p className=" text-label text-blue mb-1 text-label">
                                Embodied Carbon (kgCO<sub>2</sub>e)

                            </p>
                            <p className=" text-gray-light mb-1 text-capitalize">
                                {this.props.item && this.props.item.product.sku && this.props.item.product.sku.embodied_carbon_kgs > 0 &&
                                    this.props.item.product.sku.embodied_carbon_kgs}

                                <CustomPopover
                                    heading={` Emissions: ${this.props.item.product.sku.embodied_carbon_kgs} kgCO<sub>2</sub>e`}

                                    text={<>
                                        {this.props.item.product.computed_carbon.A123_compositional_carbon&&<span> {`Compositional Carbon : ${this.props.item.product.computed_carbon.A123_compositional_carbon.toLocaleString(undefined, {maximumFractionDigits: 2})} kgs`}</span>}
                                        {this.props.item.product.computed_carbon.A5_process_carbon_kgs&&<span><br></br>{`Process Carbon : ${this.props.item.product.computed_carbon.A5_process_carbon_kgs.toLocaleString(undefined, {maximumFractionDigits: 2})} kgs`}</span>}
                                        {this.props.item.product.computed_carbon.A4_outbound_carbon_kgs&&<span><br></br>{`Outbound Carbon : ${this.props.item.product.computed_carbon.A4_outbound_carbon_kgs.toLocaleString(undefined, {maximumFractionDigits: 2})} kgs`}</span>}
                                        {this.props.item.product.computed_carbon.C2_transport_carbon_kgs && <span><br></br>{`Transport Carbon : ${this.props.item.product.computed_carbon.C2_transport_carbon_kgs.toLocaleString(undefined, {maximumFractionDigits: 2})} kgs`}</span>}

                                    </>}

                                > <Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"small"} />
                                </CustomPopover>
                            </p>
                        </div>
                    </div>
                ) : <></>}
                {(this.props?.item?.total_logistic_carbon?.carbon?.carbon_kgs) ? (
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p className=" text-label text-blue mb-1 text-label">
                                Transport Emissions (kgCO<sub>2</sub>e)
                            </p>
                            <p
                                className=" text-gray-light mb-1 text-capitalize">
                                {(this.props?.item && this.props?.item?.total_logistic_carbon?.carbon) &&
                                this.props?.item?.total_logistic_carbon?.carbon?.carbon_kgs.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                ) : <></>}

                {this.props.item.site &&
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p

                                className=" text-label text-blue mb-1">
                                Located At
                            </p>
                            <p

                                className=" text-gray-light mb-1">
                                <span className="me-1">
                                    {this.props.item.site.name},
                                </span>
                                <span>
                                    {this.props.item.site.address}
                                </span>
                            </p>
                        </div>
                    </div>}
                {this.props.item.service_agent &&
                    <div className="row  justify-content-start search-container  pb-2 ">
                        <div className={"col-auto"}>
                            <p

                                className=" text-label text-label text-blue mb-1">
                                Service Agent
                            </p>
                            <div

                                className="  mb-1">
                                <OrgComponent
                                    org={this.props.item.service_agent}
                                />
                            </div>
                        </div>
                    </div>}
            </div>
        );
    }
}



export default (InfoTabContent);
