import React from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";

class CustomPopover extends React.Component {


    constructor({HtmlText,...props}) {
        super(props);
    }
    HtmlText

    componentDidMount() {
        this.HtmlText=this.props.HtmlText

    }

    orgPopover = (

        <Popover >
            <div className={"p-2 text-sentence "}>

                {this.props.heading &&  <div className={"title-bold"} style={{ textTransform: "capitalize" }}>{this.props.heading}</div>}
                {this.props.text && (
                    <>

                        <span className={"text-gray-light  "}>

                                {this.props.text}
                       </span>

                    </>
                )}

            </div>
        </Popover>
    );



    render() {
        const { children } = this.props
        return (
            <OverlayTrigger
                trigger={ ["hover", "focus"]}
                placement={"bottom"}
                overlay={this.orgPopover}
            >
                <span>
                {children}
                </span>

            </OverlayTrigger>
        );
    }
}


export default CustomPopover;
