import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import {Edit, Close, Done} from "@mui/icons-material";
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

class ManageUserItem extends Component {
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


        await this.fetchRoles()

        this.setState({
            editMode: edit,
            selectedKey: key,
            selectedEditItem: item,
            showEdit: !this.state.showEdit,
        })
    }



    handleChange(value, field) {

        let fields = this.state.fields;
        fields[field] = value;
        console.log(value)
        this.setState({fields});

    }


    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({
            btnLoading: true,
        });

        const data = new FormData(event.target);
        const role_id=data.get("role_id")


        // return false
        axios
            .post(
                baseUrl + "org/email/add",

                {
                    email: this.props.item.user.email,
                    role_id:role_id
                }

            )
            .then((res) => {

                this.fetchRoles()
                this.props.toggleRightBar()
                this.props.showSnackbar({show: true, severity: "success", message: "User role updated successfully. Thanks"})


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
            });


    };


    componentDidMount() {
        window.scrollTo(0, 0);


    }

    fetchUsers=()=> {
        axios
            .get(baseUrl + "org/user")
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

    render() {

        const {item,index} = this.props
        return (



                                <div className="row d-flex flex-row mb-2  align-items-start">
                                    <div className=" col-1 justify-content-start">
                                        <span className={"title-bold"}>{index+1}. </span>

                                    </div>
                                    <div className=" col-7 ">
                                        <span className={"title-bold"}> {item.user.firstName} {item.user.lastName}</span>   <span className={"title-blue text-right"}>{item.role_id}</span> <br/>
                                        <span className={"text-gray-light text-14"}>{item.user.email}</span>

                                    </div>
                                    <div className=" col-4 text-right ">

                                        {this.state.showEdit &&
                                        <form className={"full-width-field"} onSubmit={this.handleSubmit}>

                                            <div className="row no-gutters">
                                                <div className="col-12 d-flex align-items-center justify-content-end flex-row">

                                                    <SelectArrayWrapper


                                                        initialValue={item.role_id}

                                                        option={"name"}
                                                        valueKey={"_key"}
                                                        error={this.state.errors["role_id"]}
                                                        onChange={(value)=> {
                                                            this.handleChange(value,"role_id")
                                                        }}

                                                        options={this.state.items.filter((item)=> item._key)}
                                                        name={"role_id"}

                                                    />

<div  className={"ml-2"}>
                                                    <ActionIconBtn

                                                        onClick={this.toggleEdit}
                                                        type={"submit"}
                                                        title={"Submit"}
                                                    >
                                                        <Done/>
                                                    </ActionIconBtn>
                                                    <ActionIconBtn
                                                        onClick={this.toggleEdit}
                                                        type={"button"}
                                                        title={"Submit"}
                                                    >
                                                        <Close/>
                                                    </ActionIconBtn>
</div>

                                                </div>
                                            </div>

                                        </form>}

                                        {!this.state.showEdit &&   <ActionIconBtn
                                            onClick={()=>this.toggleEdit(true,item._key,item)}><Edit/></ActionIconBtn>}

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
export default connect(mapStateToProps, mapDispatchToProps)(ManageUserItem);
