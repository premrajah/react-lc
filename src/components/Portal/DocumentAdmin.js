import React, {Component} from 'react'
import AutocompleteCustom from "../AutocompleteSearch/AutocompleteCustom";
import OrgSettings from "../Account/OrgSettings";
import PageHeader from "../PageHeader";

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
      activeKey:"1"

    };

  }

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

            this.setState({
              orgId:action.org
            })

          }}
      />
    </div>



    {this.state.orgId &&
        <div className="col-12    mt-4">



          <h2>Documents for {this.state.orgId }</h2>
          {/*<OrgSettings isVisible={true}*/}
          {/*             orgId={this.state.orgId}*/}

          {/*/>*/}
        </div>
    }





    </>
  )
}
}


export default DocumentAdmin