import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

class CustomPopover extends React.Component {


    orgPopover = (heading, text) => (

        <Popover id="">
            <div className={"p-2 text-sentence "}>

                {heading && <div
                    dangerouslySetInnerHTML={{ __html: heading }}
                    className={"title-bold"} style={{ textTransform: "capitalize" }} />}
                {text && (
                    <>
                        <span className={"text-gray-light  "}>

                            {text}
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
                trigger={["hover", "focus"]}
                placement={"bottom"}
                overlay={this.orgPopover(this.props.heading, this.props.text)}
            >
                <span>
                    {children}
                </span>

            </OverlayTrigger>
        );
    }
}


export default CustomPopover;
