import React, {Component} from "react";
import axios from "axios/index";
import {connect} from "react-redux";
import {baseUrl} from "../../Util/Constants";
import ImagesSlider from "../../components/ImagesSlider/ImagesSlider";
import PlaceholderImg from "../../img/place-holder-lc.png";
import MoreMenu from "../../components/MoreMenu";
import {Link} from "react-router-dom";
import {Badge, Modal} from "react-bootstrap";
import IssueSubmitForm from "../../components/IssueSubmitForm";
import {FormControl, FormHelperText, MenuItem, Select} from "@mui/material";
import Layout from "../../components/Layout/Layout";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import InfoTabContent from "../../components/issues/InfoTabContent";
import SubproductItem from "../../components/Products/Item/SubproductItem";
import CustomizedSelect from "../../components/FormsUI/ProductForm/CustomizedSelect";
import GlobalDialog from "../../components/RightBar/GlobalDialog";

class IssueDetail extends Component {
    state = {
        issue: null,
        editModal: false,
        stageModal: false,
        stageForm: "open",
        stageSelectedValue: "",
        activeKey:"1",
    };

    handleShowEditModal = () => this.setState({ editModal: true });
    handleHideEditModal = () => this.setState({ editModal: false });

    handleShowStageModal = () => this.setState({ stageModal: true });
    handleHideStageModal = () => this.setState({ stageModal: false });

    getIssue = (issueKey) => {
        if (!issueKey) return;

        axios
            .get(`${baseUrl}issue/${issueKey}`, {
                headers: { Authorization: "Bearer " + this.props.userDetail.token },
            })
            .then((response) => {
                this.setState({ issue: response.data.data });

                if (response.status === 200) {
                    this.setState({ stageSelectedValue: this.state.issue.issue.stage });
                }
                this.handleHideEditModal()
            })
            .catch((error) => {});
    };

    checkPriority = (priority) => {
        if (priority === "high") return "danger";
        if (priority === "medium") return "warning";
        if (priority === "low") return "info";
    };

    setActiveKey=(event,key)=>{


        this.setState({
            activeKey:key
        })


    }
    handleIssueSubmitted = (issueKey) => {
        this.getIssue(issueKey);


    };

    handleSetStage = () => {
        this.handleShowStageModal();
    };

    handleEdit = (e) => {
        if (e === "edit") {
            this.handleShowEditModal();
        }

        if (e === "stage") {
            this.handleSetStage();
        }
    };

    handleStageSubmit = (e) => {
        if (!e) return;
        e.preventDefault();

        const payload = {
            id: this.state.issue.issue._key,
            new_stage: this.state.stageSelectedValue,
        };

        this.updateStage(payload);
    };

    updateStage = (payload) => {
        axios
            .post(`${baseUrl}issue/stage`, payload, {
                headers: { Authorization: "Bearer " + this.props.userDetail.token },
            })
            .then((response) => {
                if (response.status === 200) {
                    this.getIssue(this.state.issue.issue._key);
                    this.handleHideStageModal();
                }
            })
            .catch((error) => {});
    };

    handleStageSelect = (e) => {
        if (!e) return;
        this.setState({ stageSelectedValue: e.target.value });
    };

    componentDidMount() {
        const {
            match: { params },
        } = this.props;
        const { issueKey } = params;
        this.getIssue(issueKey);
    }

    render() {
        return (
            <Layout>


                    <div className="container  ">
                        {this.state.issue && (

                            <>
                                <div className="row  pt-4 pb-4  justify-content-start">
                                    <div className="text-left    col-sm-12 col-xs-12 breadcrumb-row">
                                        <Link to={"/issues"}>My Issues</Link><span className={"divider-breadcrumb pl-2 pr-2"}>&#10095;</span><span className={"text-capitalize text-breadcrumb-light"}> {this.state.issue.issue.title}</span>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4 col-sm-12 col-xs-12 ">
                                        <div className="row stick-left-box ">
                                            <div className="col-12 text-center">
                                                {this.state.issue.product &&
                                                this.state.issue.product.artifacts &&
                                                this.state.issue.product.artifacts.length > 0 ? (
                                                    <ImagesSlider
                                                        images={this.state.issue.product.artifacts}
                                                    />
                                                ) : (
                                                    <img
                                                        className={"img-fluid rad-8 bg-white p-2"}
                                                        src={PlaceholderImg}
                                                        alt=""
                                                    />
                                                )}
                                            </div>

                                            <div className="col-12 mt-3 d-none ">
                                                {this.state.issue.product && (
                                                    <div>
                                                        <Link
                                                            to={`/product/${this.state.issue.product.product._key}`}>
                                                            <p
                                                                className={
                                                                    "text-capitalize title-bold"
                                                                }>
                                                                {
                                                                    this.state.issue.product.product
                                                                        .name
                                                                }
                                                            </p>
                                                        </Link>
                                                        <p>
                                                            {
                                                                this.state.issue.product.product
                                                                    .description
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-8 col-sm-12 col-xs-12 ">
                                        <div className="row ">
                                            <div className="col-md-10">
                                                <h4 className={"text-capitalize product-title"}>
                                                    {this.state.issue.issue.title}
                                                    {this.state.issue.issue && (

                                                            <Badge
                                                                className="ml-3"
                                                                style={{"fontSize":"50%",verticalAlign: "middle"}}
                                                                variant={this.checkPriority(
                                                                    this.state.issue.issue.priority
                                                                )}>
                                                                {this.state.issue.issue.priority.toUpperCase()}
                                                            </Badge>

                                                    )}
                                                </h4>

                                            </div>
                                            <div className="col-md-2 text-right">
                                                <MoreMenu
                                                    triggerCallback={(e) => this.handleEdit(e)}
                                                    edit
                                                    stage
                                                />
                                            </div>
                                        </div>


                                        {this.state.issue.issue.description && (
                                            <>
                                                <div className="row mb-3">
                                                    <div className="col">
                                                        <p className="text-gray-light">
                                                            {this.state.issue.issue.description}
                                                        </p>
                                                    </div>
                                                </div>

                                            </>
                                        )}

                                        <div className={"listing-row-border "}></div>


                                        {this.state.issue &&
                                        <div className="row justify-content-start pb-3  tabs-detail">
                                            <div className="col-12 ">

                                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                                    <TabContext value={this.state.activeKey}>
                                                        <Box sx={{ borderBottom: 2, borderColor: '#EAEAEF' }}>
                                                            <TabList
                                                                variant="scrollable"
                                                                scrollButtons="auto"
                                                                textColor={"#27245C"}
                                                                TabIndicatorProps={{
                                                                    style: {
                                                                        backgroundColor: "#27245C",
                                                                        padding: '2px',
                                                                    }
                                                                }}
                                                                onChange={this.setActiveKey}

                                                                aria-label="lab API tabs example">

                                                                <Tab label="Info" value="1" />
                                                                {(this.state.issue.product) &&
                                                                <Tab label="Product" value="2"/>
                                                                }
                                                            </TabList>
                                                        </Box>

                                                        <TabPanel value="1">

                                                            <InfoTabContent item={this.state.issue}/>

                                                        </TabPanel>


                                                        {(this.state.issue.product) &&
                                                        <TabPanel value="2">
                                                            <div className=" mt-3">
                                                            </div>

                                                                    <SubproductItem
                                                                        item={this.state.issue.product.product}
                                                                        hideMoreMenu={true}
                                                                        goToLink
                                                                        parentId={this.state.issue.product.product._key}
                                                                        history={this.props.history}
                                                                    />


                                                        </TabPanel>}


                                                    </TabContext>
                                                </Box>

                                            </div>
                                        </div>
                                        }


                                    </div>
                                </div>


                                </>
                        )}
                    </div>


                {this.state.issue && (
                    <>
                    <GlobalDialog
                        size="sm"

                        heading={"Edit Issue"}
                        show={this.state.editModal}
                        hide={this.handleHideEditModal}
                    >


                                <IssueSubmitForm
                                    issue={this.state.issue.issue}
                                    edit
                                    productId={this.state.issue.product.product._id}
                                    onSubmitted={() =>{
                                        this.handleIssueSubmitted(this.state.issue.issue._key);
                                    }}
                                />

                    </GlobalDialog>

                        <Modal show={this.state.stageModal} onHide={this.handleHideStageModal}>
                            <Modal.Header closeButton>
                                {this.state.issue.issue.title ? (
                                    <Modal.Title>
                                        Set Stage: {this.state.issue.issue.title}
                                    </Modal.Title>
                                ) : (
                                    <Modal.Title>Set Stage</Modal.Title>
                                )}
                            </Modal.Header>

                            <Modal.Body>
                                <div className="row">
                                    <div className="col">
                                        <form
                                            noValidate
                                            autoComplete="off"
                                            onSubmit={(e) => this.handleStageSubmit(e)}>
                                            {this.state.issue.issue.stage === "closed" ? (
                                                <FormControl>
                                                    <FormHelperText>Select Stage</FormHelperText>
                                                    <Select
                                                        className="mb-3"
                                                        name="stage"
                                                        defaultValue="open"
                                                        onChange={(e) => this.handleStageSelect(e)}>
                                                        <MenuItem value="open">open</MenuItem>
                                                        <MenuItem value="progress">
                                                            progress
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <FormControl>
                                                    <FormHelperText>Select Stage</FormHelperText>
                                                    <CustomizedSelect
                                                        variant={"standard"}
                                                        className="mb-3"
                                                        name="stage"
                                                        defaultValue={this.state.issue.issue.stage}
                                                        onChange={(e) => this.handleStageSelect(e)}>
                                                        <MenuItem value="open">open</MenuItem>
                                                        <MenuItem value="closed">closed</MenuItem>
                                                        <MenuItem value="progress">
                                                            progress
                                                        </MenuItem>
                                                    </CustomizedSelect>
                                                </FormControl>
                                            )}

                                            <div className="mt-3 mb-3 d-flex justify-content-center">
                                                <button className="btn btn-green">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Modal.Body>

                        </Modal>
                    </>
                )}
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userDetail: state.userDetail,
    };
};

export default connect(mapStateToProps)(IssueDetail);
