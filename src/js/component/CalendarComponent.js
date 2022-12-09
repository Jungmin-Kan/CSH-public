import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const CalendarComponent = ({originData}) => {
    
    const [displayBasic, setDisplayBasic] = useState(false);
    const [today, setToday] = useState([]);

    const dateTemplate = (date) => {
        for (let index = 0; index < originData.length; index++) {
            let _data = new Date(originData[index].date);
            if (_data.getDate() == date.day) {
                if (_data.getMonth()+1 == date.month+1) {
                    return <strong style={{backgroundColor:'red', padding:100, color:'#ffffff' }}>{date.day}</strong>
                }
            }
        }
        return date.day;
    }
    const _onSelect = (e)=>{
        console.log(e);
        console.log(e.value);
        findTodayRest(e.value);
        setDisplayBasic(true);
    }

    const isSameDate = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear()
           && date1.getMonth() === date2.getMonth()
           && date1.getDate() === date2.getDate();
      }

    const findTodayRest = (value) =>{
        let _buffer = [];
        let pickerDate = new Date(value);
        for (let index = 0; index < originData.length; index++) {
            let _data = new Date(originData[index].date);
            if (isSameDate(_data,pickerDate)) {
                _buffer.push({
                    restaurant_name: originData[index].restaurant_name,
                    restaurant_address:originData[index].restaurant_address
                });
            }
        }
        setToday(_buffer);
    }


    const onHide = (name) => {
        setDisplayBasic(false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="확인" icon="pi pi-check" onClick={() => onHide()} autoFocus />
            </div>
        );
    }

    return (
    <div>
        <h3>점검날짜</h3>
        <h5>원하시는 점검날짜를 선택해주세요.</h5>
        <Calendar id="datetemplate" onSelect={_onSelect} style={{width:'100%'}}  inline showWeek dateTemplate={dateTemplate} />

        <Dialog header="식당 리스트" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter()} onHide={() => onHide()}>
        <DataTable value={today} responsiveLayout="scroll">
                <Column field="restaurant_name" header="식당이름"></Column>
                <Column field="restaurant_address" header="주소"></Column>
            </DataTable>
        </Dialog>

    </div>  
    );
}

export default CalendarComponent;