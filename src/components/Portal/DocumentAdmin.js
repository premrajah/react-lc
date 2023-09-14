import React, {Component, useEffect} from 'react'
import AutocompleteCustom from "../AutocompleteSearch/AutocompleteCustom";
import OrgSettings from "../Account/OrgSettings";
import PageHeader from "../PageHeader";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import * as actionCreator from "../../store/actions/actions";
import {connect} from "react-redux";
import DocumentAccordians from "./DocumentAccordians";

class DocumentAdmin extends Component {
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
      orgId:null,
      activeKey:"1",
      uploadedFilesTmp:[]

    };

  }


   getPreviousDocs = async (orgId) => {

    this.setState({
      loading:true
    })

    try {
      let prevFilesRes = await axios.get(
          `${baseUrl}carbon/org/${orgId}`,
      ).finally(() => {
      });

      if (prevFilesRes&&prevFilesRes?.data?.data){
        console.log("inside iff",prevFilesRes)
        this.setState({
          uploadedFilesTmp:prevFilesRes.data.data
        })
      }


    } catch (error) {
      console.log("handleUploadFileToProduct try/catch error ", error);
      this.setState({
        loading:false
      })

      this.props.showSnackbar({
        show: true,
        severity: "error",
        message: "Unable to complete your request, please try again after some time.",
      });
    }
  };

  render() {
  return (

    <>

    <div className="col-12 mt-4">

      <PageHeader
          pageTitle="Manage Documents"
          subTitle=""
      />

    </div>

    <div className="col-12    mt-4">

      <AutocompleteCustom
          hideAddNew
          orgs={true}
          suggestions={this.state.orgNames}
          selectedCompany={(action) => {

            this.getPreviousDocs(action.org)
            // this.setState({
            //   orgId:action.org
            // })

          }}
      />
    </div>


        <div className="col-12  ">

          <div className="row justify-content-center d-flex align-items-center">
            <div className={"col-12  "}>
                  <>
                    {this.state.uploadedFilesTmp.length>0&& <h5 className={"blue-text mt-4 text-left text-bold mb-4"}>Uploads</h5>}
                    <div className="col-12 ">
                      <div className="row ">
                        <div className="col-12">
                          {this.state.uploadedFilesTmp.map((uploadedGroup, index) =>
                              <>
                                  <DocumentAccordians
                                      disableEdit
                                      uploadedGroup={uploadedGroup}
                                  />
                              </>)}
                        </div>
                      </div>
                    </div>
                  </>
            </div>
          </div>


        </div>






    </>
  )
}
}



const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    showSnackbar: (data) => dispatch(actionCreator.showSnackbar(data)),



  };
};
export default  connect(mapStateToProps, mapDispatchToProps)(DocumentAdmin);
