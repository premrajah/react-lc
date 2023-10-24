import React from "react";
import { capitalizeFirstLetter } from "../../Util/Constants";
import { capitalize } from "../../Util/GlobalFunctions";
import InfoTabContentItem from '../Products/InfoTabContentItem';


const InfoTabContentProductKind = ({ item }) => {

    const { artifacts, product_kind, site } = item;

    const calculateTotalCarbon = (responseItem) => {
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

    return (
        <div className={"bg-white rad-8 mt-4 p-3"}>
            <div className="row  justify-content-start search-container no-gutters  pb-2">
                <InfoTabContentItem
                    title="Category"
                    category
                    categoryTitle={product_kind?.category}
                    categoryType={capitalize(product_kind?.type)}
                    categoryState={capitalize(product_kind?.state)}
                />
            </div>

            {product_kind?.purpose && product_kind?.purpose === "aggregate" && product_kind?.units && <InfoTabContentItem simple title="Units" value={product_kind?.units} />}

            {product_kind?.purpose && product_kind?.purpose !== "aggregate" && product_kind?.units && <InfoTabContentItem simple title="Units" unitVolume={product_kind?.volume} value={product_kind?.units} />}

            {(item && product_kind?.condition) && <InfoTabContentItem simple title="Condition" value={capitalizeFirstLetter(product_kind?.condition)} />}

            {item &&
                (product_kind?.year_of_making || product_kind?.year_of_making > 0) && (
                    <InfoTabContentItem simple title="Year Of Manufacturer" value={product_kind?.year_of_making} />
                )}

            {item &&
                product_kind?.external_reference && (
                    <InfoTabContentItem simple title="External Reference" value={item && product_kind?.external_reference} />
                )}

            {item &&
                product_kind?.sku.model && (
                    <InfoTabContentItem simple title="Model Number" value={item && product_kind?.sku.model} />
                )}

            {item &&
                product_kind?.sku.serial && (
                    <InfoTabContentItem simple title="Serial Number" value={item && product_kind?.sku.serial} />
                )}

            {item &&
                product_kind?.sku.brand && (
                    <InfoTabContentItem simple simpleValueClass="sub-title-text-pink" title="Brand" value={item && product_kind?.sku.brand} />
                )}

            {item &&
                product_kind?.sku.part_no && (
                    <InfoTabContentItem simple title="Part No." value={item && product_kind?.sku.part_no} />
                )}

            {item &&
                product_kind?.sku.power_supply && (
                    <InfoTabContentItem simple title="Power Supply" value={item && capitalizeFirstLetter(product_kind?.sku.power_supply)} />
                )}

            {(item && product_kind?.sku &&
                product_kind?.sku.gross_weight_kgs && product_kind?.sku.gross_weight_kgs > 0) ? (
                <InfoTabContentItem simple title="Gross Weight (Kg)" value={item && product_kind?.sku.gross_weight_kgs} />
            ) : <></>}

            {(item && product_kind?.sku &&
                product_kind?.sku.embodied_carbon_kgs && product_kind?.sku.embodied_carbon_kgs > 0) ? (
                <InfoTabContentItem
                    embodiedCarbon title={<>Embodied Carbon (kgCO<sub>2</sub>e)</>}
                    value={
                        item &&
                        product_kind?.sku &&
                        product_kind?.sku.embodied_carbon_kgs > 0 &&
                        product_kind?.sku.embodied_carbon_kgs.toFixed(2)
                    }


                    popoverHeading={` Emissions: ${product_kind?.sku.embodied_carbon_kgs.toFixed(2)} kgCO<sub>2</sub>e`}
                    popoverText={<>

                        <div className="row  mt-2">
                            <div className="col-12 text-left">

                                <table className="table table-striped text-12">
                                    <tbody>
                                        {Object.keys(product_kind?.computed_carbon || {}).map((item, i) =>
                                            <React.Fragment key={i}>
                                                {product_kind?.computed_carbon[item] ? <tr>
                                                    <td className="text-blue text-capitlize">{item.replaceAll("_", " ")}</td>
                                                    <td>{product_kind?.computed_carbon[item]} </td>

                                                </tr> : ""}

                                            </React.Fragment>
                                        )}

                                        {Object.keys(product_kind?.computed_carbon || {}).length > 0 &&
                                            <tr>
                                                <td className={"text-label"}>Total</td>
                                                <td>{calculateTotalCarbon(product_kind?.computed_carbon)}</td>

                                            </tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </>}
                />
            ) : <></>}

        </div>
    );

};



export default (InfoTabContentProductKind);
