import React, { useState, useEffect, useRef } from 'react';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { DUMP } from '../dump';
import { Dialog } from 'primereact/dialog';
import GalleriaComponent from './GalleriaComponent';
import { governDetailRestaurant, governEnrollVisitDate, governFixHygiene, governfixIsVisit, governRestaurantList } from '../api';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';


const DataTableRes = ({ title }) => {
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'restaurant_id': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        'restaurant_name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'is_check_hygiene': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'judgement_grade': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'restaurant_address': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'is_visited_restaurant': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'bz_num': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);
    const dt = useRef(null);

    /**
     * @description 선택된 값 호출
     */
    useEffect(() => {
        console.log(selectedCustomers);
    }, [selectedCustomers])

    /**
     * @description 데이터 fetch
     */
    useEffect(() => {
        _governRestaurantList();
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const _governRestaurantList = async() =>{
        try {
            let res = await governRestaurantList();
            console.log(res.data);
            setCustomers(getCustomers(res.data));
        } catch{ }
    }
    useEffect(()=>{
        // console.log(customers);
    },[customers]);

    const getRandomDate = (start, end) => {
        const startDate = start.getTime();
        const endDate = end.getTime();
          
        return new Date(startDate + Math.random() * (endDate - startDate));
      }
    /**
     * @param {Array<object>} data 
     * @returns 객체 복사 본
     */
    const getCustomers = (data) => {
        return [...data || []].map((d) => {
            // d.date = getRandomDate(new Date(2022, 1, 1), new Date());
            d.date = new Date(d.date);
            return d;
        });
    }


    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const actionBodyTemplate = (value) => {
        return <Button type="button" style={{backgroundColor:'#64748B', borderColor:'#64748B'}} onClick={() => {
            setinspectionModal(true);
            setInspectionResult(value.restaurant_id)
        }}>수정</Button>;
    }

    const actionBodyIsvisitedrestaurant = (value) =>{
        return !value.is_visited_restaurant ? 
        <Button label={'미방문'} className='p-button-danger' onClick={()=>{
            console.log(value)
            setChangeVisit(value);
            setvisibleVisit(true)
        }}/> :
        <Button label={'방문'} className='p-button-success' 
        onClick={()=>{
            console.log(value)
            setChangeVisit(value);
            setvisibleVisit(true)
        }}/>
    }
    const exportCSV = () => { dt.current.exportCSV();}


    const [inspectionResult, setInspectionResult] = useState('');
    const [inspectionModal, setinspectionModal] = useState(false);

    const [visible, setVisible] = useState(false);
    const [visibleVisit, setvisibleVisit] = useState(false);

    const toast = useRef(null);

    const [changeVisit, setChangeVisit] = useState({});

    const renderFooter = () => {
        return (
            <div style={{textAlign:'center'}}>
                <Button label="결과수정" icon="pi pi-search" className='' onClick={() => {
                    // setinspectionModal(false);
                    setVisible(true);
                }} autoFocus />
            </div>
        );
    }

    const acceptVisit = async() =>{
        console.log(changeVisit.is_visited_restaurant);
        let is_visited_restaurant = changeVisit.is_visited_restaurant ? 0 : 1;
        let txt = is_visited_restaurant ? "방문": "미방문";
        console.log(is_visited_restaurant, txt);
        console.log(changeVisit.restaurant_id);
        try {
            let res = await governfixIsVisit(is_visited_restaurant,changeVisit.restaurant_id)
            console.log(res);
            setTimeout(async() => { await _governRestaurantList();}, 300);
        } catch (error) {}
        toast.current.show({ severity: 'info', summary: '결과변경', detail: `detail: 검사결과를 ${txt}으로 변경했습니다.`, life: 3000 });
    }
    
    const rejectVisit = async() =>{
        console.log(changeVisit);
        toast.current.show({ severity: 'warn', summary: '알림', detail: '방문현황 변경을 취소했습니다.', life: 3000 });

    }

    const accept = async() => {
        await _governFixHygiene(inspectionResult,"우수");
        setTimeout(async() => {
            await _governRestaurantList();
        }, 300);
        // let res = await governFixHygiene(inspectionResult, "우수");
        // console.log(res);
        toast.current.show({ severity: 'info', summary: '결과변경', detail: '검사결과를 "우수"으로 변경했습니다.', life: 3000 });
    }

    const reject =  async() => {
        await _governFixHygiene(inspectionResult,"불량");
        setTimeout(async() => {
            await _governRestaurantList();
        }, 300);
        // let res = await governFixHygiene(inspectionResult, "불량");
        // console.log(res)
        toast.current.show({ severity: 'warn', summary: '결과변경', detail: '검사결과를 "불량"으로 변경했습니다.', life: 3000 });
    }

    const _governFixHygiene = async(restaurant_id, judgement_grade) =>{
        console.log("호출")
        try {
            let res = await governFixHygiene(restaurant_id, judgement_grade);
            console.log(res);
            _governRestaurantList();
        } catch (error) {}
    }

    
    const [dateConfigModal, setdateConfigModal] = useState(false);
    const [DateConfigConfirmVisible,setDateConfigConfirmVisible] = useState(false);
    const [inspectorDateModify, setinspectorDateModify] = useState('');
    const [inspectorDateIdModify,setinspectorDateIdModify] = useState('');

    const formatDate = (value) => {
        return value.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    const dateBodyTemplate = (rowData) => {
        // console.log(typeof formatDate(rowData.date));
        // console.log(formatDate(rowData.date));
        if ('1000년 1월 1일' == formatDate(rowData.date)) {
            return <Button style={{marginRight:10}}  label={`${'검사미실시'}`} className='p-button-secondary' onClick={()=>{
                console.log(rowData.restaurant_id);
                setinspectorDateIdModify(rowData.restaurant_id);
                setdateConfigModal(true);
            }} />
        }else if('1111년 11월 11일' == formatDate(rowData.date)){
            return <Button style={{marginRight:10}}  label={`${'날짜설정'}`} className='p-button-secondary' onClick={()=>{
                console.log(rowData.restaurant_id);
                setinspectorDateIdModify(rowData.restaurant_id);
                setdateConfigModal(true);
            }}/>
        }
        return formatDate(rowData.date);
        // return formatDate(rowData.date);
    }

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="yy/mm/dd" placeholder="yyyy/mm/dd" mask="9999/99/99" />
    }



    return (
        <>
        <div className="datatable-doc-demo">
            <div className="card">
                <DataTable 
                    value={customers}
                    ref={dt}
                    paginator
                    className="p-datatable-customers"
                    header={<div className="flex justify-content-between align-items-center">
                        <h5 className="m-0">{title}</h5>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="검색(아이디, 이름, 주소)" />
                        </span>
                            {/* <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} /> */}
                            <Button style={{marginLeft:10}} label="csv로 내보내기" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
                    </div>}
                    rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]}
                    dataKey="id"
                    rowHover
                    selectionMode="single"
                    onSelectionChange={e => setSelectedCustomers(e.value)}
                    filters={filters}
                    filterDisplay="menu"
                    // loading={loading}
                    responsiveLayout="scroll"
                    globalFilterFields={['restaurant_id' ,'restaurant_name','restaurant_address']}
                    emptyMessage="검색결과를 찾을 수 없습니다."
                    currentPageReportTemplate="{first} 부터 {last} 까지 {totalRecords} 총">
                    <Column field="restaurant_id" header="아이디" sortable filter filterPlaceholder="식당아이디 검색" style={{ minWidth: '14rem' }} />
                    <Column header="점검날짜" filterField="date" dataType="date" style={{ minWidth: '10rem' }} body={dateBodyTemplate}
                        filter filterElement={dateFilterTemplate}/>
                   <Column field="restaurant_name" header="식당이름" sortable filterField="restaurant_name" style={{ minWidth: '14rem' }}  filter filterPlaceholder="식당이름 검색" />
                    <Column field="is_check_hygiene" header="위생체크여부" sortable filterField="is_check_hygiene" style={{ minWidth: '14rem' }}  filter filterPlaceholder="위생 체크여부 검색"  body={(value)=> {
                        return !value.is_check_hygiene ? <Button label={'미실시'} className='p-button-danger' /> :<Button label={'실시'} className='p-button-success' />}}/>
                    <Column field="judgement_grade" header="위생등급" sortable filterField="judgement_grade" style={{ minWidth: '14rem' }}  filter filterPlaceholder="위생 등급 검색" />
                    <Column field="restaurant_address" header="식당주소" sortable filterField="restaurant_address" style={{ minWidth: '14rem' }}  filter filterPlaceholder="식당주소 검색" />

                    <Column field="is_visited_restaurant" header="현장방문여부" sortable filterField="is_visited_restaurant" style={{ minWidth: '14rem' }}  filter filterPlaceholder="현장방문여부 검색"  body={actionBodyIsvisitedrestaurant}/>

                    <Column field="bz_num" header="사업자등록번호" sortable filterField="bz_num" style={{ minWidth: '14rem' }}  filter filterPlaceholder="사업자번호 검색" />

                    <Column field="restaurant_id" header="검사결과 수정"  headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
                </DataTable>
            </div>
        </div>

        <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="검사결과를 변경하시겠습니까?"
                    header="알림" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel={'우수'} rejectLabel={'불량'}/>
       
        <ConfirmDialog visible={visibleVisit} onHide={() => setvisibleVisit(false)} message="방문여부를 변경하시겠습니까?"
                    header="알림" icon="pi pi-exclamation-triangle" accept={acceptVisit} reject={rejectVisit} acceptLabel={'예'} rejectLabel={'아니오'}/>
        
        <Toast ref={toast} />

        <Dialog header="위생검사 결과" visible={inspectionModal} style={{ width: '90vw' }} footer={renderFooter} onHide={() => setinspectionModal(false)}>
            <div>
                <GalleriaWraper target={inspectionResult}/>
            </div>
        </Dialog>

        <ConfirmDialog visible={DateConfigConfirmVisible} onHide={() => setDateConfigConfirmVisible(false)} message="날짜를 수정하시겠습니까?"
                    header="날짜변경" icon="pi pi-exclamation-triangle" accept={async()=>{
                        toast.current.show({ severity: 'info', summary: '날짜변경', detail: '날짜를 변경했습니다.', life: 3000 });
                        let res = await governEnrollVisitDate(inspectorDateModify, inspectorDateIdModify);
                        console.log(res);
                        setdateConfigModal(false);
                        setTimeout(() => {
                            setinspectorDateModify('');
                            setinspectorDateIdModify('');
                        }, 500);
                        await _governRestaurantList();
                    }} reject={()=>{
                        toast.current.show({ severity: 'warn', summary: '취소', detail: '날짜변경을 취소합니다.', life: 3000 });
                        setinspectorDateModify('');
                        setinspectorDateIdModify('');
                    }} acceptLabel={'확인'} rejectLabel={'취소'}/>

        <Dialog header="위생검사 날짜설정" visible={dateConfigModal} style={{ width: '90vw' }} onHide={() => setdateConfigModal(false)}>
            <div>
            <Calendar id="datetemplate" 
            onSelect={(e)=>{
                console.log(e.value);
                let dateFormating = new Date(e.value);
                let year = dateFormating.getFullYear(), month = dateFormating.getMonth()+1, date=dateFormating.getDate();
                let sendDate = `${year}-${month < 10 ? '0'+month:month}-${date < 10 ? '0'+date : date}`
                setinspectorDateModify(sendDate);
                setDateConfigConfirmVisible(true);
            }}
        style={{width:'100%'}}  inline showWeek />
            </div>
        </Dialog>
        </>
    );
}

const GalleriaWraper = ({target}) => {

    const [pivot, setPivot] = useState(0);
    const [dataObj, setDataObj] = useState({});

    useEffect(()=>{
        console.log(target);
        _governDetailRestaurant(target);
    },[target]);

    useEffect(()=>{
        if (dataObj.data) {
            if (dataObj.data.videos.length - 1 < pivot) {
                setPivot(dataObj.data.videos.length - 1);
            }else if(0 > pivot){
                setPivot(0);
            }
            console.log(pivot);
        }
    },[pivot]);


    const _governDetailRestaurant = async(value) =>{
        try {
            let res = await governDetailRestaurant(value);
            setDataObj(res);
            console.log(res.data.judgement_grade);
        } catch (error) {}
    }
    
    const render = dataObj.data ? dataObj.data.videos.map((value,index,arr)=><GalleriaComponent index={index} pivot={pivot} value={value} judgementGrade={dataObj.data.judgement_grade}/>) : <></>
    return(
        <div style={{display:'flex', alignItems:'center',justifyContent:'space-around', flexDirection:'row', }}>                
            <Button className='p-button-rounded' icon="pi pi-arrow-left" onClick={()=> setPivot(prev => prev - 1)}/>
            {render}
            <Button  className='p-button-rounded' icon="pi pi-arrow-right" onClick={()=> setPivot(prev => prev + 1)}/>
        </div>
    );
}

export default DataTableRes;