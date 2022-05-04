import React, {Component} from "react";
import {capitalizeFirstLetter} from "../../Util/Constants";
import {capitalize} from "../../Util/GlobalFunctions";
import OrgComponent from "../Org/OrgComponent";
import KeywordChip from "./KeywordChip";

class InfoTabContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }


    render() {


        return (
            <div className={"bg-white rad-8 mt-4 p-3"}>

              <div className="row justify-content-start search-container  pb-2">
                    <div className="col-auto">
                        <p  className=" text-bold text-label text-blue mb-1">Stage</p>
                        <p > {capitalizeFirstLetter( this.props.item.issue.stage)}</p>
                    </div>
                </div>


                {/*{this.props.item &&*/}
                {/*this.props.item.product.sku.model && (*/}
                {/*    <div className="row  justify-content-start search-container  pb-2">*/}
                {/*        <div className={"col-auto"}>*/}
                {/*            <p*/}

                {/*                className="text-label  text-bold text-blue mb-1">*/}
                {/*                Model Number*/}
                {/*            </p>*/}
                {/*            <p*/}

                {/*                className="  mb-1">*/}
                {/*                {this.props.item &&*/}
                {/*                this.props.item.product.sku*/}
                {/*                    .model}*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
                <div className="row  no-gutters  ">
                    <div className="col-md-12">
                        <p

                            className=" text-label text-bold text-blue mb-1">
                            Keywords
                        </p>
                        {this.props.item&&this.props.item.issue.keywords&&this.props.item.issue.keywords.map((item)=>
                            <KeywordChip
                                disableClick
                                name={item}
                            />
                        )}
                    </div>
                </div>




                <div className="row  justify-content-start search-container  pb-2 ">
                    <div className={"col-auto"}>
                        <p

                            className=" text-label text-bold text-blue mb-1">
                            Service Agent
                        </p>
                        <div

                            className="  mb-1">
                            <OrgComponent
                                org={
                                    this.props.item.service_agent

                                }
                            />
                        </div>
                    </div>
                </div>




            </div>
        );
    }
}



export default (InfoTabContent);
