import React from "react";

const PageHeader = ({ pageIcon, pageTitle, subTitle, bottomLine }) => {
    return (
        <>
            {/*<div className="row mt-3">*/}
            {/*    <div className="col-12">*/}
            {/*        <div className="mb-3">{pageIcon ? <Image style={{width: '48px', height: '48px'}} src={pageIcon} alt="" /> : <Pages style={{fontSize: '48px'}} className="blue-text" />}</div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="row">
                <div className="col-12">
                    <h3 className="blue-text text-heading">{pageTitle ? pageTitle : ""}</h3>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-12">
                    <p className="text-gray-light">{subTitle ? subTitle : ""}</p>
                </div>
            </div>

            {bottomLine ? bottomLine : ""}
        </>
    );
};

export default PageHeader;
