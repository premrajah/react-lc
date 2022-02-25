import React, {Component} from "react";

class InfoTabContent extends Component {
    slug;
    search;

    constructor(props) {
        super(props);

    }


    render() {


        return (
            <div className={"bg-white p-3 mt-4 rad-8"}>

                {this.props.item &&
                (this.props.item.external_reference) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p

                                className=" text-label text-blue mb-1">
                                Reference ID
                            </p>
                            <p

                                className=" text-gray-light   mb-1">
                                {
                                    this.props.item.external_reference
                                }
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.email) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p

                                className=" text-label text-blue mb-1">
                                Email
                            </p>
                            <p

                                className=" text-gray-light   mb-1">
                                {
                                    this.props.item.email
                                }
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                (this.props.item.phone) && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p

                                className=" text-label text-blue mb-1">
                                Phone
                            </p>
                            <p

                                className="text-gray-light    mb-1">
                                {
                                    this.props.item.phone
                                }
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                this.props.item.contact && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p

                                className=" text-label text-blue mb-1">
                                Contact
                            </p>
                            <p

                                className="text-gray-light    mb-1">
                                {this.props.item.contact}
                            </p>
                        </div>
                    </div>
                )}
                {this.props.item &&
                this.props.item.address && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p

                                className=" text-label text-blue mb-1">
                                Address
                            </p>
                            <p

                                className=" text-gray-light   mb-1">
                                {this.props.item.address}
                            </p>
                        </div>
                    </div>
                )}

                {this.props.item &&
                this.props.item.others && (
                    <div className="row  justify-content-start search-container  pb-2">
                        <div className={"col-auto"}>
                            <p

                                className=" text-label text-blue mb-1">
                                Other
                            </p>
                            <p

                                className="text-gray-light    mb-1">
                                {this.props.item.others}
                            </p>
                        </div>
                    </div>
                )}


            </div>
        );
    }
}



export default (InfoTabContent);
