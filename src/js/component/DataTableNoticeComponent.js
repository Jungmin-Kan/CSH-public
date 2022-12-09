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
import { ConfirmDialog } from 'primereact/confirmdialog';


import { InputTextarea } from 'primereact/inputtextarea';
import { governDeleteNotice, governEnrollNotice, governNoticeList } from '../api';
import { Toast } from 'primereact/toast';


const DataTableNoticeComponent = ({title}) => {
    const [customers, setCustomers] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'title': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'content': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        // 'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
        _governNoticeList();
        setLoading(false)
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const _governNoticeList = async()=>{
       let res =  await governNoticeList();
       setCustomers(getCustomers(res.data));
    //    console.log(res.data);
    }
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


    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date);
    }

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="yy/mm/dd" placeholder="yyyy/mm/dd" mask="9999/99/99" />
    }



    const [noticeModifyTitle,setnoticeModifyTitle] = useState('')
    const [noticeModifyContent,setnoticeModifyContent] = useState('')
    const [noticeModifyTarget,setnoticeModifyTarget] = useState({});

    useEffect(()=>{
        if (Object.keys(noticeModifyTarget).includes('title')) {
            setnoticeModifyTitle(noticeModifyTarget.title);
            setnoticeModifyContent(noticeModifyTarget.content);
        }
    },[noticeModifyTarget]);

     /**
     * @description 공지 수정 기능
     * @param {object} value 
     * @returns {React.Component}
     */
    const actionBodyModifyTemplate = (value) => {
        return <Button style={{marginRight:10}}  label={'수정'} className='p-button-secondary' onClick={()=>{
            console.log(value);
            setnoticeModifyTarget(value);
            setModifyModal(true);
        }} />
    }

    /**
     * @description 공지 삭제 기능
     * @param {object} value 
     * @returns {React.Component}
     * 
     */
    const actionBodyDeleteTemplate = (value) => {
        return <Button style={{marginRight:10}}  label={'삭제'} className='p-button-secondary' onClick={()=>{
            console.log(value);
            setnoticeModifyTarget(value);
            setvisibleDelete(true);
        }} />
    }

    const exportCSV = () => { dt.current.exportCSV();}


    const [writeModal, setWriteModal] = useState(false);
    const [modifyModal, setModifyModal] = useState(false);
    
    const renderModifyFooter = () => {
        return (
            <div style={{textAlign:'center'}}>
                <Button label="취소" icon="pi pi-times" className='p-button-danger' onClick={() => {
                    setnoticeModifyTitle('');
                    setnoticeModifyContent('');
                    setModifyModal(false);
                    }} autoFocus />
                <Button label="수정" icon="pi pi-check" className='p-button-success' onClick={() => {

                    if (noticeModifyTitle != '' && noticeModifyContent != '') {
                        findNoticeDate();
                        // setTimeout(() => {
                        //     setnoticeModifyTitle('');
                        //     setnoticeModifyContent('');
                        // }, 500);
                    }
                    setModifyModal(false);
                }} autoFocus />
            </div>
        );
    }
    useEffect(()=>{
        console.log('dsadas')
    },[customers]);

    useEffect(() => {
        console.log(noticeModifyTitle, noticeModifyContent);
      }, [noticeModifyTitle, noticeModifyContent]);

    const findNoticeDate = () =>{
        setCustomers(prev=>{
            let temp = [...prev];
            temp.forEach((value,index,arr)=>{
                if (noticeModifyTarget.title == value.title) {
                    value.title = noticeModifyTitle;
                    value.content = noticeModifyContent;
                }
            })
            return temp;
        })
    }

    const _governEnrollNotice = async(date, title, content) =>{
       try {
            let res = await governEnrollNotice(date, title, content);
	        console.log(res)
        } catch (error) {}
    }

    const renderWriteFooter = () => {
        return (
            <div style={{textAlign:'center'}}>
                <Button label="완료" icon="pi pi-check" className='p-button-success' onClick={() => {
                    setVisible(true);
                }} autoFocus />
            </div>
        );
    }


    const accept = async() => {
        let dateFormating = new Date();
        let year = dateFormating.getFullYear(), month = dateFormating.getMonth()+1, date=dateFormating.getDate();
        let sendDate = `${year}-${month < 10 ? '0'+month:month}-${date < 10 ? '0'+date : date}`

        let res = await _governEnrollNotice(sendDate,noticeTitle,content);
        console.log(res);
        toast.current.show({ severity: 'info', summary: '확인', detail: '공지등록을 완료했습니다.', life: 3000 });
        setWriteModal(false);
        setTimeout(() => {
            setContent('');
            setNoticeTitle('');
        }, 500);
        await _governNoticeList();

    }
    const reject =  async() => {
        toast.current.show({ severity: 'warn', summary: '취소', detail: '공지등록을 취소했습니다.', life: 3000 });
    }

    const rejectDelete =  async() => {
        setnoticeModifyTarget({});
        toast.current.show({ severity: 'warn', summary: '취소', detail: '취소했습니다.', life: 3000 });
    }

    const acceptDelete = async() => {
        console.log(noticeModifyTarget.title)
        let res = await governDeleteNotice(noticeModifyTarget.title);
        console.log(res);
        toast.current.show({ severity: 'info', summary: '완료', detail: '삭제를 완료했습니다.', life: 3000 });
        // setnoticeModifyTarget({});
        await _governNoticeList();

    }




    const [content, setContent] = useState('');
    const [noticeTitle, setNoticeTitle] = useState('')

    const [visible, setVisible] = useState(false);
    const [visibleDelete, setvisibleDelete] = useState(false)
    const toast = useRef(null);


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
                    // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]}
                    dataKey="id"
                    rowHover
                    selectionMode="single"
                    // selection={selectedCustomers}
                    onSelectionChange={e => setSelectedCustomers(e.value)}
                    filters={filters}
                    filterDisplay="menu"
                    loading={loading}
                    responsiveLayout="scroll"
                    globalFilterFields={['title', 'content', 'date']}
                    emptyMessage="검색결과를 찾을 수 없습니다."
                    currentPageReportTemplate="{first} 부터 {last} 까지 {totalRecords} 총">
                    {/* <Column selectionAriaLabel="name" headerStyle={{ width: '3em' }}></Column> */}
                    <Column field="title" header="제목" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} />
                    {/* <Column field="country.name" header="Country" sortable filterField="country.name" style={{ minWidth: '14rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" /> */}
                    {/* <Column header="Agent" sortable sortField="representative.name" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} body={representativeBodyTemplate} filter filterElement={representativeFilterTemplate} /> */}
                    <Column field="content" header="내용" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} />
                    <Column field="date" header="날짜" sortable filterField="date" dataType="date" style={{ minWidth: '8rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                    <Column field="title" header="수정"  headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyModifyTemplate} />
                    <Column field="title" header="삭제"  headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyDeleteTemplate} />
                    
                    {/* <Column field="status" header="Status" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '10rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} /> */}
                </DataTable>
            </div>
        </div>

        <Dialog header="편집" visible={modifyModal} style={{ width: '90vw' }} footer={renderModifyFooter} onHide={() =>{
            // setnoticeModifyTitle('');
            // setnoticeModifyContent('');
            setModifyModal(false);
        }}>
            <div style={{flexDirection:'column', display:'flex'}}>
                <InputText placeholder="공지제목" value={noticeModifyTitle} onChange={(e) => setnoticeModifyTitle(event.target.value)} style={{marginBottom:10}} />
                <InputTextarea placeholder='공지내용' rows={5} cols={30} value={noticeModifyContent} onChange={(e) => setnoticeModifyContent(event.target.value)} />
            </div>
        </Dialog>

        <Dialog header="공지작성" visible={writeModal} style={{ width: '90vw' }} footer={renderWriteFooter} onHide={() => {
            setContent('');
            setNoticeTitle('');
            setWriteModal(false);
        }}>
        <div>
            <div style={{flexDirection:'column', display:'flex'}}>
                <InputText placeholder="공지제목" value={noticeTitle} onChange={(e) => setNoticeTitle(event.target.value)} style={{marginBottom:10}} />
                <InputTextarea placeholder='공지내용' rows={5} cols={30} value={content} onChange={(e) => setContent(event.target.value)} />
            </div>
        </div>
        </Dialog>

        <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="공지를 추가하시겠습니까?"
            header="알림" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} acceptLabel={'예'} rejectLabel={'아니오'}/>
        
        <ConfirmDialog visible={visibleDelete} onHide={() => setvisibleDelete(false)} message="공지를 삭제하시겠습니까?"
            header="알림" icon="pi pi-exclamation-triangle" accept={acceptDelete} reject={rejectDelete} acceptLabel={'예'} rejectLabel={'아니오'}/>
        <Toast ref={toast} />
        </>
    );
}


export default DataTableNoticeComponent;