import React, { Component } from "react";
import * as actionCreator from "../store/actions/actions";
import { connect } from "react-redux";
import axios from "axios/index";
import { baseUrl } from "../Util/Constants";
import PropTypes from "prop-types";
import SvgIcon from "@mui/material/SvgIcon";
import { makeStyles, withStyles } from "@mui/styles";
import TreeItem from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";

class ProductTreeItemView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fields: {},
            errors: {},
            products: [],
            currentSubProducts: [],
            tree: [],
            open: false,
            selected: false,
            listingExist:false
        };

        this.getSubProducts = this.getSubProducts.bind(this);
        this.setTree = this.setTree.bind(this);
        this.setSelected = this.setSelected.bind(this);
    }

    setSelected(event) {
        var currentProductId = event.currentTarget.dataset.id;

        this.props.triggerCallback(currentProductId);

        // this.setState({
        //     selected:! this.state.selected
        // })
    }

    setOpen=()=> {

        this.setState({
            open: !this.state.open,
        });
    }

    setTree() {
        this.setState({
            tree: [],
        });

        let list = this.state.products;

        let tree = this.state.tree;

        for (let i = 0; i < list.length; i++) {
            if (list[i].is_listable) {
                var treeItem;

                // treeItem={id:list[i].product._key,name:list[i].product.name, sub_products:[]}

                treeItem = {
                    id: list[i]._key,
                    // name: list[i].listing ? list[i].product.name + "(NA)" : list[i].product.name,
                    name: list[i].listing ? list[i].name : list[i].name,

                      sub_products: [],
                    canSelect: list[i].listing ? false : true,
                };

                if (list[i].sub_products&&list[i].sub_products.length > 0) {
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


            this.setState({
                tree: tree,
            });
        }
    }

    componentDidMount() {


    this.getSubProducts()

        // this.getListing()

    }

     getSubProducts() {

        if (this.props.item) {
            let currentProductId = this.props.item.id;


            // let response =  axios.get(baseUrl + "product/" + currentProductId + "/sub-product", {
            //     headers: {
            //         Authorization: "Bearer " + this.props.token,
            //     },
            // });
            //
            // let responseAll = response.data.data;
            //
            // this.setState({
            //     products: responseAll,
            // });

            // this.setTree();


            axios
                .get(baseUrl + "product/" + currentProductId + "/sub-product", {
                    headers: {
                        Authorization: "Bearer " + this.props.token,
                    },
                })
                .then(
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

    }



    checkListingAndParentAndRelease=()=>{

        var currentProductId = this.props.item.id;
        // const url = baseUrl + "seek?name=Product&relation=&count=false&offset=0&size=20&no-from-relation=Listing:listing_of&no-from-relation=ProductRelease:release_for";

        let url=`${baseUrl}seek/to?name=Product&id=${currentProductId}&to=Message&relation=&count=true&filters=type:message`

        axios
            .get(baseUrl + "product/" + currentProductId + "/listing", {
                headers: {
                    Authorization: "Bearer " + this.props.token,
                },
            })
            .then(
                (response) => {
                    var responseAll = response.data.data;

                    this.setState({
                        listingExist: responseAll?true:false,
                    });

                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }
    getListing(event) {




            var currentProductId = this.props.item.id;

            axios
                .get(baseUrl + "product/" + currentProductId + "/listing", {
                    headers: {
                        Authorization: "Bearer " + this.props.token,
                    },
                })
                .then(
                    (response) => {
                        var responseAll = response.data.data;

                        this.setState({
                            listingExist: responseAll?true:false,
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
                <div className={"tree-item-container"} style={{ padding: "2px" }}>
                    <p>

                        <span
                            data-id={this.props.item.id}
                            onClick={!this.state.listingExist ? this.setSelected:null}
                            className={
                                !this.state.listingExist
                                    ? this.props.selected === this.props.item.id
                                        ? "tree-view-item-selected tree-view-item"
                                        : "tree-view-item"
                                    : "tree-view-item text-mute"
                            }>
                            <span className="mr-1">  <span className={"expand-square"}>
                        {this.state.tree.length > 0 &&
                        <>
                            {
                                this.state.open ? (
                                    <MinusSquare
                                        data-id={this.props.item.id}
                                        onClick={this.setOpen}
                                        className="mr-2"
                                    />
                                ) : (
                                    <PlusSquare
                                        data-id={this.props.item.id}
                                        onClick={this.setOpen}
                                        className="mr-2"
                                    />
                                )

                            }
                        </>
                        }
                            </span><span className={"tree-item-name"}>{this.props.item.name}</span></span>
                            {this.state.tree.length>0 &&
                            <>
                            {/*<span className="mr-1">-</span>*/}
                            <span>{"("+this.state.tree.length+")"}</span>
                            </>
                            }
                        </span>
                    </p>
                    {this.state.open &&
                        this.state.tree.map((item,index) => (
                            <React.Fragment key={index}>

                                <div
                                    style={{
                                        marginLeft: "25px",
                                        padding: "0px",
                                        // marginBottom: "5px",
                                    }}>
                                    <ProductTreeItemView
                                        selected={this.props.selected}
                                        triggerCallback={(productId) =>
                                            this.props.triggerCallback(productId)
                                        }
                                        item={item}
                                        token={this.props.token}
                                    />
                                </div>
                            </React.Fragment>
                        ))}
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
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14, color:"#07ad88" }} {...props}>
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
        productList: state.productList,
        siteList: state.siteList,
    };
};

const mapDispachToProps = (dispatch) => {
    return {
        logIn: (data) => dispatch(actionCreator.logIn(data)),
        signUp: (data) => dispatch(actionCreator.signUp(data)),
        showLoginPopUp: (data) => dispatch(actionCreator.showLoginPopUp(data)),
        setLoginPopUpStatus: (data) => dispatch(actionCreator.setLoginPopUpStatus(data)),
        showProductPopUp: (data) => dispatch(actionCreator.showProductPopUp(data)),
        loadProducts: (data) => dispatch(actionCreator.loadProducts(data)),
        loadSites: (data) => dispatch(actionCreator.loadSites(data)),
    };
};
export default connect(mapStateToProps, mapDispachToProps)(ProductTreeItemView);
