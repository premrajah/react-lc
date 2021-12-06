import React, {Component} from "react";

class ConditionsContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }


    render() {


        return (
            <div className={"mt-4"}>

                {this.props.item &&
                (this.props.item.campaign.all_of&&this.props.item.campaign.all_of.length>0) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-12"}>
                            <p

                                style={{ fontSize: "18px" }}
                                className=" text-bold text-blue mb-1">
                                All Of
                            </p>
                            <div className={"col-12 bg-white p-3 rad-8 gray-border"}>

                            {this.props.item.campaign.all_of.map((item,index)=>
                                <>
                                    {index>0&&(index+1)<=this.props.item.campaign.all_of.length&& <div className="listing-row-border "></div>}
                                <div

                                    className="row  mb-1">

                                   <div className={"col-4 "}>
                                       <span className={"text-gray-light text-blue text-capitlize"}>{item.predicate}</span>
                                   </div>
                                    <div className={"col-4"}>
                                        <span className={"text-gray-light text-capitlize"}>{item.operator}</span>
                                    </div>
                                    <div className={"col-4"}>
                                        <span className={"text-gray-light text-capitlize"}>{item.value}</span>
                                    </div>


                                </div>
                                </>

                            )}

                            </div>
                        </div>
                    </div>
                )}

                {(this.props.item.campaign.all_of&&this.props.item.campaign.any_of.length>0) && (
                <div className="row  justify-content-start search-container  pb-2">
                    <div className={"col-12"}>
                        <p
                            style={{ fontSize: "18px" }}
                            className=" text-bold text-blue mb-1">
                            Any Of
                        </p>
                        <div className={"col-12 bg-white p-3 rad-8 gray-border"}>

                            {this.props.item.campaign.any_of.map((item,index)=>
                                <>

                                    {index>0&&(index+1)<=this.props.item.campaign.any_of.length&& <div className="listing-row-border "></div>}
                                <div

                                    className="row  mb-1 mt-1">

                                    <div className={"col-4 "}>
                                        <span className={"text-gray-light text-blue text-capitlize"}>{item.predicate}</span>
                                    </div>
                                    <div className={"col-4"}>
                                        <span className={"text-gray-light text-capitlize"}>{item.operator}</span>
                                    </div>
                                    <div className={"col-4"}>
                                        <span className={"text-gray-light text-capitlize"}>{item.value}</span>
                                    </div>


                                </div>

                                </>


                            )}

                        </div>
                    </div>
                </div>
                )}

            </div>
        );
    }
}



export default (ConditionsContent);
