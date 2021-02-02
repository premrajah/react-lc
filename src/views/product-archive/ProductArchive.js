import React, { Component } from "react";
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";
import ArchiveIcon from '../../img/icons/archive-128px.svg'


class ProductArchive extends Component {

    state = {
        allProducts: []
    }

    getAllPreviouslyOwnedProducts = () => {

    }

    render() {

        return (
            <div>
                <Sidebar />
                <div className="wrapper ">
                    <HeaderDark />
                    <div className="container   pb-4 pt-4">
                        <PageHeader pageIcon={ArchiveIcon} pageTitle="Product Archive" subTitle="Your previously owned products" />

                        <div className="row">
                            <div className="col-12">
                                COntent
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductArchive;
