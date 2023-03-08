import React from "react";
import DynamicInput from "./DynamicInput";
import BlueSmallBtn from "../../FormsUI/Buttons/BlueSmallBtn";
import AddIcon from "@mui/icons-material/Add";
import {validateFormatCreate, validateInputs, Validators} from "../../../Util/Validator";
import {LINK_EXISTING_FIELDS} from "../../../Util/Constants";

class DynamicForm extends React.Component {


    state = {
        fields: LINK_EXISTING_FIELDS


    };
    handleChange = e => {
        // if (
        //     ["name", "author", "type", "dateOfPublish", "price"].includes(
        //         e.target.name
        //     )
        // ) {
        //     let fieldDetails = [...this.state.fieldDetails];
        //     fieldDetails[e.target.dataset.id][e.target.name] = e.target.value;
        //
        //
        // } else {
        //     this.setState({ [e.target.name]: e.target.value });
        // }
    };
    addNewRow = e => {
        // this.setState(prevState => ({
        //     fieldDetails: [
        //         ...prevState.fieldDetails,
        //         {
        //             index: Math.random(),
        //             name: "",
        //             author: "",
        //             type: "",
        //             dateOfPublish: "",
        //             price: ""
        //         }
        //     ]
        // }));
    };

    handleValidation() {


        let fields = this.state.fields;


        let validations=[
            validateFormatCreate("name", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("author", [{check: Validators.required, message: 'Required'}],fields),


        ]




        let {formIsValid,errors}= validateInputs(validations)

        console.log(errors)
        this.setState({ errors: errors });
        return formIsValid;
    }


    handleSubmit=(event)=>{
        event.preventDefault();

        if (!this.handleValidation()){
            return
        }



        const form = event.currentTarget;


        const data = new FormData(event.target);
        console.log(data.get("name"))

        console.log(data)

        console.log(this.state.fieldDetails)

    }
    deteteRow = index => {
        // this.setState({
        //     fieldDetails: this.state.fieldDetails.filter(
        //         (s, sindex) => index !== sindex
        //     )
        // });
    };

    clickOnDelete(record) {
        // this.setState({
        //     fieldDetails: this.state.fieldDetails.filter(r => r !== record)
        // });
    }
    render() {
        let { fields } = this.state;
        return (
            <div className="content">
                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1" />
                        <div className="col-sm-10">
                            <h2 className="text-center"> Enter  Details</h2>
                            <div className="container">
                                <div className="row">
                                    <DynamicInput
                                        add={this.addNewRow}
                                        delete={this.clickOnDelete.bind(this)}
                                        fields={fields}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-1" />
                    </div>

                    <BlueSmallBtn
                        // onClick={this.addCount}
                        title={"Submit"}
                        type={"submit"}
                    >
                        <AddIcon/>
                    </BlueSmallBtn>

                </form>
            </div>
        );
    }
}
export default DynamicForm;
