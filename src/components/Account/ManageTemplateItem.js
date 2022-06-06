import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import axios from "axios/index";
import {Cancel, CheckCircle, Close, Delete, Done, Edit, Info} from "@mui/icons-material";
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import * as actionCreator from "../../store/actions/actions";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import CustomPopover from "../FormsUI/CustomPopover";
import {Spinner} from "react-bootstrap";
import GlobalDialog from "../RightBar/GlobalDialog";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import BlueBorderButton from "../FormsUI/Buttons/BlueBorderButton";
import OrgComponent from "../Org/OrgComponent";

class ManageTemplateItem extends Component {
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
            selectedEditItem:null,
            role:null,
            btnLoading:false,
            user:null,
            status: {show:false,type:""},
            approveMode:false,
            roles:[]
        };

    }

    fetchRoles=()=> {

        this.setState({
            btnLoading: true,

        });
        axios
            .get(baseUrl + "role")
            .then(
                (response) => {

                    this.setState({
                        btnLoading: false,

                    });
                    this.setState({
                        roles: response.data.data,

                    });
                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    fetchRole=(id)=> {

        axios
            .get(baseUrl + "role/"+id.replace("Role/",""))
            .then(
                (response) => {

                    this.setState({
                        role: response.data.data,

                    });


                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }
    fetchUser=(id)=> {

        axios
            .get(baseUrl + "user/"+id)
            .then(
                (response) => {

                    this.setState({
                        user: response.data.data,

                    });


                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    toggleEdit=async (edit, key, item) => {


        if (item)
            await this.fetchRoles()

        this.setState({
            editMode: edit,
            selectedKey: key,
            selectedEditItem: item,
            showEdit: !this.state.showEdit,
        })
    }


    toggleApprove=async (edit, key, item) => {


        if (item)
            await this.fetchRoles()

        this.setState({
            approveMode: !this.state.approveMode,

        })
    }


    handleChange(value, field) {

        let fields = this.state.fields;
        fields[field] = value;
        this.setState({fields});

    }

    handleChangeRole(value, field) {


        if (value) {
            this.setState({
                btnLoading: true,

            });

            axios
                .post(
                    baseUrl + "org/email/add",
                    {
                        email: this.state.user.email,
                        role_id: value
                    }
                )
                .then((res) => {

                    this.toggleEdit()

                    this.fetchRole(value)
                    this.props.toggleRightBar()
                    this.props.showSnackbar({
                        show: true,
                        severity: "success",
                        message: "User role updated successfully. Thanks"
                    })


                })
                .catch((error) => {
                    this.setState({isSubmitButtonPressed: false})
                }).finally(() => {

                    this.setState({
                        btnLoading: false,

                    });
                }
            );
        }

    }


    handleSubmitUser = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({
            btnLoading: true,

        });

        const data = new FormData(event.target);
        const role_id=data.get("role")


        // return false
        axios
            .post(
                baseUrl + "org/user/approve",

                {
                    user_id: this.state.user._key,
                    role_id:role_id.replace("Role/",""),
                    approve:true,
                    org_id: this.props.item.org_id?this.props.item.org_id.replace("Org/",""):null,
                }

            )
            .then((res) => {

                this.toggleApprove()

                this.setState({

                    status:{type:"Approved",show:true}

                })



            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
            }).finally(()=>{

                this.setState({
                    btnLoading: false,

                });
            }

        );


    };


    approveUser=(role_id,approve)=>{


        axios
            .post(
                baseUrl + "org/user/approve",

                {
                    user_id: this.state.user._key,
                    org_id: this.props.item.org_id,
                    role_id: role_id,
                    approve:approve
                }
            )
            .then((res) => {

                this.setState({

                    status:approve?{type:"Approved",show:true}:{show:true,type:"Rejected"}

                })


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
            }).finally(() => {

                this.setState({
                    btnLoading: false,

                });
            }
        );

    }


    componentDidMount() {
        window.scrollTo(0, 0);

        if (this.props.item.user){

            // if (this.props.item.org_id){
            //     this.fetchUserOrg(this.props.item.org_id.replace("Org","org"))
            // }
            this.setState({
                user:this.props.item.user
            })

            if (this.props.item.role_id)
                this.fetchRole(this.props.item.role_id)

        }
        // else{
        //     this.fetchUser(this.props.item._key)
        // }

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

        const index=this.props.index
        return (
            <>

                <div key={index} className="row no-gutters min-row-height-90 d-flex hover-bg flex-row pb-2 pt-2 border-top align-items-start justify-content-start">
                    <div className=" col-1  align-items-start d-flex ">
                        <span className={"text-blue"}>{index+1}. </span>

                    </div>
                    <div className=" col-9 text-left  ">

                            <p className={`text-blue text-capitalize mb-0`}> {this.props.item.name} </p>
                        <p className="text-gray-light text-capitalize mb-0"> {this.props.item.product.name}, {this.props.item.product.category}, {this.props.item.product.type}, {this.props.item.product.state}, {this.props.item.product.year_of_making} </p>

                    </div>
                    <div className=" col-2 text-right  ">
                    <div className={""}>
                        <CustomPopover text={"Edit"}>
                            <ActionIconBtn
                                className={"mb-2"}
                                onClick={()=>this.props.onClickEdit(this.props.item)}
                                type={"submit"}
                                title={"Submit"}
                            >
                                <Edit />
                            </ActionIconBtn></CustomPopover>
                        <CustomPopover text={"Cancel"}>
                            <ActionIconBtn
                                className={"mb-2"}
                                onClick={this.props.onClick}
                                type={"button"}
                                title={"Submit"}
                            >
                                <Close/>
                            </ActionIconBtn></CustomPopover>
                    </div>
                    </div>

                </div>


                <GlobalDialog size={"xs"} hide={()=>this.toggleApprove(false)} show={this.state.approveMode} heading={"Add User"} >
                    <>
                        <form className={"full-width-field"} onSubmit={this.handleSubmitUser}>

                            <div className="col-12 ">


                                <div className="row no-gutters">
                                    <div
                                        className="col-12 ">

                                        {this.state.roles.length>0&&
                                        <SelectArrayWrapper
                                            option={"name"}
                                            select={"Select"}
                                            valueKey={"_id"}
                                            error={this.state.errors["role"]}
                                            onChange={(value) => {
                                                this.handleChange(value, "role")
                                            }}
                                            title={"Assign Role"}
                                            options={this.state.roles.filter((role)=> role.is_system_role)}
                                            name={"role"}
                                        />}

                                    </div>
                                </div>

                            </div>
                            <div className="col-12 ">

                                <div className="row mt-4 no-gutters">
                                    <div  className={"col-6 pr-1"}
                                          style={{
                                              textAlign: "center",
                                          }}>
                                        <GreenButton

                                            title={"Submit"}
                                            type={"submit"}>

                                        </GreenButton>
                                    </div>
                                    <div
                                        className={"col-6 pl-1"}
                                        style={{
                                            textAlign: "center",
                                        }}>
                                        <BlueBorderButton
                                            type="button"

                                            title={"Cancel"}

                                            onClick={()=>
                                                this
                                                    .toggleApprove(false,null)
                                            }
                                        >

                                        </BlueBorderButton>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
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
export default connect(mapStateToProps, mapDispatchToProps)(ManageTemplateItem);
