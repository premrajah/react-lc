import React, { useEffect, useState } from "react";
import axios from "axios/index";
import { baseUrl } from "../../Util/Constants";
import { Accordion, AccordionDetails, AccordionSummary, Paper, Tabs } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Tab from "@mui/material/Tab";
import { TabPanel } from "@mui/lab";

const OCVCDisplay = ({ productId }) => {
    const [productOCVC, setProductOCVC] = useState(null);

    useEffect(() => {
        getProduct_OCVC();
    }, [setProductOCVC]);

    const getProduct_OCVC = () => {
        axios
            .get(`${baseUrl}product/${productId}/oc-vc`)
            .then((res) => {
                const data = res.data.data;
                setProductOCVC(data);
            })
            .catch((e) => {
                console.log("product oc-vc error ", e);
            });
    };

    const productOCVCRender = (context) => {
        if (!context) return;
        return (
            <div className="row mb-3">
                <div className="col-md-6">
                    {Object.entries(context).map(([key, value]) => (
                        <div key={key} className="ps-5">
                            <span style={{ textTransform: "capitalize" }}>{key}</span>
                            <span
                                style={{
                                    textTransform: "uppercase",
                                    color: value ? "green" : "red",
                                }}>{`${value}`}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            {productOCVC ? (
                <div
                    className="position-absolute"
                    style={{ top: "0px", left: "10%", width: "70%", height: "80%" }}>
                    <Paper
                        elevation={1}
                        className="h-100"
                        style={{ overflow: "scroll", msOverflow: "scroll" }}>
                        <div className="text-blue ps-3">Ownership Context - <small>{productOCVC.id}</small></div>
                        {productOCVCRender(productOCVC.ownership_context)}
                        <div className="text-blue ps-3">Visibility Context</div>
                        {productOCVCRender(productOCVC.visibility_context)}
                    </Paper>
                </div>
            ) : (
                <Paper className="h-100">Loading product data ...</Paper>
            )}
        </>
    );
};

export default OCVCDisplay;
