import React, {Component} from "react";
import moment from "moment/moment";
import axios from "axios";
import {campaignStrategyUrl} from "../../Util/Api";
import {baseUrl} from "../../Util/Constants";

class StatisticsTab extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

        this.state = {
            strategyProducts:[],
            orgs:[]
        }

    }


componentDidMount() {
        this.callStrategy(this.props.item.campaign.any_of,this.props.item.campaign.all_of)
    this.orgViewed(this.props.item.campaign._key)

}

    callStrategy=(conditionAny,conditionAll)=>{


        let data={}
        data=
            {
                all_of:conditionAll,
                any_of:conditionAny,
            }


        axios
            .post(campaignStrategyUrl, data)
            .then(
                (response) => {
                    this.setState({
                        strategyProducts:response.data.data
                    })
                },
                (error) => {
                    // let status = error.response.status
                }
            )
            .catch(error => {});

    }


    orgViewed=(id)=>{




        axios
            .get(baseUrl+"campaign/"+id+"/org")
            .then(
                (response) => {
                    this.setState({
                        orgs:response.data.data
                    })
                },
                (error) => {
                    // let status = error.response.status
                }
            )
            .catch(error => {});

    }



    render() {


        return (
            <div className={"bg-white mt-4 rad-8 p-2 gray-border"}>


                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p
                                style={{ fontSize: "18px" }}
                                className=" text-bold text-blue mb-1">
                                Products Targeted

                            </p>
                            <p
                                style={{ fontSize: "18px" }}
                                className="text-gray-light  mb-1">
                                {this.state.strategyProducts.length}

                            </p>
                        </div>
                    </div>

                {/*<div className="row  justify-content-start search-container  pb-2">*/}
                {/*    <div className={"col-auto"}>*/}
                {/*        <p*/}
                {/*            style={{ fontSize: "18px" }}*/}
                {/*            className=" text-bold text-blue mb-1">*/}
                {/*            Organisations Viewed*/}
                {/*        </p>*/}
                {/*        <p*/}
                {/*            style={{ fontSize: "18px" }}*/}
                {/*            className="text-gray-light  mb-1">*/}

                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}


            </div>
        );
    }
}



export default (StatisticsTab);
