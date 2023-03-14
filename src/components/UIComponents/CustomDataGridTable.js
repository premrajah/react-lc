import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    useGridApiContext,
    useGridSelector
} from '@mui/x-data-grid';
import {styled} from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ActionIconBtn from "../FormsUI/Buttons/ActionIconBtn";
import {Delete} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {capitalize, getTimeFormat} from "../../Util/GlobalFunctions";
import {Link} from "react-router-dom";
import MapIcon from "@mui/icons-material/Place";


const CustomDataGridTable=({headers,pageSize,count,actions,loading,loadMore,checkboxSelection,actionCallback, items,element,children, ...otherProps}) =>{

    const [tableHeader,setTableHeader] = useState([]);
    const [list,setList] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [listLoading, setListLoading] = React.useState(false);
    const [sortData, setSortData] = React.useState(null);
    const [visibleFields, setVisibleFields] = React.useState({});

    const [initialHeaderState, setInitialHeaderState] = React.useState(false);

    const [sortModel, setSortModel] = React.useState();
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: pageSize,
        page: 0,
    });

    const [rowCountState, setRowCountState] = React.useState(count);
    React.useEffect(() => {
        setRowCountState((prevRowCountState) =>
            count !== undefined ? count : prevRowCountState,
        );
    }, [count, setRowCountState]);



    useEffect(() => {

        setListLoading(loading)
    },[loading])

    useEffect(() => {

        let headersTmp=[]
        let fields={}
        headers.forEach((item)=>{

            if (!item.visible)
            fields[item.field]=item.visible

            headersTmp.push({
                field: item.subField?item.subField:item.field,
                headerName: item.label,
                editable:false,
                sortable:item.sortable,
                sortingOrder:item.sortingOrder?item.sortingOrder:['asc', 'desc', null],
                // hide:!item.visible,
                // hideable: !item.visible,
                flex:item.flex?item.flex:1,
                // colSpan: `${item.field==="category"?3:1}`,
                // minWidth:`${item.field==="category"?300:50}`,
                // flex:`${item.field==="category"?1:0.5}`,
                // minWidth:50,
                // maxWidth:"unset",
                renderCell: (params) => (
<>
                    {params.field=="_ts_epoch_ms" ? <span>
                            {getTimeFormat(params.value)}
                    </span>:

                            params.field==="name" ? <span className="text-blue">
                                     <Link to={`/product/${params.row.id}`}>{params.value}</Link>
                    </span>:
                        params.field==="year_of_making" ? <span>
                            {(params.value===0?"":params.value)}
                    </span>:

                        params.field==="category" ? <GetCatBox item={params.row} />:
                        params.value}
</>
                ),

            })

        })


        setVisibleFields(fields)



        if (actions&&actions.length>0) {

    headersTmp.push({
                    field: "action-key",
                    headerName: "Actions",
                    editable: false,
                    sortable: false,
        hide:false,
        hideable: false,
        flex:1,
             //       minWidth: 60,
             // flex:1,
                    renderCell: (params) => (
                        <>
                            {actions.map((action)=>

                                <ActionIconBtn
                                    onClick={()=>actionCallback(params.row.id,action)}
                                >
                                    {action=="edit"?<EditIcon />:action=="view"?<VisibilityIcon/>:action=="delete"?<Delete/>:action=="map"?<MapIcon/>:action}
                                </ActionIconBtn>

                            )}

                        </>
                    ),
                })


        }
        setTableHeader(headersTmp)

        setSortModel(headers.filter(item=>item.sort))




    }, [])

    useEffect(() => {

        // if (items.length>list.length){


        let listTmp=[]

        items.forEach((listItem)=>{
            let Product=listItem.Product
            let itemTmp={}

            headers
                .forEach((item)=>{
                    try {

                    if (item.subField){
                        itemTmp[`${item.subField}`] = Product[`${item.field}`][`${item.subField}`]
                    }else{
                        itemTmp[`${item.field}`]=Product[`${item.field=="id"?"_key":item.field}`]
                    }
                    }catch(e){
                      console.log(e)

                    }
                })


            listTmp.push(itemTmp)
        })

        setList(listTmp)
        // console.log(itemsTmp)

        // }
    }, [items])

    const handleChange=(data)=>{

        setSortModel(data)

     console.log("Sort modal",data)

        if (loadMore&&data.length>0){

            let filter={
                key:data[0].field=="id"?"_key":data[0].field,
                sort:data[0].sort
            }


            console.log(data.field=="id"?"_key":data.field, data.sort)
            loadMore(true,filter)


        }

    }


    const handlePopoverOpen = (event) => {
        const field = event.currentTarget.dataset.field
        const id = event.currentTarget.parentElement.dataset.id;
        const row = list.rows.find((r) => r.id === id);
        setValue(row[field]);
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
       <>
           {/*<Box sx={{ height: "90vh", minWidth: '100%' }}>*/}
           <div style={{  height: '90vh',width:"100%" ,flex:1}}>
               {/*<div style={{  width:"100%"}}>*/}


               <DataGrid

                   columnVisibilityModel={visibleFields}
                   // initialState={{
                   //
                   //     // columns: {
                   //     //     columnVisibilityModel: {
                   //     //         // Hide columns status and traderName, the other columns will remain visible
                   //     //         description: false,
                   //     //         id:false,
                   //     //         type:false,
                   //     //         state:false,
                   //     //
                   //     //     },
                   //     // },
                   // }}

                   disableColumnMenu={true}
                   onPageChange={(newPage) => {

                           setPage(newPage)
                           loadMore(false,sortData,newPage)


                   }}
                   onPageSizeChange={(newPageSize) => {
                       alert("page size "+newPageSize)

                        }}
                   // autoPageSize
                   sortModel={sortModel}
                   // onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
                   onSortModelChange={(model) => handleChange(model)}
                   sortingMode="server"
                   rowCount={rowCountState}
                   rows={list}
                   columns={tableHeader}
                   pageSize={pageSize}
                   loading={listLoading||list.length===0}
                   rowsPerPageOptions={[pageSize]}
                   checkboxSelection={checkboxSelection}
                   disableSelectionOnClick
                   experimentalFeatures={{ newEditingApi: true }}
                   paginationMode="server"
                   paginationModel={paginationModel}
                   onPaginationModelChange={setPaginationModel}
               />


               </div>
           {/*</div>*/}

           {/*    <div style={{ display: 'flex', height: '90vh' }}>*/}
           {/*        <div style={{ flexGrow: 1 }}>*/}
           {/*    <CustomToolbarGrid/>*/}
           {/*</div>*/}
           {/*    </div>*/}
           {/*</Box>*/}
       </>
    );
}



function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            {/*<GridToolbarFilterButton />*/}
            {/*<GridToolbarDensitySelector />*/}
            {/*<GridToolbarExport />*/}
        </GridToolbarContainer>
    );
}





const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
}));

function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                width="120"
                height="100"
                viewBox="0 0 184 152"
                aria-hidden
                focusable="false"
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                        <ellipse
                            className="ant-empty-img-5"
                            cx="67.797"
                            cy="106.89"
                            rx="67.797"
                            ry="12.668"
                        />
                        <path
                            className="ant-empty-img-1"
                            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                        />
                        <path
                            className="ant-empty-img-2"
                            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                        />
                        <path
                            className="ant-empty-img-3"
                            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                        />
                    </g>
                    <path
                        className="ant-empty-img-3"
                        d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                    />
                    <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                    </g>
                </g>
            </svg>
            <Box sx={{ mt: 1 }}>No Rows</Box>
        </StyledGridOverlay>
    );
}







function CustomPagination(props) {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);



    return (
        <Pagination
            color="primary"
            variant="outlined"
            shape="rounded"
            page={page + 1}
            count={pageCount}
            // @ts-expect-error
            renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
            // onChange={(event, value) => {apiRef.current.setPage(value - 1)}}
        />
    );
}




const GetCatBox=(props)=>{

    // console.log(props.item)
    return(

        <span  className="text-capitlize mb-1 text-12 text-bold cat-box text-left p-1">
                                <span className="text-capitlize">
                                    {capitalize(props.item.category)}
                                </span>
                                <span className={"m-1 arrow-cat"}>&#10095;</span>
                                <span className=" text-capitlize">
                                    {capitalize(props.item.type)}
                                </span>
                                <span className={"m-1 arrow-cat"}>&#10095;</span>
                                <span className="  text-capitlize">
                                    {capitalize(props.item.state)}
                                </span>
                            </span>
    )
}



export default (CustomDataGridTable);







