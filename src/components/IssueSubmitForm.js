import React, {Component} from "react";
import axios from "axios/index";
import {baseUrl, ISSUES_PRIORITY} from "../Util/Constants";
import {connect} from "react-redux";
import * as Yup from 'yup';
import TextFieldWrapper from "./FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "./FormsUI/ProductForm/Select";
import {validateFormatCreate, validateInputs, Validators} from "../Util/Validator";
import * as actionCreator from "../store/actions/actions";
import KeywordChip from "./issues/KeywordChip";
import GreenButton from "./FormsUI/Buttons/GreenButton";

class IssueSubmitForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            status: "",
            fields: {},
            errors: {},
            keywords: [],
            keywordSelected: []
        }
    }


    INITIAL_VALUES = {
        title: this.props.edit ? this.props.issue.title : "",
        description: this.props.edit ? this.props.issue.description : "",
        priority:this.props.edit ? this.props.issue.priority : ISSUES_PRIORITY[0]
    }

    VALIDATION_SCHEMA = Yup.object().shape({
        title: Yup.string().required("Required")
    })

timeout=0
    addToKeywords=(keyword,add)=>{

        let keywords=[]

        if (this.timeout) clearTimeout(this.timeout);


        keywords=this.state.keywordSelected?this.state.keywordSelected:[]



        if (add) {

            if (keywords.length===0||!keywords.find((item)=>item===keyword))
             keywords.push(keyword)

        }else {
            if (keywords.length>0) {
                keywords = keywords.filter((item) => keyword !== item)
            }
        }


        this.setState({
            keywordSelected: keywords
        })

    }

    fetchKeywords=()=> {
        axios
            .get(baseUrl + "issue/no-auth/keywords")
            .then(
                (response) => {

                    this.setState({
                        keywords: response.data.data,

                    });

                    if (this.props.issue&&this.props.issue.keywords){

                        this.setState({
                            keywordSelected:this.props.issue.keywords
                        })


                    }

                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }


    handleValidation=() =>{


        let fields = this.state.fields;


        let validations=[
            validateFormatCreate("title", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("priority", [{check: Validators.required, message: 'Required'}],fields),
            validateFormatCreate("description", [{check: Validators.required, message: 'Required'}],fields),


        ]


        let {formIsValid,errors}= validateInputs(validations)

        this.setState({ errors: errors });
        return formIsValid;
    }


    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation()
        if (!this.handleValidation()){
            return
        }
        const form = event.currentTarget;

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);


            const title = data.get("title");
            const priority = data.get("priority");
            const description = data.get("description");


            if (this.props.issue){
                this.postEditIssue({
                    id:this.props.issue._key,
                    update:{
                        priority: priority.toLowerCase(),
                        title: title,
                        description: description,
                        keywords : this.state.keywordSelected

                    }
                })
            }else {
                this.postCreateIssue({
                 issue: {
                     priority: priority.toLowerCase(),
                     title: title,
                     description: description,
                     product_id: this.props.productId,
                     keywords : this.state.keywordSelected
                 }

                });
            }

    };

    postCreateIssue = (payload) => {


        axios
            .post(`${baseUrl}issue`, payload)
            .then((response) => {
                if (response.status === 200) {
                    // this.setState({
                    //     status: <p className="text-success">Successfully submitted data</p>,
                    // });

                    this.props.onSubmitted();
                    this.props.showSnackbar({show:true,severity:"success",message:"Issue submitted successfully. Thanks"})
                }
            })
            .catch((error) => {
                this.setState({
                    status: <p className="text-warning">Unable to submit at this time. {error.message && error.message}</p>,
                });
            });
    }

    postEditIssue = (payload) => {
        axios
            .post(`${baseUrl}issue/update`, payload)
            .then((response) => {
                if (response.status === 200) {
                    // this.setState({
                    //     status: <p className="text-success">Successfully updated data</p>,
                    // });
                    this.props.onSubmitted();

                    this.props.showSnackbar({show:true,severity:"success",message:"Issue updated successfully. Thanks"})

                }
            })
            .catch((error) => {
                this.setState({
                    status: <p className="text-warning">Unable to submit at this time. {error.message && error.message}</p>,
                });
            });
    }

    handleChange(value,field ) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({ fields });

    }

    componentDidMount() {
    this.fetchKeywords()

    }

    render() {
        return (
            <div className="row p-3">
                {/*<div className="col-12  "><h4 className="blue-text text-heading">*/}
                {/*    {this.props.issue ?"Edit Issue: "+this.props.issue.title:"Report Issue"}</h4></div>*/}

                <div className="col">

                                  <form onSubmit={this.handleSubmit}>
                            <div className="row mb-1">
                                <div className="col">

                                    <TextFieldWrapper
                                        initialValue={this.props.issue&&this.props.issue.title}
                                        onChange={(value)=>this.handleChange(value,"title")}
                                        error={this.state.errors["title"]}
                                        name="title" title="Title"
                                    />
                                </div>
                            </div>

                            <div className="row mb-1">
                                <div className="col">
                                    <TextFieldWrapper
                                        initialValue={this.props.issue&&this.props.issue.description}
                                        onChange={(value)=>this.handleChange(value,"description")}
                                        error={this.state.errors["description"]}
                                        multiline
                                        rows={4} name="description" title="Description" />

                                </div>
                            </div>

                            <div className="row mb-1">
                                <div className="col">
                                    <SelectArrayWrapper
                                        initialValue={this.props.issue&&this.props.issue.priority}
                                        onChange={(value)=>this.handleChange(value,"priority")}
                                        error={this.state.errors["priority"]}
                                        select={"Select"}
                                        options={ISSUES_PRIORITY} name={"priority"} title="Priority"/>


                                </div>
                            </div>
                              <div className="row mb-1">
                                          <div className="col">
                                              {this.state.keywords.map((item, index)=>
                                                  <KeywordChip
                                                        key={index}
                                                      onChange={(keyword,add)=>
                                                      this.addToKeywords(keyword,add)}
                                                      selected={(this.props.issue&&this.props.issue.keywords
                                                      &&this.props.issue.keywords.find((key)=>item.name===key))?true:false}
                                                      item={item} />
                                              )}

                                          </div>
                             </div>
                            <div className="row justify-content-center">
                                <div className="col text-center">
                                    <GreenButton
                                        title={"Submit"}

                                        type="Submit"
                                        onClick={this.showReleaseProductPopUp}
                                    >
                                    </GreenButton>

                                </div>
                            </div>
                        </form>

                    <div className="mt-2">{this.state.status}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};
const mapDispachToProps = (dispatch) => {
    return {

        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),
    };
};

export default connect(mapStateToProps,mapDispachToProps)(IssueSubmitForm);
