import { useState, useEffect } from "react";
import axios from "axios";
import reactStringReplace from "react-string-replace";
import { baseUrl, ORG_REGEX, SEARCH_REGEX, PRODUCT_REGEX, EVENTS_STATUS_REGEX, SITE_RELEASE_REGEX, ISSUE_REGEX, CYCLE_REGEX, MATCH_REGEX, PRODUCT_RELEASE_REGEX, SERVICE_AGENT_CHANGE_REGEX, PRODUCT_REGISTRATION, A_TAG_REGEX, LISTING_REGEX } from "../../Util/Constants";
import { Link } from 'react-router-dom';
import GlobalDialog from "../RightBar/GlobalDialog";
import SubproductItem from "../Products/Item/SubproductItem";
import OrgComponent from "../Org/OrgComponent";

const ReactStringReplaceWithRegex = ({ text, entityKey, messageKey }) => {
    const [productDialog, setProductDialog] = useState(false);

    const markMessageRead = async (key) => {
        if (!key) return;

        try {
            const result = await axios.post(`${baseUrl}message/read`, { msg_id: key });

            if (result.status === 200) {
                //     TODO let use know message marked read
                console.log("message read");
            }
        } catch (e) {
            console.log("markMessageRead error ", e);
        }
    };

    const handleReactStringReplace = (textToReplace) => {

        if (!textToReplace) return;

        let replacedText;

        replacedText = reactStringReplace(textToReplace, ORG_REGEX, (match, i) => (
            <OrgComponent key={`${i}_${match}`} orgId={match.replace("Org/", "")} />
        ));

        replacedText = reactStringReplace(replacedText, PRODUCT_REGEX, (match, i) => (
            <span
                key={`${i}_${match}`}
                style={{ borderBottom: "1px solid var(--lc-green)" }}
                onClick={() => {
                    setProductDialog(true);
                    markMessageRead(messageKey);
                }}>
                View Product
            </span>
        ));

        replacedText = reactStringReplace(replacedText, CYCLE_REGEX, (match, i) => (
            <Link
                style={{ borderBottom: "1px solid var(--lc-green)" }}
                key={`${i}_${match}`}
                to={`cycle/${match}`}
            // onClick={markMessageRead(messageKey)}
            >
                Cycle
            </Link>
        ));

        // replacedText = reactStringReplace(replacedText, MATCH_REGEX, (match, i) => (
        //     <GetMatch userDetail={this.props.userDetail} i={i} match={match} />

        // ));

        replacedText = reactStringReplace(replacedText, PRODUCT_RELEASE_REGEX, (match, i) => (
            <Link
                key={`${i}_${match}`}
                to="/approve?tab=0"

            >
                To Approvals Page
            </Link>
        ));

        replacedText = reactStringReplace(replacedText, SERVICE_AGENT_CHANGE_REGEX, (match, i) => (
            <Link
                key={`${i}_${match}`}
                to="/approve?tab=2"

            >
                To Approvals Page
            </Link>
        ));

        replacedText = reactStringReplace(replacedText, PRODUCT_REGISTRATION, (match, i) => (
            <Link
                key={`${i}_${match}`}
                to="/approve?tab=1"

            >
                To Approvals Page
            </Link>
        ));

        replacedText = reactStringReplace(replacedText, A_TAG_REGEX, (match, i) => (
            <Link
                key={`${i}_${match}`}
                to="/account?page=system-users"

            >
                User Approvals
            </Link>
        ))

        replacedText = reactStringReplace(replacedText, LISTING_REGEX, (match, i) => (
            <Link
                key={`${i}_${match}`}
                to={`/${match}`}
            >
                Listing
            </Link>
        ));

        replacedText = reactStringReplace(replacedText, SEARCH_REGEX, (match, i) => (
            <Link
                key={`${i}_${match}`}
                to={`/search/${match}`}

            >
                Search
            </Link>
        ));

        replacedText = reactStringReplace(replacedText, EVENTS_STATUS_REGEX, (match, i) => (
            <Link
                key={`${i}_${match}`}
            // onClick={() => { this.showStageEventPopup(match) }}
            >
                View Event
            </Link>
        ));

        replacedText = reactStringReplace(replacedText, ISSUE_REGEX, (match, i) => (
            <Link
                key={`${i}_${match}`}
                to={`/issue/${match}`}
            >
                Issue
            </Link>
        ));

        replacedText = reactStringReplace(replacedText, SITE_RELEASE_REGEX, (match, i) => (
            <Link
                key={`${i}_${match}`}
                to={"/approve?tab=3"}
            >
                Site Approvals
            </Link>
        ));

        return <div>{replacedText && replacedText}</div>;
    };

    return (
        <>
            {handleReactStringReplace(text && text)}

            <GlobalDialog
                size="md"
                removePadding
                hideHeader
                show={productDialog}
                hide={() => setProductDialog(false)}>
                <div className="col-12">
                    <SubproductItem hideMoreMenu hideDate smallImage={true} productId={entityKey} />
                </div>
            </GlobalDialog>


        </>
    );
};

export default ReactStringReplaceWithRegex;

const GetMatch = (props) => {

    const [data, setData] = useState(null)
    const [listing, setListing] = useState(null)
    const [search, setSearch] = useState(null)
    useEffect(() => {


        axios
            .get(`${baseUrl}match/${props.match}`)
            .then((res) => {

                setData(res.data.data)


                if (props.userDetail.orgId === res.data.data.listing.org._id) {
                    setListing(res.data.data.listing.listing)
                }
                else if (props.userDetail.orgId === res.data.data.search.org._id) {
                    setSearch(res.data.data.search.search)
                }


            })
            .catch((error) => {

            });
    }, [props.match, props.userDetail.orgId])


    return <>

        {data ? <Link
            key={`${props.i}_${props.match}`}
            to={`/${listing ? listing._key : search ? "search/" + search._key : ""}`}
        >
            Match
        </Link> : ""}
    </>
};
