import React from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";

class CustomPopover extends React.Component {


    constructor(props) {
        super(props);

        this.state = {

            heading: null,
            text:null
        }
    }
    // HtmlText


    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!==this.props) {

            if (this.props.heading){
                this.setState({
                    heading:this.props.heading
                })
            }
            if (this.props.text){
                this.setState({
                    text:this.props.text
                })
            }
        }
    }
    componentDidMount() {
        // this.HtmlText=this.props.HtmlText

        if (this.props.heading){
           this.setState({
               heading:this.props.heading
           })
        }
        if (this.props.text){
            this.setState({
                text:this.props.text
            })
        }
    }

    orgPopover = (

        <Popover id="">
            <div className={"p-2 text-sentence "}>

                {this.state.heading &&  <div
                    dangerouslySetInnerHTML={{__html:this.state.heading}}
                    className={"title-bold"} style={{ textTransform: "capitalize" }} />}
                {this.state.text && (
                    <>

                        <span className={"text-gray-light  "}>

                                {this.state.text}
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
