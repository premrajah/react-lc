import React, { Component } from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import {Pages} from "@material-ui/icons";

class ProductArchive extends Component {
    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper ">
                    <HeaderDark />
                    <div className="container   pb-4 pt-4">
                        <PageHeader pageTitle="Product Archive" pageSubHeading="" />
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductArchive;
