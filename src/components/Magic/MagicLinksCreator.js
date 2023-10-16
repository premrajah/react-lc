import React, { useState } from 'react'
import * as actionCreator from "../../store/actions/actions";
import { connect } from "react-redux";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import { Validators, validateFormatCreate, validateInputs } from "../../Util/Validator";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import AutocompleteCustom from "../AutocompleteSearch/AutocompleteCustom";
import axios from "axios";
import { baseUrl, frontEndUrl } from "../../Util/Constants";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import GlobalDialog from "../RightBar/GlobalDialog";
import CopyContentButton from "../Utils/CopyContentButton";
import { Link } from "react-router-dom";
import CustomPopover from "../FormsUI/CustomPopover";


function MagicLinksCreator({ pagePath, isLoggedIn, userDetail, userContext, loading: buttonLoading, hideMagicLinkPopup, showSnackbar }) {

    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});
    const [org_id, setOrg_id] = useState(null);
    const [companyRoles, setCompanyRoles] = useState(null);
    const [magicLinkDisplayPopup, setMagicLinkDisplayPopup] = useState(false);
    const [magicLinkUrl, setMagicLinkUrl] = useState(null);
    const [emailFieldVisibility, setEmailFieldVisibility] = useState(false);
    const [otherFieldsVisibility, setOtherFieldsVisibility] = useState(false);


    const handleChangeForm = (value, field) => {
        let formFields = fields;
        formFields[field] = value;

        setFields(formFields);
    }

    const handleValidation = () => {

        let formFields = fields;

        let validations = [
            validateFormatCreate("destination_path", [{ check: Validators.required, message: 'Required' }], formFields),
            validateFormatCreate("company", [{ check: Validators.required, message: 'Required' }], formFields),
            validateFormatCreate("role_id", [{ check: Validators.required, message: 'Required' }], formFields),
            validateFormatCreate("email_list", [{ check: Validators.email, message: 'Please enter valid email' }], formFields),
        ]

        let { formIsValid, errors } = validateInputs(validations, formFields)

        if (!formIsValid) {
            setErrors({ errorPending: true })
        } else {
            setErrors({ errorPending: false })
        }

        setErrors(errors);

        return formIsValid;
    }

    const companyDetails = async (detail) => {
        if (detail.org) {
            fields.company = detail.org
            setOrg_id(detail.org);
            await getRole(detail.org);
        } else if (detail.company) {
            try {
                if (!detail.company) { return }
                await getCompanyDetails(detail.company);

            } catch (error) {
                console.error("company details outside error ", error);
                showSnackbar({ show: true, severity: "error", message: "Something went wrong, unable to get company details at this time" });
            }
        } else {
            fields.company = null;
            setOrg_id(null);
            setCompanyRoles(null);
        }
    }

    const getCompanyDetails = async (companyDetail) => {
        try {
            const companyData = await axios.get(`${baseUrl}org/company/${companyDetail}`);
            if (companyData) {
                let responseAll = companyData.data.data;
                fields.company = responseAll._key;
                setOrg_id(responseAll._key);
                await getRole(responseAll._key);
            }
        } catch (error) {
            console.error("getCompanyDetails error ", error);
            showSnackbar({ show: true, severity: "error", message: "Something went wrong, unable to get company details at this time" });
        }
    }

    const getRole = async (companyId) => {
        if (!companyId) { return }
        try {
            const roleData = await axios.get(`${baseUrl}role/org/${companyId}`);

            if (roleData || roleData.length > 0) {

                setCompanyRoles(roleData.data.data);
            }

        } catch (error) {
            console.error("getRole error ", error,);
            showSnackbar({ show: true, severity: "error", message: "Something went wrong, unable to get company role at this time" });

        }
    }


    const handleSubmitForm = async (e) => {
        if (!e || !e.target) { return };
        e.preventDefault();

        if (!handleValidation()) { return };

        const formData = new FormData(e.target);

        const destination_path = formData.get("destination_path");
        const roleId = formData.get("role_id");
        const email_list = formData.get("email_list");
        const no_of_uses = formData.get("no_of_uses");

        const postData = {
            org_id,
            "role_id": roleId,
            "email_list": (email_list || email_list !== "") ? [email_list] : [],
            "destination_path": `${frontEndUrl.slice(0, -1)}${destination_path}`,
            "no_of_uses": (!no_of_uses || no_of_uses === "0") ? null : Number(no_of_uses),
        }

        await createMagicLink(postData);

    }

    const createMagicLink = async (postData) => {
        try {
            const magic = await axios.post(`${baseUrl}magic`, postData);

            if (magic) {
                const { data } = magic.data
                setMagicLinkUrl(data);
                hideMagicLinkPopup();
                setMagicLinkDisplayPopup(true);
                showSnackbar({ show: true, severity: "success", message: "Successfully create magic link" });
            }

        } catch (error) {
            console.error("createMAgicLink error ", error);
            showSnackbar({ show: true, severity: "error", message: "Something went wrong, unable to create magic link" });
        }
    }

    const hideMagicLinkDisplayPopup = () => {
        setMagicLinkDisplayPopup(false);
        setMagicLinkUrl(null);
    }

    const showHideEmailFieldsHandler = () => {
        setEmailFieldVisibility(!emailFieldVisibility);
        !emailFieldVisibility && handleChangeForm([], "email_list"); // reset email feiel
    }

    const showHideOtherFieldsHandler = () => {
        setOtherFieldsVisibility(!otherFieldsVisibility);
        !otherFieldsVisibility && handleChangeForm(null, "no_of_uses"); // reset other fields
    }

    return (<>
        <section>
            <form
                autoComplete={false}
                onSubmit={(e) => handleSubmitForm(e)}

            >
                <div className="row">
                    <div className="col">
                        <TextFieldWrapper
                            classAdd={"textbox-left-padding"}
                            startAdornment={<span className="startAdornment-left">{frontEndUrl}</span>}
                            name="destination_path"
                            title="Enter destination path (URL)"
                            error={errors["destination_path"]}
                            onChange={(value) => handleChangeForm(value, "destination_path")}
                            initialValue={pagePath ? pagePath : ""}
                            placeholder="Enter url"

                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="custom-label text-bold text-blue">
                            Select Company
                        </div>
                        <AutocompleteCustom
                            // filterOrgs={[{ _id: userDetail.orgId }]}
                            orgs={true}
                            companies={true}
                            selectedCompany={(action) => companyDetails(action)}
                            hideAddNew
                        />
                        {errors["company"] && <span style={{ color: "rgb(244, 67, 54)" }} className="text-danger">Required</span>}

                    </div>
                </div>

                {companyRoles && <div className="row">
                    <div className="col">

                        <SelectArrayWrapper
                            option="name"
                            select="Select"
                            valueKey="_id"
                            error={errors["role_id"]}
                            onChange={(value) => { handleChangeForm(value, "role_id") }}
                            title="Assign Role"
                            options={companyRoles}
                            name={"role_id"}

                        />
                    </div>
                </div>}


                <section>

                    <div className="row mt-2">
                        <div className="col">
                                <Link to="#" onClick={() => showHideEmailFieldsHandler()} className="btn-gray-border click-item">
                                    {!emailFieldVisibility ? `Add emails` : `Hide email field`}
                                </Link>
                        </div>
                    </div>

                    {emailFieldVisibility && <div className="row mt-2">
                        <div className="col">
                            <TextFieldWrapper
                                name="email_list"
                                title=""
                                error={errors["email_list"]}
                                onChange={(value) => handleChangeForm(value, "email_list")}
                                initialValue=""
                                placeholder="Enter emails (separate with comma)"
                            />
                        </div>
                    </div>}

                    <div className="row mt-2">
                        <div className="col">
                        <Link to="#" onClick={() => showHideOtherFieldsHandler()} className="btn-gray-border click-item">
                                    {!otherFieldsVisibility ? `Other` : `Hide other fields`}
                                </Link>
                        </div>
                    </div>

                    {otherFieldsVisibility && <div className="row mt-2">
                        <div className="col-md-6">
                            <TextFieldWrapper
                                name="no_of_uses"
                                title=""
                                error={errors["no_of_uses"]}
                                onChange={(value) => handleChangeForm(value, "no_of_uses")}
                                initialValue=""
                                placeholder="Enter number of uses (Optional: default 5)"
                                numberInput
                            />
                        </div>
                    </div>}

                </section>

                <div className="row mt-4 justify-content-center">
                    <div className="col-4 d-flex justify-content-center">
                        <GreenButton fullWidth title="Create Link" type="submit" loading={buttonLoading} />
                    </div>
                </div>
            </form>
        </section>

        <section>
            <GlobalDialog
                size="md"
                show={magicLinkDisplayPopup}
                hide={() => hideMagicLinkDisplayPopup()}
                heading="Created Magic Link"
            >
                {magicLinkUrl &&
                    <div className="col-12" >
                    <div className="row mt-4 container-light-gray pt-2 pb-2" >
                    <div className="col-md-2 custom-label text-bold text-blue">
                        Magic Link
                    </div>
                    <div className="col-md-6">
                        {magicLinkUrl}
                    </div>
                    <div className="col-md-4 justify-content-end d-flex">
                        <CustomPopover text={"Click to copy link"}>
                        <CopyContentButton value={magicLinkUrl} />
                        </CustomPopover>
                    </div>
                </div>
                    </div>
                }
            </GlobalDialog>
        </section>
    </>)
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
        userContext: state.userContext,
        loading: state.loading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MagicLinksCreator)