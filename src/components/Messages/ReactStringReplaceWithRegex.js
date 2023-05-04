import reactStringReplace from "react-string-replace";
import { baseUrl, PRODUCT_REGEX } from "../../Util/Constants";
import axios from "axios";
import GlobalDialog from "../RightBar/GlobalDialog";
import { useState } from "react";
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
        let replacedText;

        replacedText = reactStringReplace(textToReplace, ORG_REGEX, (match, i) => (
            <OrgComponent key={`${i}_${match}`} orgId={match.replace("Org/","")} />
        ));

        replacedText = reactStringReplace(textToReplace, PRODUCT_REGEX, (match, i) => (
            <span
                key={`${i}_${match}`}
                style={{borderBottom: "1px solid var(--lc-green)"}}
                onClick={() => {
                    setProductDialog(true);
                    markMessageRead(messageKey);
                }}>
                View Product
            </span>
        ));

        return <div>{replacedText}</div>;
    };

    return (
        <>
            {handleReactStringReplace(text)}

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
