import {v4 as uuid} from "uuid";
import DynamicSelectArrayWrapper from "../FormsUI/ProductForm/DynamicSelect";
import {baseUrl} from "../../Util/Constants";
import DeleteIcon from "@mui/icons-material/Delete";
import {useEffect, useState} from "react";

const LinkExistingProductList=(props)=>{

    return props.existingProductItems.map((val, index) => {

        return (
            <>
<DynamicAutoCompleteBox

    deleteItem={props.deleteItem} val={val} handleChange={props.handleChange} uId={val.index} index={index}/>
            </>)


    } )
}


const DynamicAutoCompleteBox=(props)=> {


    const [visible, setVisible] = useState(true)
    const [value, setValue] = useState("")
    const [textValue, setTextValue] = useState("")


    useEffect(()=>{


    },[])

    return (
        <>

                <div id={props.val.index} key={props.val.index} className="row mt-2">

                <div className="col-11">

                    <DynamicSelectArrayWrapper

                        api={""}
                        errorNoMessage={props.val.error}
                        apiUrl={baseUrl + "seek?name=Product&no_parent=true&count=false"}
                        option={"Product"}
                        subOption={"name"}
                        searchKey={"name"}
                        valueKey={"Product"}
                        subValueKey={"_key"}
                        title="Select Product"
                        name={`product[${props.index}]`}
                        onChange={(value,valueText) => {
                            props.handleChange(value, valueText,`product`,props.uId,props.index);

                        }}
                        initialValue={props.val.product}
                        initialValueTextbox={props.val.productText}

                    />


                </div>


                <div
                    className="col-1 text-center"
                    style={{display: "flex"}}>
                    {/*{item > 1 && (*/}
                    <>
                        <DeleteIcon
                            classname={"click-item"}
                            style={{
                                color: "#ccc",
                                margin: "auto",
                            }}

                            onClick={()=>{
                                // setVisible(false);
                                props.deleteItem(props.val)
                            }}
                            // onClick={() => }
                        />
                    </>
                    {/*)}*/}
                </div>
            </div>

        </>
    )
}

export default LinkExistingProductList