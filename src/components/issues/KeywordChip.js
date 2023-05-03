import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {OverlayTrigger, Popover} from "react-bootstrap";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';

import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const KeywordChip = (props) => {

    const [keyword,setKeyword]= useState(props.org);
    const [checked, setChecked] = React.useState(props.selected);

    // let timeout=0
    const handleChange = (event) => {
        setChecked(event.target.checked);
        // if (timeout) clearTimeout(timeout);
        //
        // timeout = setTimeout(() => {

            props.onChange(keyword.name,event.target.checked)

        // }, 200);



    };

    useEffect(()=>{

        if (props.item) {

            setKeyword(props.item)


        }
        if (props.name){

            fetchKeyword(props.name)
        }

    },[])

    const   fetchKeyword=(name)=> {
        axios
            .get(baseUrl + "issue/no-auth/keyword/"+name)
            .then(
                (response) => {

                    setKeyword(response.data.data)

                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }

    const   handleDelete=(org)=> {
        axios
            .get(baseUrl + "org/"+org   )
            .then(
                (response) => {

                    setKeyword(response.data.data.org)

                },
                (error) => {
                    // var status = error.response.status
                }
            );
    }


    const orgPopover = (
        <Popover id="org-popover">
            {keyword&&
            <div className={"p-3"}>

                <span className={"title-bold"} style={{ textTransform: "capitalize" }}>{keyword.name}</span>
<br/>
            {keyword.description && (
               <>
                <span className={"text-gray-light  "}>

                                {keyword.description}
                       </span>
                   <br/>
                    {/*<span className={"text-gray-light  "}>Email: <span className={"text-pink"}>{org.email }</span></span>*/}
               </>
            )}
            </div>}
        </Popover>
    );

    // if (!props.org) {
    //     return "";
    // }

    return (
        <>
            {keyword &&
            <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
                <div
                    className=" text-gray-light "
                    style={{
                        textTransform: "capitalize",
                        fontWeight: "700",
                        // color : "#444",
                    }}><span className={"sub-title-text-pink"}>
                    {!props.disableClick ?
                    <Checkbox

                        checked={checked}
                        onChange={handleChange}

                        {...label} icon={<Chip


                        label={keyword.name}/>}
                        checkedIcon={<Chip
                            label={keyword.name} style={{
                            color: "white",
                            background: `${keyword.avoidability === "unavoidable" ? "#0F835E" : "#07ad88"}`,
                        }} label={keyword.name} avatar={<DoneIcon style={{color: "white"}}
                        />}
                        />}/>:
                    <>
                        <Chip
                            size="small"
                            className="me-1 mb-1"
                            label={keyword.name}
                            style={{
                            color: "white",
                            background: `${keyword.avoidability === "unavoidable" ? "#0F835E" : "#07ad88"}`,
                        }}
                            label={keyword.name} avatar={<DoneIcon style={{color: "white"}}
                        />}
                        />
                    </>

                    }
                    </span>
                </div>
                <OverlayTrigger
                    trigger={ ["hover", "focus"]}
                    placement={"bottom"}
                    overlay={orgPopover}
                >
                    <>
                    {/*<Info*/}
                    {/*    style={{ cursor: "pointer", color: "#d7d7d7" }}*/}
                    {/*    fontSize={"small"}*/}
                    {/*/>*/}

                    </>
                </OverlayTrigger>
            </div>
            }
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        userDetail: state.userDetail,
        isLoggedIn: state.isLoggedIn,
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps)(KeywordChip);
