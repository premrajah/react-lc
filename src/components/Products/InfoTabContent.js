import React, { Component } from "react";
import { capitalizeFirstLetter } from "../../Util/Constants";
import { capitalize } from "../../Util/GlobalFunctions";
import InfoTabContentItem from './InfoTabContentItem';
import DownloadIcon from "@mui/icons-material/GetApp";
import CopyContentButton from "../Utils/CopyContentButton";

class InfoTabContent extends Component {

    calculateTotalCarbon = (responseItem) => {
        const valuesToArray = Object.entries(responseItem)
        const flatArray = valuesToArray.flat();

        let sum = flatArray.reduce((sumSoFar, nextValue) => {
            if (typeof nextValue === "number" && isFinite(nextValue)) {
                return sumSoFar + nextValue;
            }

            return sumSoFar
        }, 0)

        return sum.toString();
    }

    render() {
        return (
            <div className={"bg-white rad-8 mt-4 p-3"}>
                <div className="row  justify-content-start search-container no-gutters  pb-2">
                    <InfoTabContentItem
                        title="Category"
                        category
                        categoryTitle={this.props.item.product.category}
                        categoryType={capitalize(this.props.item.product.type)}
                        categoryState={capitalize(this.props.item.product.state)}
                    />
                </div>
                {this.props.item &&
                    this.props.item.product.sku.tags && (
                        <InfoTabContentItem simple title={Object.keys(this.props.item.product.sku.tags)[0]} value={Object.values(this.props.item.product.sku.tags)[0]} />
                    )}
                {this.props.item.product.purpose === "aggregate" && this.props.item.product.units && <InfoTabContentItem simple title="Units" value={this.props.item.product.units} />}

                {this.props.item.product.purpose !== "aggregate" && this.props.item.product.units && <InfoTabContentItem simple title="Units" unitVolume={this.props.item.product.volume} value={this.props.item.product.units} />}

                {(this.props.item && this.props.item.product.condition) && <InfoTabContentItem simple title="Condition" value={capitalizeFirstLetter(this.props.item.product.condition)} />}

                {this.props.item &&
                    (this.props.item.product.year_of_making || this.props.item.product.year_of_making > 0) && (
                        <InfoTabContentItem simple title="Year Of Manufacturer" value={this.props.item.product.year_of_making} />
                    )}

                {this.props.item &&
                    this.props.item.product.external_reference && (
                        <InfoTabContentItem simple title="External Reference" value={this.props.item && this.props.item.product.external_reference} />
                    )}

                {this.props.item &&
                    this.props.item.product.sku.model && (
                        <InfoTabContentItem simple title="Model Number" value={this.props.item && this.props.item.product.sku.model} />
                    )}

                {this.props.item &&
                    this.props.item.product.sku.serial && (
                        <InfoTabContentItem simple title="Serial Number" value={this.props.item && this.props.item.product.sku.serial} />
                    )}

                {this.props.item &&
                    this.props.item.product.sku.brand && (
                        <InfoTabContentItem simple simpleValueClass="sub-title-text-pink" title="Brand" value={this.props.item && this.props.item.product.sku.brand} />
                    )}

                {this.props.item &&
                    this.props.item.product.sku.part_no && (
                        <InfoTabContentItem simple title="Part No." value={this.props.item && this.props.item.product.sku.part_no} />
                    )}

                {this.props.item &&
                    this.props.item.product.sku.power_supply && (
                        <InfoTabContentItem simple title="Power Supply" value={this.props.item && capitalizeFirstLetter(this.props.item.product.sku.power_supply)} />
                    )}

                {(this.props.item && this.props.item.product.sku &&
                    this.props.item.product.sku.gross_weight_kgs && this.props.item.product.sku.gross_weight_kgs > 0) ? (
                    <InfoTabContentItem simple title="Gross Weight (Kg)" value={this.props.item && this.props.item.product.sku.gross_weight_kgs} />
                ) : <></>}

                {(this.props.item && this.props.item.product.sku &&
                    this.props.item.product.sku.embodied_carbon_kgs && this.props.item.product.sku.embodied_carbon_kgs > 0) ? (
                    <InfoTabContentItem
                        embodiedCarbon title={<>Embodied Carbon (kgCO<sub>2</sub>e)</>}
                        value={
                            this.props.item &&
                            this.props.item.product.sku &&
                            this.props.item.product.sku.embodied_carbon_kgs > 0 &&
                            this.props.item.product.sku.embodied_carbon_kgs.toFixed(2)
                        }


                        popoverHeading={` Emissions: ${this.props.item.product.sku.embodied_carbon_kgs.toFixed(2)} kgCO<sub>2</sub>e`}
                        popoverText={<>

                            <div className="row  mt-2">
                                <div className="col-12 text-left">

                                    <table className="table table-striped text-12">
                                        <tbody>
                                            {Object.keys(this.props.item.product?.computed_carbon || {}).map((item, i) =>
                                                <React.Fragment key={i}>
                                                    {this.props.item.product.computed_carbon[item] ? <tr>
                                                        <td className="text-blue text-capitlize">{item.replaceAll("_", " ").replaceAll("A12", "A1, A2")}</td>
                                                        <td>{this.props.item.product.computed_carbon[item]} </td>
                                                    </tr> : ""}
                                                </React.Fragment>
                                            )}

                                            {Object.keys(this.props.item.product.computed_carbon || {}).length > 0 &&
                                                <tr>
                                                    <td className={"text-label"}>Total</td>
                                                    <td>{this.calculateTotalCarbon(this.props.item.product.computed_carbon)}</td>

                                                </tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/*{(this.props.item.product.computed_carbon.A123_compositional_carbon*/}
                            {/*    && (this.props.item.product.computed_carbon.A123_compositional_carbon !== 0)) ? <span> {`Compositional Carbon : ${this.props.item.product.computed_carbon.A123_compositional_carbon.toLocaleString(undefined, { maximumFractionDigits: 2 })} kgs`}</span> : ""}*/}

                            {/*{(this.props.item.product.computed_carbon.A5_process_carbon_kgs && (this.props.item.product.computed_carbon.A5_process_carbon_kgs !== 0)) ? <span><br></br>{`Process Carbon : ${this.props.item.product.computed_carbon.A5_process_carbon_kgs.toLocaleString(undefined, { maximumFractionDigits: 2 })} kgs`}</span> : ""}*/}

                            {/*{(this.props.item.product.computed_carbon.A4_outbound_carbon_kgs && (this.props.item.product.computed_carbon.A4_outbound_carbon_kgs !== "0")) ? <span><br></br>{`Outbound Carbon : ${this.props.item.product.computed_carbon.A4_outbound_carbon_kgs.toLocaleString(undefined, { maximumFractionDigits: 2 })} kgs`}</span> : ""}*/}
                            {/*{(this.props.item.product.computed_carbon.C2_transport_carbon_kgs &&*/}
                            {/*    (this.props.item.product.computed_carbon.C2_transport_carbon_kgs !== 0)) ?*/}
                            {/*    <span><br></br>{`Transport Carbon : ${this.props.item.product.computed_carbon.C2_transport_carbon_kgs.toLocaleString(undefined, { maximumFractionDigits: 2 })} kgs`}</span> : ""}*/}

                        </>}
                    />
                ) : <></>}
                {(this.props?.item?.total_logistic_carbon?.carbon?.carbon_kgs.toFixed(2)) ? (
                    <InfoTabContentItem simple title={<>Transport Emissions (kgCO<sub>2</sub>e)</>} value={(this.props?.item && this.props?.item?.total_logistic_carbon?.carbon) &&
                        this.props?.item?.total_logistic_carbon?.carbon?.carbon_kgs.toLocaleString(undefined, { maximumFractionDigits: 2 })} />
                ) : <></>}

                {this.props.item.site && <InfoTabContentItem title="Located At" address addressName={this.props.item.site.name} addressValue={this.props.item.site.address} />}

                {this.props.item.service_agent && <InfoTabContentItem title="Service Agent" serviceAgent value={this.props.item.service_agent} />}

            </div>
        );
    }
}



export default (InfoTabContent);
