import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import {Edit} from "@mui/icons-material";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import RightSidebar from "../RightBar/RightSidebar";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import IconBtn from "../FormsUI/Buttons/IconBtn";
import * as actionCreator from "../../store/actions/actions";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import CheckboxWrapper from "../FormsUI/ProductForm/Checkbox";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import PhoneInput from "react-phone-input-2";
import SearchPlaceAutocomplete from "../FormsUI/ProductForm/SearchPlaceAutocomplete";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {arrangeAlphabatically} from "../../Util/GlobalFunctions";
import GreenButton from "../FormsUI/Buttons/GreenButton";

class ManageRole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timerEnd: false,
            count: 0,
            nextIntervalFlag: false,
            fields: {},
            errors: {},
            loading: false,
            items:[],
            showEdit:false,
            selectedKey:null,
            editMode:false,
            allPerms:[],
            selectedEditItem:null
        };

    }

    fetchRoles=()=> {
        axios
            .get(baseUrl + "role")
            .then(
                (response) => {

                    this.setState({
                        items: response.data.data,

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    fetchAllPermissions=()=> {
        axios
            .get(baseUrl + "role/perm")
            .then(
                (response) => {

                    this.setState({
                        allPerms: arrangeAlphabatically(response.data.data),

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

toggleEdit=async (edit, key, item) => {


     this.fetchAllPermissions()

    // this.props.toggleRightBar()
    this.setState({
        showEdit: !this.state.showEdit,
        editMode: edit,
        selectedKey: key,
        selectedEditItem: item,

    })
}


    handleValidation() {


        let fields = this.state.fields;


        let validations = [
            validateFormatCreate("name", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("description", [{check: Validators.required, message: 'Required'}], fields),
        ]


        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});
        return formIsValid;
    }

    handleChange(value, field) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({fields});

    }
    handleChangeCheck(value,field ) {

        let fields = this.state.fields;

        if (value){


            if (fields.perms){
                fields.perms.push(field);
            }

            else{
                fields.perms=[field];
            }


        }else{

            if (fields.perms){
                let perms = fields.perms.filter((item)=> item!==field)
                fields.perms=perms;
            }


        }


        this.setState({fields});

    }


    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        let parentId;

        if (!this.handleValidation()) {
            return
        }

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);



        let fields= this.state.fields

        fields.type="org_other"

        // return false

        if (!this.state.editMode) {
            axios
                .put(
                    baseUrl + "role",

                     fields
                )
                .then((res) => {
                    this.toggleEdit()
                    this.fetchRoles()
                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: `Role  created successfully. Thanks`
                    })


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                });

        }else{

            axios
                .post(
                    baseUrl + "role",

                    {id:this.state.selectedEditItem._key,update:fields}

                )
                .then((res) => {

                    this.fetchRoles()
                    this.toggleEdit()
                    this.props.showSnackbar({show: true, severity: "success", message: `Role updated successfully. Thanks`})


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                });
        }





    };


    componentDidMount() {
        window.scrollTo(0, 0);
        this.fetchRoles();

    }

    render() {
        return (


            <div className="container ">

                        <PageHeader
                            pageTitle="Manage Roles"
                            subTitle="Manage User Roles"
                        />
                   <RightSidebar  toggleOpen={this.toggleEdit} open={this.state.showEdit} width={"70%"}>

                       {this.state.showEdit&&     <div className="container  mb-150  pb-5 pt-4">
                            <div className="row   mb-2  ">
                                <div className="col-12  ">
                                    <h4 className="blue-text text-heading">{this.state.editMode?"Edit Role":"Add New"}</h4>
                                </div>
                            </div>
                        <div className="row   mb-2  ">
                            <div className="col-12  ">
                            <form className={"full-width-field"} onSubmit={this.handleSubmit}>



                                <div className="row ">
                                    <div className="col-12 ">
                                        <TextFieldWrapper
                                            initialValue={this.state.selectedEditItem?this.state.selectedEditItem.name:null}
                                            onChange={(value)=>this.handleChange(value,"name")}
                                            error={this.state.errors["name"]}
                                            name="name" title="Name" />

                                    </div>
                                </div>


                                <div className="row no-gutters">
                                    <div className="col-12 ">

                                        <TextFieldWrapper
                                            initialValue={this.state.selectedEditItem?this.state.selectedEditItem.description:null}
                                            onChange={(value)=>this.handleChange(value,"description")}
                                            error={this.state.errors["description"]}
                                            name="description" title="Description" />

                                    </div>
                                </div>
                                <div className="row  ">
                                    <div className="col-12  parent-checkbox-container-custom  justify-content-start align-items-center">

                                    {this.state.allPerms.map((item=>

                                            <div className="checkbox-container-custom">
                                                <CheckboxWrapper
                                                    initialValue={this.state.editMode&&this.state.selectedEditItem&&this.state.selectedEditItem.perms.includes(item)}
                                                    onChange={(checked)=>this.handleChangeCheck(checked,    `${item}`)} color="primary"
                                                    name={ `${item}`} title={item} />
                                            </div>

                                    ))}
                                    </div>
                                </div>


                                <div className="row no-gutters ">

                                </div>
                                <div className={"row"}>
                                    <div className="col-12  mb-2">

                                        <GreenButton
                                            type={"submit"}
                                            title={"Submit"}
                                        >
                                        </GreenButton>

                                    </div>
                                </div>

                            </form>
                            </div>
                        </div>
                        </div>}

                  </RightSidebar>
                            <div className="row">
                                <div className="col-12 text-right text-blue"> <IconBtn onClick={()=>this.toggleEdit(false,null,null)} />  </div>
                                <div className="col-12">


                                    {this.state.items.map((item,index)=>
                                      <>  <hr/>
                                      <div className="row d-flex flex-row mb-2  align-items-start">
                                            <div className=" col-1 justify-content-start">
                                               <span className={"title-bold"}>{index+1}. </span>

                                            </div>
                                          <div className=" col-9 ">
                                              <span className={"title-bold"}> {item.name}</span><br/>
                                              <span className={"text-gray-light text-14"}>{item.description}</span>

                                          </div>
                                             {item._key && <div className=" col-2 text-right ">
                                             <ActionIconBtn onClick={()=>this.toggleEdit(true,item._key,item)}><Edit/></ActionIconBtn>
                                            </div>}
                                        </div>

                                      </>

                                    )}

                                </div>
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

const mapDispatchToProps = (dispatch) => {
    return {

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageRole);
