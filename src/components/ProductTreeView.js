import React, { Component } from "react";
import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import PropTypes from "prop-types";
import SvgIcon from "@material-ui/core/SvgIcon";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import ProductTreeItemView from "./ProductTreeItemView";
import TextField from "@material-ui/core/TextField";
import {Spinner} from "react-bootstrap";

class ProductTreeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: {},
            errors: {},
            products: [],
            currentSubProducts: [],
            tree: [],
            filteredList: [],
            selectedProductId: null,
        };

        this.getItems = this.getItems.bind(this);
        this.getSubProducts = this.getSubProducts.bind(this);
        this.setTree = this.setTree.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    productSelected(productId) {
        this.setState({
            selectedProductId: productId,
        });

        this.props.triggerCallback(productId);
    }

    handleChange(field, e) {
        let fields = this.state.fields;

        fields[field] = e.target.value;

        this.setState({ fields });

        this.setState({
            price: fields["price"],
        });

        if (field === "product") {
            this.setState({
                productSelected: e.target.value,
            });

            this.getPreviewImage(e.target.value);
        }

        if (field === "deliver") {
            this.setState({
                siteSelected: this.state.sites.filter((item) => item._key === e.target.value)[0],
            });
        }

        if (this.state.page === 1) {
            this.handleValidateOne();
        }

        if (this.state.page === 2) {
            this.handleValidateTwo();
        }
    }


    setTree() {


        console.log("called")

            let list = this.props.items


            let tree = this.state.tree;

            for (let i = 0; i < list.length; i++) {
                // if (!list[i].parent_product&&!list[i].listing) {
                if (list[i].is_listable) {
                    var treeItem;

                    // treeItem = { id: list[i].product._key, name:list[i].listing? list[i].product.name +"(NA)":list[i].product.name,
                    treeItem = {
                        id: list[i]._key,
                        name: list[i].listing ? list[i].name : list[i].name,
                        sub_products: [],
                        canSelect: list[i].listing ? false : true,
                    };

                    if (list[i].sub_products && list[i].sub_products.length > 0) {
                        var sub_products = [];

                        for (let k = 0; k < list[i].sub_products.length; k++) {
                            sub_products.push({
                                id: list[i].sub_products[k]._key,
                                name: list[i].sub_products[k].name,
                            });
                        }

                        treeItem.sub_products = sub_products;
                    }

                    tree.push(treeItem);
                }
            }
            console.log("tree")
            console.log(tree)
            this.setState({
                tree: tree,
                filteredList: tree,
            });

    }

    componentDidMount() {
        // this.getItems();


        this.setTree()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps!=this.props){
            console.log("change detected")
            this.setTree()
        }
    }

    getItems() {
        axios.get(baseUrl + "product/no-parent").then(
            (response) => {
                var responseAll = response.data.data;

                this.setState({
                    products: responseAll,
                });
                this.setTree();
            },
            (error) => {
                // var status = error.response.status
            }
        );
    }

    handleSearch(field, e) {
        // let fields = this.state.fieldsSite;
        // fields[field] = e.target.value;
        // this.setState({ fields: fields });

        var products = this.state.tree.filter((item) => {
            if (e.target.value.length === 0) {
                return item;
            } else if (item.name.toLowerCase().includes(e.target.value.toLowerCase())) {
                return item;
            }
        });

        this.setState({
            filteredList: products,
        });
    }

    getSubProducts() {
        var currentProductId = "j2D6JU2oIU";

        axios.get(baseUrl + "product/" + currentProductId + "/sub-product/expand").then(
            (response) => {
                var responseAll = response.data.data;

                this.setState({
                    products: responseAll,
                });
            },
            (error) => {
                // var status = error.response.status
            }
        );
    }

    render() {
        // const classes = useStyles();
        const classes = withStyles();
        const classesBottom = withStyles();

        return (
            <>
                <div className="row  mb-4">
                    <div className="col-md-12 col-sm-6 col-xs-12 ">
                        <div className={"row tree-menu-container "}>
                            <div className={"col-12"}>
                                <TextField
                                    id="outlined-basic"
                                    label="Search products here .... "
                                    variant="outlined"
                                    fullWidth={true}
                                    name={"name"}
                                    onChange={this.handleSearch.bind(this, "name")}
                                />
                                {this.props.items.length===0&&   <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{color:"#07AD88"}}
                                    className={"spinner-select"}
                                />}
                            </div>
                            <div className={"col-12"}>
                                <div className={"row tree-view-menu"}>
                                    {this.state.filteredList.map((item) => (
                                        <>
                                            <div className={"col-12"}>
                                                <ProductTreeItemView
                                                    selected={this.state.selectedProductId}
                                                    triggerCallback={(productId) =>
                                                        this.productSelected(productId)
                                                    }
                                                    item={item}
                                                    token={this.props.userDetail.token}
                                                />
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

function GetTreeItem({ comment }) {
    const nestedComments = (comment.children || []).map((comment) => {
        return <GetTreeItem key={comment.id} comment={comment} type="child" />;
    });

    return (
        <StyledTreeItem
            nodeId="5"
            labelText={"Nothing "}
            labelInfo="90"
            color="#1a73e8"
            bgColor="#e8f0fe">
            <div>{comment.text}</div>
            {nestedComments}
        </StyledTreeItem>
    );
}

function Comment({ comment }) {
    const nestedComments = (comment.children || []).map((comment) => {
        return <Comment key={comment.id} comment={comment} type="child" />;
    });

    return (
        <div style={{ marginLeft: "25px", marginTop: "10px" }}>
            <div>{comment.text}</div>
            {nestedComments}
        </div>
    );
}

function GetSubItems(props) {
    return (
        <>
            {props.show && (
                <StyledTreeItem
                    nodeId="5"
                    labelText={"Nothing "}
                    labelInfo="90"
                    color="#1a73e8"
                    bgColor="#e8f0fe"></StyledTreeItem>
            )}
        </>
    );
}

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14,color:"#07ad88" }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        "&:hover > $content": {
            backgroundColor: theme.palette.action.hover,
        },
        "&:focus > $content, &$selected > $content": {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: "var(--tree-view-color)",
        },
        "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
            backgroundColor: "transparent",
        },
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        "$expanded > &": {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        "& $content": {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: "inherit",
        color: "inherit",
    },
    labelRoot: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: "inherit",
        flexGrow: 1,
    },
}));

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;

    return (
        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    <Typography variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </div>
            }
            style={{
                "--tree-view-color": color,
                "--tree-view-bg-color": bgColor,
            }}
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
            }}
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
    root: {
        height: 264,
        flexGrow: 1,
        maxWidth: 400,
    },
});

function GmailTreeView() {
    return <></>;
}

const mapStateToProps = (state) => {
    return {
        loginError: state.loginError,
        loading: state.loading,
        isLoggedIn: state.isLoggedIn,
        loginFailed: state.loginFailed,
        showLoginPopUp: state.showLoginPopUp,
        userDetail: state.userDetail,
        loginPopUpStatus: state.loginPopUpStatus,
        showSubProductView: state.showSubProductView,
        showCreateProduct: state.showCreateProduct,
        showCreateSubProduct: state.showCreateSubProduct,
        showProductView: state.loginPopUpStatus,
        siteList: state.siteList,
        productWithoutParentList: state.productWithoutParentList,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),


    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductTreeView);
