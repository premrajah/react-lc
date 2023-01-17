import React, {useState} from "react";
import { Avatar } from "@mui/material";
import { capitalize } from "../../Util/GlobalFunctions";
import {baseUrl} from "../../Util/Constants";
import VisibilityIcon from '@mui/icons-material/Visibility';
import moment from "moment/moment";

const ProductsCondensedView = ({ product, index, site }) => {


    console.log(">>>", product);
    return (
        <div className="row bg-white rad-4 p-1 mb-1">
            <div className="col-md-1">img</div>

            <div className="col-md-3 d-flex justify-content-start align-items-center">
                <div className="text-truncate">{product.name}</div>
            </div>

            <div className="col-md-5 d-flex justify-content-start align-items-center">
                <div>
                    <span className="text-capitlize">
                    <small>{capitalize(product.category)}</small>
                </span>
                    <span className={"m-1 arrow-cat"}>&#10095;</span>
                    <span className=" text-capitlize">
                    <small>{capitalize(product.type)}</small>
                </span>
                    <span className={"m-1 arrow-cat"}>&#10095;</span>
                    <span className="  text-capitlize">
                    <small className="text-truncate">{capitalize(product.state)}</small>
                </span>
                </div>
            </div>

            <div className="col-md-2 d-flex justify-content-end align-items-center">
                <VisibilityIcon fontSize="small" />
            </div>

            <div className="col-md-1 d-flex justify-content-end align-items-center">
                <div><small><small className="text-gray-light">{moment(product._ts_epoch_ms).format("DD MMM YYYY")}</small></small></div>
            </div>



        </div>
    );
};

export default ProductsCondensedView;
