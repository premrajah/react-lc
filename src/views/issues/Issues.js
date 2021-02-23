import React from 'react'
import Sidebar from "../menu/Sidebar";
import HeaderDark from "../header/HeaderDark";
import PageHeader from "../../components/PageHeader";

const Issues = () => {
    return (
        <div>
            <Sidebar />
            <div className="wrapper">
                <HeaderDark />
                <div className="container  pb-4 pt-4">

                    <PageHeader pageTitle="Issues" subTitle="Issues related to products" />

                    <div className="row">
                        <div className="col">
                            Apologies, page under construction
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Issues;