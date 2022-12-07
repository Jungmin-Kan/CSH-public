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


import { InputTextarea } from 'primereact/inputtextarea';

const DataTableNoticeComponent = ({title}) => {
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        // 'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'representative': { value: null, matchMode: FilterMatchMode.IN },
        'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        // 'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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
        setCustomers(getCustomers(DUMP));
        setLoading(false)
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    /**
     * @param {Array<object>} data 
     * @returns 객체 복사 본
     */
    const getCustomers = (data) => {
        return [...data || []].map(d => {
            d.date = new Date(d.date);
            return d;
        });
    }

    const formatDate = (value) => {
        return value.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const countryBodyTemplate = (rowData) => {
        return ( <span className="image-text">{rowData.country.name}</span>);
    }

    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.representative;
        return ( <span className="image-text">{representative.name}</span>);
    }

    // 3열 필터
    const representativeFilterTemplate = (options) => {
        return (
            <>
                <div className="mb-3 font-bold">Agent Picker</div>
                <MultiSelect value={options.value} options={[
                { name: "Amy Elsner"},
                { name: "Anna Fali" },
                { name: "Asiya Javayant" },
                { name: "Bernardo Dominic" },
                { name: "Elwin Sharvill" },
                { name: "Ioni Bowcher"},
                { name: "Ivan Magalhaes"},
                { name: "Onyama Limba"},
                { name: "Stephen Shaw"},
                { name: "XuXue Feng"}
            ]} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
            </>
        );
    }

    const representativesItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <span className="image-text">{option.name}</span>
            </div>
        );
    }

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date);
    }

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="yy/mm/dd" placeholder="yyyy/mm/dd" mask="9999/99/99" />
    }


    const statusBodyTemplate = (rowData) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    }

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={[
            'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
        ]} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    }

    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }

    const actionBodyTemplate = (rowData) => {
        return <Button type="button" style={{backgroundColor:'#64748B', borderColor:'#64748B'}} onClick={() => {
            setModifyModal(true);
        }}>공지수정</Button>;
    }
    const exportCSV = () => {
        dt.current.exportCSV();
    }


    const [writeModal, setWriteModal] = useState(false);
    const [modifyModal, setModifyModal] = useState(false);

    const renderModifyFooter = () => {
        return (
            <div style={{textAlign:'center'}}>
                <Button label="취소" icon="pi pi-times" className='p-button-danger' onClick={() => setModifyModal(false)} autoFocus />
                <Button label="수정" icon="pi pi-check" className='p-button-success' onClick={() => setModifyModal(false)} autoFocus />
            </div>
        );
    }
    const renderWriteFooter = () => {
        return (
            <div style={{textAlign:'center'}}>
                <Button label="완료" icon="pi pi-check" className='p-button-success' onClick={() => setWriteModal(false)} autoFocus />
            </div>
        );
    }

    const [content, setContent] = useState('');
    const [noticeTitle, setNoticeTitle] = useState('')

    return (
        <>
        <div className="datatable-doc-demo">
            <div className="card">
                <DataTable value={customers}
                    ref={dt}
                    paginator
                    className="p-datatable-customers"
                    header={<div className="flex justify-content-between align-items-center">
                        <h5 className="m-0">{title}</h5>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="검색" />
                        </span>
                            {/* <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} /> */}
                            <Button style={{marginLeft:10}} label="csv로 내보내기" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
                            <Button style={{marginLeft:10}} label="공지 작성하기" icon="pi pi-upload" className="p-button-help" onClick={()=>{
                                setWriteModal(true);
                            }} />
                    </div>}wd
                    rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]}
                    dataKey="id"
                    rowHover
                    selectionMode="single"
                    selection={selectedCustomers}
                    onSelectionChange={e => setSelectedCustomers(e.value)}
                    filters={filters}
                    filterDisplay="menu"
                    loading={loading}
                    responsiveLayout="scroll"
                    globalFilterFields={['name', 'country.name', 'representative.name','date', 'status']}
                    emptyMessage="검색결과를 찾을 수 없습니다."
                    currentPageReportTemplate="{first} 부터 {last} 까지 {totalRecords} 총">
                    {/* <Column selectionAriaLabel="name" headerStyle={{ width: '3em' }}></Column> */}
                    <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} />
                    {/* <Column field="country.name" header="Country" sortable filterField="country.name" style={{ minWidth: '14rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" /> */}
                    {/* <Column header="Agent" sortable sortField="representative.name" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} body={representativeBodyTemplate} filter filterElement={representativeFilterTemplate} /> */}
                    <Column field="date" header="Date" sortable filterField="date" dataType="date" style={{ minWidth: '8rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                    {/* <Column field="status" header="Status" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '10rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} /> */}
                    <Column field="country.name" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
                </DataTable>
            </div>
        </div>

        <Dialog header="편집" visible={modifyModal} style={{ width: '90vw' }} footer={renderModifyFooter} onHide={() => setModifyModal(false)}>
            <div>
            </div>
        </Dialog>

        <Dialog header="공지작성" visible={writeModal} style={{ width: '90vw' }} footer={renderWriteFooter} onHide={() => setWriteModal(false)}>
        <div>
            <div style={{flexDirection:'column', display:'flex'}}>
                <InputText placeholder="공지제목" value={noticeTitle} onChange={(e) => setNoticeTitle(event.target.value)} style={{marginBottom:10}} />
                <InputTextarea placeholder='공지내용' rows={5} cols={30} value={content} onChange={(e) => setContent(event.target.value)} />
            </div>
        </div>
        </Dialog>

        </>
    );
}


export default DataTableNoticeComponent;