import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import * as actionCreator from "../../store/actions/actions";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {arrangeAlphabatically, fetchErrorMessage} from "../../Util/GlobalFunctions";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import ManageUserItem from "./ManageUserItem";
import GlobalDialog from "../RightBar/GlobalDialog";
import Add from "@mui/icons-material/Add";
import ProductForm from "../ProductPopUp/ProductForm";
import ManageTemplateItem from "./ManageTemplateItem";

class ProductLines extends Component {
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
            roles:[],
            showEdit:false,
            selectedKey:null,
            editMode:false,
            allPerms:[],
            selectedEditItem:null,
            showDeletePopUp: false,
            showAddPopUp: false,
            templates:[],
            editItem:null
        };

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

    toggleAddUser=async (item) => {



        this.setState({
            editItem:item?item:null
        })

        this.setState({
            showAddPopUp: !this.state.showAddPopUp,
        })

    }


    handleValidation() {


        let fields = this.state.fields;


        let validations = [
            validateFormatCreate("email", [{check: Validators.required, message: 'Required'}], fields),
            validateFormatCreate("role", [{check: Validators.required, message: 'Required'}], fields),
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



        // return false
        axios
            .post(
                baseUrl + "org/email/add",
                {
                    email:data.get("email"),
                    role_id:data.get("role"),
                }

            )
            .then((res) => {

                this.fetchUsers()
                this.props.showSnackbar({show: true, severity: "success", message: "New user added successfully. Thanks"})


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

            }).finally(()=>{

            this.toggleAddUser(false)
        });


    };



    fetchCache=()=> {

        this.setState({
            btnLoading: true,

        });
        axios
            .get(baseUrl + "org/cache")
            .then(
                (response) => {

                    // this.setState({
                    //     btnLoading: false,
                    //
                    // });

                    let responseObj=response.data.data

                    let keys=Object.keys(responseObj)

                    let templates=[]
                    keys.forEach((item)=> {

                        if (item.includes("product_line"))
                            templates.push({key: item, value: JSON.parse(responseObj[item])})
                        }
                    )


                    this.setState({
                        templates: templates,

                    });


                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        // this.fetchUsers();
        this.fetchCache()
    }


    handleDelete = (key) => {

            axios
                .delete(
                    baseUrl + "org/cache/"+key

                )
                .then((res) => {

                    this.fetchCache()
                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: `Template  removed successfully. Thanks`
                    })


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                });



    };

    toggleDeletePopUp= (key, item) => {


        this.setState({
            selectedEditItem: item,
            showDeletePopUp: !this.state.showDeletePopUp,

        })
    }

    render() {
        return (
<>



                <div className="row mt-4">
                    <div className="col-12 text-right text-blue">
                        <button onClick={()=>this.toggleAddUser(null)}
                                className=" btn-sm btn-gray-border  mr-2"><>
                            <Add  style={{fontSize:"20px"}} />
                            Add New</></button>
                    </div>


                                <div className="col-12 mt-4">


                                    {this.state.templates.map((item,index)=>
                                            <div id={`product-${index}-${item.key}`} key={`product-${index}-${item.key}`}>

                                            <ManageTemplateItem
                                                onClickEdit={(item)=>
                                                {

                                                    this.toggleAddUser(item)

                                                }}
                                                onClick={()=>this.handleDelete(item.key)}
                                                key={index}
                                                toggleDeletePopUp={(key,selection)=>this.toggleDeletePopUp(key,selection)}
                                                refreshList={this.fetchUsers}
                                                item={item.value}
                                                index={index}
                                            />

                                        </div>

                                    )}

                                </div>

                    </div>





    <GlobalDialog size={"xs"} hide={this.toggleDeletePopUp} show={this.state.showDeletePopUp} heading={"Remove User"} >
        <div
            className={"col-12 mb-3 text-left"}>
            Are you sure you want to remove this user ?
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

    <GlobalDialog
        hideHeading
                  size={"md"} hide={()=>this.toggleAddUser()}
                  show={this.state.showAddPopUp} heading={"Add New"} >
        <div className="col-12">
            {this.state.showAddPopUp &&  <ProductForm
              item={this.state.editItem}
              hide={()=>this.toggleAddUser()}
                       refresh={()=>this.fetchCache()}
                       productLines />}
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
export default connect(mapStateToProps, mapDispatchToProps)(ProductLines);