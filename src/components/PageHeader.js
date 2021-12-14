import React from "react";

const PageHeader = ({ pageIcon, pageTitle, subTitle, bottomLine }) => {
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <h4 className="blue-text text-heading">{pageTitle ? pageTitle : ""}</h4>
                </div>
            </div>

            <div className="row mb-2">
                <div className="col-12">
                    <p className="text-gray-light">{subTitle ? subTitle : ""}</p>
                </div>
            </div>

            {bottomLine ? bottomLine : ""}
        </>
    );
};

export default PageHeader;
