import React, {Component} from "react";
import {connect} from "react-redux";
import {baseUrl, PRODUCTS_FILTER_VALUES_KEY} from "../../Util/Constants";
import axios from "axios/index";
import PageHeader from "../../components/PageHeader";
import BlueButton from "../FormsUI/Buttons/BlueButton";
import * as actionCreator from "../../store/actions/actions";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import {validateFormatCreate, validateInputs, Validators} from "../../Util/Validator";
import {arrangeAlphabatically, fetchErrorMessage, getSite, seekAxiosGet} from "../../Util/GlobalFunctions";
import MenuDropdown from "../FormsUI/MenuDropdown";
import {removeKey, saveKey} from "../../LocalStorage/user-session";
import AutocompleteCustom from "../AutocompleteSearch/AutocompleteCustom";
import AutoCompleteComboBox from "../FormsUI/ProductForm/AutoCompleteComboBox";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import PaginationLayout from "../IntersectionOserver/PaginationLayout";
import ProductItem from "../Products/Item/ProductItem";

class AssumeRoles extends Component {
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
            roleBy:"Email",
            assumeRoles:[],
            orgs:[],
            lastPageReached: false,
            offset: 0,
            pageSize: 20,
            loadingResults: false,


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

    toggleAddUser=async (loadRoles) => {

        if (loadRoles)
        this.fetchRoles()

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


    assumeRole = (event) => {

        if (!this.state.fields["value"]){

            let errors=this.state.errors
            errors.value={message:"Required."}

            this.setState({
                errors:errors
            })
        }

        // return false
        axios
            .post(
                `${baseUrl}user/assume/${this.state.roleBy?this.state.roleBy==="Email"?"email":
                    this.state.roleBy==="User Id"?"user":this.state.roleBy==="Org"?"org":"":null}`,
                {
                    assumed:this.state.fields["value"],
                }

            )
            .then((res) => {

                removeKey("token")
                // removeKey("user")
                saveKey("assumedRole",true)
                saveKey("roleName",this.state.fields["value"])

                let usrObject=res.data.data

                // delete usrObject["token"]

                saveKey("token",JSON.stringify(res.data.data.token)+"")

                // saveKey("user",usrObject)

                this.props.showSnackbar({show: true, severity: "success", message: "User assumed successfully. Thanks"})

                setTimeout(function() {

                    window.location.href=("/")

                }, 1000);


            })
            .catch((error) => {
                this.setState({isSubmitButtonPressed: false})
                this.props.showSnackbar({show: true, severity: "error", message: fetchErrorMessage(error)})

            }).finally(()=>{

            this.toggleAddUser(false)
        });


    };
    clearList = () => {
        this.setState({
            offset: 0,
            orgs: [],
            lastPageReached: false,
            loadingResults: false,
        });
    };
    getOrgs = async (data) => {

        try {
            if (data && data.reset) {
                this.clearList();
            }

            // if (data) this.setFilters(data);

            this.seekCount();

            this.setState({
                loadingResults: true,
            });

            let newOffset = this.state.offset;

            // let url = `${baseUrl}seek?name=Product&relation=belongs_to&no_parent=true&count=false&offset=${this.state.offset}&size=${this.state.pageSize}`;

            let url = `${baseUrl}seek/entity/no-auth?name=Org`;

            // this.filters.forEach((item) => {
            //     url = url + `&or=${item.key}~%${item.value}%`;
            // });

            this.setState({
                activeQueryUrl: url
            })

            url = `${url}&offset=${this.state.offset}&size=${this.state.pageSize}`;


            let result = await seekAxiosGet(url);

            if (result && result.data && result.data.data) {
                this.state.offset = newOffset + this.state.pageSize;

                this.setState({
                    orgs: this.state.orgs.concat(result.data ? result.data.data : []),
                    loadingResults: false,
                    lastPageReached: result.data
                        ? result.data.data.length === 0
                            ? true
                            : false
                        : true,
                    offset: newOffset + this.state.pageSize,
                });
            } else {
                if (result) {
                    this.props.showSnackbar({
                        show: true,
                        severity: "warning",
                        message: "Error: " + result,
                    });

                    this.setState({
                        loadingResults: false,
                        lastPageReached: true,
                    });
                }
            }

        }catch (e){console.log(e)}
    };

    seekCount = async () => {
        let url = `${baseUrl}seek/entity/no-auth?name=Org&count=true`;

        // this.filters.forEach((item) => {
        //     url = url + `&or=${item.key}~%${item.value}%`;
        // });

        let result = await seekAxiosGet(url);

        this.setState({
            count: result.data ? result.data.data : 0,
        });
    };
    componentDidMount() {
        window.scrollTo(0, 0);

        let roles=[]

        if(this.props.userDetail.perms.includes("LcAssumeUserRole")){
            roles.push("Email")
        }
        if(this.props.userDetail.perms.includes("LcAssumeOrgRole")){
            roles.push("Org")
        }
        if(this.props.userDetail.perms.includes("LcAssumeUserRole")){
            roles.push("User Id")
        }

        this.setState({

            assumeRoles:roles

        })

        // this.getOrgs()


    }


    render() {
        return (
<>

            <div className="container ">

                <PageHeader
                    pageTitle="Assume Roles"
                    subTitle="Assume roles of users from different companies"
                />

                {this.state.assumeRoles&&this.state.assumeRoles.length > 0 &&
                <div className="row d-flex align-items-center">

                    <div className="col-3 mt-4">

                        <MenuDropdown heigt={"60px"}
                                      // initialValue={"Org Id"}
                                      setSelection={(value) => this.setState({
                            roleBy: value
                        })} options={this.state.assumeRoles}
                        />

                    </div>



                    {(this.state.roleBy==="Email"||this.state.roleBy==="User Id")&&

                        <>
                    <div className="col-5    mt-4">

                        <TextFieldWrapper
                            onChange={(value) => this.handleChange(value, "value")}
                            error={this.state.errors["value"]}
                            name="value"

                        />



                    </div>
                    <div className="col-4    mt-4">
                    </div>
                    </>
                    }
                    {(this.state.roleBy==="Org") &&
                    <div className="col-9    mt-4">
                        Showing {this.state.orgs.length} of {this.state.count}
                        <div className="row mt-2 org-box-scroll gray-border ">
                            <div className="col-12  ">

                        <PaginationLayout
                            // dropDownValues={PRODUCTS_FILTER_VALUES_KEY}
                            hideSearch
                            hideCount
                            count={this.state.count}
                            visibleCount={this.state.orgs.length}
                            loadingResults={this.state.loadingResults}
                            lastPageReached={this.state.lastPageReached}
                            loadMore={(data) => { this.getOrgs(data)} }>
                            {this.state.orgs.map((item, index) => (
                                <div id={`${item.Org._key}-${index}`} key={item.Org._key + "-" + index}>
                                    <div className="row no-gutters product-item justify-content-center  mb-4 bg-white rad-8 g-0">
                                        <div
                                            onClick={() => {
                                                let fields=this.state.fields
                                                fields.value=item.Org._key
                                                this.setState({
                                                    fields:fields
                                                })
                                            }}
                                            className="col-12  "><span className={`${this.state.fields.value==item.Org._key?  "selected-green-item":""} tree-item-name`}>{item.Org.name}</span></div>
                                    </div>
                                </div>
                            ))}
                        </PaginationLayout>

                        </div>
                        </div>
                        {/*<SelectArrayWrapper*/}

                        {/*    details="Select product’s location from the existing sites or add new address below"*/}
                        {/*    // initialValue={this.props.item&&this.props.item.site._key}*/}
                        {/*    option={"Org"}*/}
                        {/*    subOption={"name"}*/}
                        {/*    valueKey={"Org"}*/}
                        {/*    subValueKey={"_key"}*/}
                        {/*    error={this.state.errors["org"]}*/}
                        {/*    onChange={(value) => {*/}
                        {/*        let fields=this.state.fields*/}
                        {/*        fields.value=value*/}
                        {/*        this.setState({*/}
                        {/*            fields:fields*/}
                        {/*        })*/}
                        {/*    }}*/}
                        {/*    select={"Select"}*/}
                        {/*    options={this.state.orgs}*/}
                        {/*    name={"org"}*/}
                        {/*    title="Select Organisation"/>*/}

                    {/*<AutocompleteCustom*/}
                    {/*    hideAddNew*/}
                    {/*    orgs={true}*/}
                    {/*    suggestions={this.state.orgNames}*/}
                    {/*    selectedCompany={(action) => {*/}
                    {/*        let fields=this.state.fields*/}
                    {/*        fields.value=action.org*/}
                    {/*        this.setState({*/}
                    {/*            fields:fields*/}
                    {/*        })*/}
                    {/*    }}*/}
                    {/*/>*/}

                    </div>
                    }
                    <div className="col-3 mt-4">

                        <BlueButton
                            onClick={this.assumeRole}
                            fullWidth
                            title={"Submit"}
                            type={"button"}>

                        </BlueButton>


                    </div>
                </div>

                }


            </div>


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
        logOut:(data) => dispatch(actionCreator.logOut(data)),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AssumeRoles);
