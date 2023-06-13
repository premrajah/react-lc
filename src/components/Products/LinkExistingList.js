import {v4 as uuid} from "uuid";
import DynamicSelectArrayWrapper from "../FormsUI/ProductForm/DynamicSelect";
import {baseUrl} from "../../Util/Constants";
import DeleteIcon from "@mui/icons-material/Delete";
import {useEffect, useState} from "react";

const LinkExistingList=(props)=>{


    // const [existingProductItems,existingItems]=useState([])
    // useEffect(()=>{
    //
    //     existingItems(props.existingItems)
    // },[props.existingItems])

    return props.existingItems.map((val, index) => {

        return (
            <>
<DynamicAutoCompleteBox
    {...props}
    val={val}
    uId={val.index}
    index={index}
/>
            </>)


    } )
}


const DynamicAutoCompleteBox=(props)=> {


    return (
        <>

                <div id={props.val.index} key={props.val.index} className="row mt-2">

                <div className="col-11">

                    <DynamicSelectArrayWrapper
                        filterData={props.filters}
                        api={""}
                        errorNoMessage={props.val.error}
                        apiUrl={props.apiUrl}

                        option={props.option}
                        subOption={props.subOption}
                        searchKey={props.searchKey}
                        valueKey={props.valueKey}
                        subValueKey={props.subValueKey}

                        // title="Select Product"
                        name={`product[${props.index}]`}
                        onChange={(value,valueText) => {
                            props.handleChange(value, valueText,props.field,props.uId,props.index);

                        }}
                        initialValue={props.val.value}
                        initialValueTextbox={props.val.valueText}

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

export default LinkExistingList