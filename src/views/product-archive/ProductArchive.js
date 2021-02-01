import React, { Component } from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";

class ProductArchive extends Component {
    render() {
        return (
            <div>
                <Sidebar />
                <div className="wrapper ">
                    <HeaderDark />
                    <div className="container   pb-4 pt-4">
                        test
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductArchive;
