import React from "react";
import TextFieldWrapper from "../../FormsUI/ProductForm/TextField";
import DynamicSelect from "../../FormsUI/ProductForm/DynamicSelect";
import DynamicSelectArrayWrapper from "../../FormsUI/ProductForm/DynamicSelect";
import {baseUrl} from "../../../Util/Constants";
const DynamicInput = props => {
    return props.fields.map((val, idx) => {



        let name = `name-${idx}`,
            author = `author-${idx}`,
            dateOfPublish = `dateOfPublish-${idx}`,
            type = `type-${idx}`,
            price = `price-${idx}`;
        return (


            <>
                {val.type==="text"?<TextFieldWrapper name={val.key}/>:
                    val.type==="dynamicselect"?<DynamicSelectArrayWrapper
                            name={val.key}
                                                                            onChange={(value)=>this.handleChangeProduct(value,`deliver`)}
                                                                            api={""}
                                                                            error={this.state.errors[`deliver`]}

                            // options={this.props.siteList}
                                                                            apiUrl={baseUrl+"seek?name=Site&no_parent=true&count=false"}
                                                                            option={"Site"}
                                                                            subOption={"name"}
                                                                            searchKey={"name"}
                                                                            valueKey={"Site"}
                                                                            subValueKey={"_key"}
                                                                            title="Dispatch / Collection Address"
                                                                            details="Select product’s location from the existing sites or add new address below"
                                                                            initialValue={this.props.item&&this.props.item.site._key}
                                                                            initialValueTextbox={this.props.item&&this.props.item.site.name}

                        />:
                        val.type==="multiple"?

                            <MultipleSelectfields fields={val.fields}  name={val.key} />

                            : <></>}
                }


            {/*<div className="form-row d-flex flex-row justify-content-center align-items-center   " key={val.index}>*/}
            {/*    <div className="col-2">*/}
            {/*        <label>Field 1</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            className="form-control required"*/}
            {/*            // placeholder="Name"*/}
            {/*            name="name"*/}
            {/*            data-id={idx}*/}
            {/*            id={name}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div className="col-2">*/}
            {/*        <label>Field 2</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            className="form-control required"*/}

            {/*            name="author"*/}
            {/*            id={author}*/}
            {/*            data-id={idx}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div className="col-2">*/}
            {/*        <label>Field 3</label>*/}
            {/*        <select className="form-control" name="type" id={type} data-id={idx}>*/}
            {/*            <option>Select</option>*/}
            {/*            <option>Biography</option>*/}
            {/*            <option>Cooking</option>*/}
            {/*            <option>Computer Programming</option>*/}
            {/*            <option>Dictionary</option>*/}
            {/*            <option>Fiction</option>*/}
            {/*            <option>Horror</option>*/}
            {/*            <option>Journalism</option>*/}
            {/*        </select>*/}
            {/*    </div>*/}
            {/*    <div className="col-2">*/}
            {/*        <label>Date of Publish</label>*/}
            {/*        <input*/}
            {/*            type="date"*/}
            {/*            className="form-control"*/}
            {/*            name="dateOfPublish"*/}
            {/*            id={dateOfPublish}*/}
            {/*            data-id={idx}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div className="col-2">*/}
            {/*        <label>Field 4</label>*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            className="form-control"*/}
            {/*            name="price"*/}
            {/*            id={price}*/}
            {/*            data-id={idx}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div className="col-2 ">*/}
            {/*        {idx === 0 ? (*/}
            {/*            <button*/}
            {/*                onClick={() => props.add()}*/}
            {/*                type="button"*/}
            {/*                className="btn btn-primary text-center"*/}
            {/*            >*/}
            {/*                <i className="fa fa-plus-circle" aria-hidden="true" />*/}
            {/*            </button>*/}
            {/*        ) : (*/}
            {/*            <button*/}
            {/*                className="btn btn-danger"*/}
            {/*                onClick={() => props.delete(val)}*/}
            {/*            >*/}
            {/*                <i className="fa fa-minus" aria-hidden="true" />*/}
            {/*            </button>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</div>*/}

            </>
        );
    });
};


const MultipleSelectfields=(props)=>{

    return props.fields.map((val, idx) => {



        let name = `${val.key}-${idx}`,
            author = `author-${idx}`,
            dateOfPublish = `dateOfPublish-${idx}`,
            type = `type-${idx}`,
            price = `price-${idx}`;


        return (
            <>
                {val.type==="text"?<TextFieldWrapper name={name}/>:
                    val.type==="dynamicselect"?
                        <DynamicSelectArrayWrapper
                            onChange={(value)=>this.handleChangeProduct(value,`deliver`)}
                            api={""}
                            error={this.state.errors[`deliver`]}
                            // options={this.props.siteList}
                            apiUrl={baseUrl+"seek?name=Site&no_parent=true&count=false"}
                            option={"Site"}
                            subOption={"name"}
                            searchKey={"name"}
                            valueKey={"Site"}
                            subValueKey={"_key"}
                            title="Dispatch / Collection Address"
                            details="Select product’s location from the existing sites or add new address below"
                            initialValue={this.props.item&&this.props.item.site._key}
                            initialValueTextbox={this.props.item&&this.props.item.site.name}
                            name={name} />:
                        val.type==="multiple"?

                            <MultipleSelectfields fields={val.fields}  name={name} />



                            : <></>}

            </>
        )

})
}
export default DynamicInput;
