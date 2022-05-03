import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import {Delete, Edit, Info} from "@mui/icons-material";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import RightSidebar from "../RightBar/RightSidebar";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import * as actionCreator from "../../store/actions/actions";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {arrangeObjectKeysAlphabatically, fetchErrorMessage} from "../../Util/GlobalFunctions";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import CustomTransferList from "../FormsUI/ProductForm/CustomTransferList";
import GlobalDialog from "../RightBar/GlobalDialog";

import Add from "@mui/icons-material/Add";
import CustomPopover from "../FormsUI/CustomPopover";

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
            allPerms:null,
            allPermsKeys:[],
            selectedEditItem:null,
            showDeletePopUp: false,
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

                    console.log(arrangeObjectKeysAlphabatically(response.data.data))

                    this.setState({

                        allPerms: (response.data.data),
                        allPermsKeys: arrangeObjectKeysAlphabatically(response.data.data),


                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }


  toggleEdit = async (edit, key, item) => {

            // this.props.toggleRightBar()
            this.setState({
                showEdit: !this.state.showEdit,
                editMode: edit,
                selectedKey: key,
                selectedEditItem: item,
            })

      this.fetchAllPermissions()
        }




    handleValidation() {


        let fields = this.state.fields;


        let validations = [
            validateFormatCreate("name", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("description", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("perms", [{check: Validators.required, message: 'Required'}], fields),

        ]


        let {formIsValid, errors} = validateInputs(validations)

        this.setState({errors: errors});
        return formIsValid;
    }

    handleChange(value, field) {

        let fields = this.state.fields;
        fields[field] = value;
        console.log(value)
        this.setState({fields});

    }
    handleChangeCheck(selected){

        let fields = this.state.fields;
        fields.perms=selected
        console.log(fields)
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
                    this.toggleEdit()

                    this.fetchRoles()
                    this.props.showSnackbar({show: true, severity: "success", message: `Role updated successfully. Thanks`})


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                });
        }





    };

    handleDelete = () => {


        // return false

        if (this.state.selectedEditItem) {
            axios
                .delete(
                    baseUrl + "role/"+this.state.selectedEditItem._key

                )
                .then((res) => {
                    this.toggleDeletePopUp()
                    this.fetchRoles()
                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: `Role  deleted successfully. Thanks`
                    })


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                    this.toggleDeletePopUp()
                    this.props.showSnackbar({
                        show: true,
                        severity: "error",
                        message: fetchErrorMessage(error)
                    })

                });

        }





    };

    toggleDeletePopUp= (key, item) => {

        this.setState({
            selectedEditItem: item,
            showDeletePopUp: !this.state.showDeletePopUp,

        })
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.fetchRoles();

    }

    render() {
        return (

            <>

            <div className="container ">

                <PageHeader
                    pageTitle="Manage Roles"
                    subTitle="Manage User Roles"
                />
                <RightSidebar  toggleOpen={this.toggleEdit} open={this.state.showEdit} width={"70%"}>
                    {this.state.showEdit&&
                    <div className="container  mb-150  pb-5 pt-4">
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

                                    {this.state.allPermsKeys.length>0&&this.state.allPerms &&
                                    <div className="row no-gutters ">
                                        <div className="col-12  mb-2">

                                            <CustomTransferList
                                                error={this.state.errors["perms"]}
                                                initialValue={this.state.selectedEditItem?this.state.selectedEditItem.perms:[]}
                                                setSelected={(selected)=>this.handleChangeCheck(selected)}
                                                keys={this.state.allPermsKeys}
                                                items={this.state.allPerms}
                                            />
                                        </div>

                                    </div>}

                                    <div className={"row"}>
                                        <div className="col-12 mt-3 mb-2">
                                            <GreenButton
                                                type={"submit"}
                                                title={"Submit"}
                                            ></GreenButton>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    }
                </RightSidebar>
                <div className="row">
                    <div className="col-12 text-right text-blue">
                        <button onClick={()=>this.toggleEdit(false,null,null)} className=" btn-sm btn-gray-border  mr-2"><>
                            <Add  style={{fontSize:"20px"}} />
                            Add Role</></button>
                    </div>


                    <div className="col-12 pt-4">

                        {this.state.items.map((item,index)=>
                            <div id={`${index}-${item._key}`} key={`${index}-${item._key}`}>
                                {/*<hr/>*/}
                                <div className="row d-flex flex-row pb-2 pt-2 min-row-height-90  hover-bg align-items-center border-top">
                                    <div className=" col-1 justify-content-start">
                                        <span className={"text-blue"}>{index+1}. </span>

                                    </div>
                                    <div className=" col-8 ">
                                        <span className={"text-blue text-capitalize"}> {item.name}</span>
                                        <span className={"text-gray-light text-14"}> ({item.description})
                                            <CustomPopover heading={item.name}
                                                           text={item.perms.length>0?(item.perms.map((role,index)=> <span id={`${role}-${index}`} key={`${role}-${index}`}>{role},</span>)):""}

                                            >

                                                    <Info
                                                        style={{ cursor: "pointer", color: "#EAEAEF" }}
                                                        fontSize={"small"}
                                                    />

                                                </CustomPopover></span>
                                    </div>
                                    {!item.is_system_role &&

                                    <div className=" col-3 text-right ">
                                        <ActionIconBtn onClick={()=>this.toggleEdit(true,item._key,item)}><Edit/></ActionIconBtn>
                                        <ActionIconBtn onClick={()=>this.toggleDeletePopUp(item._key,item)}><Delete/></ActionIconBtn>


                                    </div>}

                                </div>

                            </div>

                        )}

                    </div>
                </div>

            </div>

                <GlobalDialog size={"xs"} hide={this.toggleDeletePopUp} show={this.state.showDeletePopUp} heading={"Delete"} >
                    <div
                        className={"col-12 mb-3 text-left"}>
                        Are you sure you want to delete ?
                    </div>

                        <div
                            className={"col-6"}
                            style={{
                                textAlign: "center",
                            }}>
                            <GreenButton

                                onClick={
                                    this.handleDelete
                                }
                                title={"Submit"}
                                type={"button"}>

                            </GreenButton>
                        </div>
                        <div
                            className={"col-6"}
                            style={{
                                textAlign: "center",
                            }}>
                            <BlueBorderButton
                                type="button"

                                title={"Cancel"}

                                onClick={
                                    this
                                        .toggleDeletePopUp
                                }
                            >

                            </BlueBorderButton>
                        </div>

                </GlobalDialog>
</>
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
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageRole);
