import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import { Validators, validateFormatCreate, validateInputs } from "../../Util/Validator";
import GreenButton from "../FormsUI/Buttons/GreenButton";
import AutocompleteCustom from "../AutocompleteSearch/AutocompleteCustom";
import axios from "axios";
import { baseUrl } from "../../Util/Constants";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";



function MagicLinksCreator({ pagePath, isLoggedIn, userDetail, userContext, loading: buttonLoading }) {

    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});
    const [org_id, setOrg_id] = useState(null);
    const [companyRoles, setCompanyRoles] = useState(null);

    // useEffect(() => {

    // }, [errors])


    const handleChangeForm = (value, field) => {
        let formFields = fields;
        formFields[field] = value;

        setFields(formFields);
    }

    const handleValidation = () => {

        let formFields = fields;

        let validations = [
            validateFormatCreate("destination_path", [{ check: Validators.required, message: 'Required' }], formFields),
            validateFormatCreate("company", [{check: Validators.required, message: 'Required'}],formFields),
            validateFormatCreate("role_id", [{check: Validators.required, message: 'Required'}],formFields),

        ]

        let { formIsValid, errors } = validateInputs(validations, formFields)


        if (!formIsValid) {
            setErrors({ errorPending: true })
        } else {
            setErrors({ errorPending: false })
        }

        setErrors(errors);
        console.log("form errors ", errors, formIsValid);

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
        }
    }

    const getRole = async (companyId) => {
        if (!companyId) { return }
        try {
            const roleData = await axios.get(`${baseUrl}role/org/${companyId}`);
            console.log("roleDAta ", roleData.data.data);

            if (roleData || roleData.length > 0) {

                setCompanyRoles(roleData.data.data);
            }

        } catch (error) {
            console.error("getRole error ", error,);
        }
    }


    const handleSubmitForm = async (e) => {
        console.log("e ", e);
        if (!e || !e.target) { return };
        e.preventDefault();

        if (!handleValidation()) { return };

        const formData = new FormData(e.target);
        console.log("> ", formData);

        const destination_path = formData.get("destination_path");
        const roleId = formData.get("role_id");
        const email_list = formData.get("email_list");
        const no_of_uses = formData.get("no_of_uses");

        console.log("no_of_uses ", no_of_uses);



        const postData = {
            org_id,
            "role_id": roleId,
            "email_list": (email_list || email_list !== "") ? [email_list] : [],
            destination_path,
            "no_of_uses": (!no_of_uses || no_of_uses === "0") ? null : Number(no_of_uses),
        }

        console.log(">dp ", postData);

        await createMagicLink(postData);

    }

    const createMagicLink = async (postData) => {
        try {
            const magic = axios.post(`${baseUrl}magic`, postData);

            if (magic) {
                // TODO: let user know success
                // TODO: reset form values
                console.log("createMagicLink ", magic);
            }

        } catch (error) {
            console.error("createMAgicLink error ", error);
            // TODO: let user know failure
        }
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
                        <div className="custom-label text-bold text-blue">
                            Select Role
                        </div>
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

                <div className="row">
                    <div className="col">
                        <TextFieldWrapper
                            name="email_list"
                            title="Add emails"
                            error={errors["email_list"]}
                            onChange={(value) => handleChangeForm(value, "email_list")}
                            initialValue=""
                            placeholder="Enter emails (separate with comma)"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <TextFieldWrapper
                            name="no_of_uses"
                            title="Number of uses (Optional: default 5)"
                            error={errors["no_of_uses"]}
                            onChange={(value) => handleChangeForm(value, "no_of_uses")}
                            initialValue=""
                            placeholder="Enter number of uses (default 5)"
                            numberInput
                        />
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col d-flex justify-content-end">
                        <GreenButton title="Create Link" type="submit" loading={buttonLoading} />
                    </div>
                </div>
            </form>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MagicLinksCreator)