import DeleteIcon from "@mui/icons-material/Delete";
import React, {useEffect, useState} from "react";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";

const ProcessesList=(props)=>{


    const [list,setList]=useState([])
    useEffect(()=>{
       setList(props.list)
    },[props.list])

    return props.existingItems.map((item, index) => {

        return (
            <React.Fragment key={item.index+"-box"}>
<DynamicAutoCompleteBox
    {...props}
    item={item}
    uId={item.index}
    index={index}
    list={list}
    errors={props.errors[item.index]}


/>
            </React.Fragment>)


    } )
}


const DynamicAutoCompleteBox=(props)=> {




    return (
        <>

                <div id={props.item.index} key={props.item.index} className="carbon-list row g-0 mt-2">

                <div className="col-11 ">
                    <div className={"row g-0"}>
                    <div className="col-md-3 col-sm-12">

                            <TextFieldWrapper
                                noMargin
                                error={props.errors?.name}
                                editMode
                                initialValue={props.item.fields?.name}
                                details="Name"
                                placeholder={""}
                                // readonly ={this.state.disableVolume}
                                // initialValue={this.props.item&&this.props.item.product.volume+""}
                                // value={this.state.disableVolume?"0":""}
                                onChange={(value,valueText)=>
                                    // props.handleChange(value, value,`unit[${props.index}]`,props.uId,props.index)

                                    props.handleChange(value, valueText,`name`,props.uId,props.index)

                                }

                                // error={this.state.errors["percentage"]}


                                name="name" title="Name"
                                // explanation={"Percentage value e.g 20"}
                            />

                     </div>


                        <div className={"col-md-2 col-sm-12 col-xs-12"}>
                            <TextFieldWrapper
                                error={props.errors?.kwh}
                                noMargin
                                numberInput
                                editMode
                                initialValue={props.item.fields?.kwh}
                                details=""
                                placeholder={""}

                                onChange={(value,valueText)=>
                                    // props.handleChange(value, value,`unit[${props.index}]`,props.uId,props.index)
                                    props.handleChange(value, valueText,`kwh`,props.uId,props.index)
                                }

                                name="kwh" title="Kwh"
                            />
                        </div>

                    <div className={"col-md-2 col-sm-12 col-xs-12"}>

                        <SelectArrayWrapper
                            error={props.errors?.source_id}
                            option={"name"}
                            valueKey={"_id"}
                            editMode
                            disableAutoLoadingIcon
                            initialValue={props.item.fields?.source_id}

                            onChange={(value,valueText)=> {

                                props.handleChange(value, valueText,`source_id`,props.uId,props.index);

                            }}
                            select={"Select"}
                            disabled={ (props.list.length > 0 )? false : true}
                            options={props.list?props.list:[]} name={"source_id"}
                            title="Energy Source"

                        />
                    </div>

                        </div>


                </div>


                <div
                    className="col-1 text-center"
                    style={{display: "flex"}}>
                    {/*{item > 1 && (*/}
                    <>
                        <DeleteIcon
                            className={"click-item"}
                            style={{
                                color: "#ccc",
                                margin: "auto",
                            }}

                            onClick={()=>{
                                // setVisible(false);
                                props.deleteItem(props.item)
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

export default ProcessesList