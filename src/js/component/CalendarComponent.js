import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';

const CalendarComponent = ({dataList}) => {

    const dateTemplate = (date) => {
        // console.log(date)
        if (date.day > 10 && date.day < 15) {
            return (
                <strong style={{backgroundColor:'red', padding:100, color:'#ffffff' }}>{date.day}</strong>
            );
        }
        return date.day;
    }

    return (
    <div>
        <h3>점검날짜</h3>
        <Calendar id="datetemplate" 
        onSelect={(e)=>{
            console.log(e);
            console.log(e.value);
        }}
        on
        style={{width:'100%'}}  inline showWeek dateTemplate={dateTemplate} />
    </div>  
    );
}

export default CalendarComponent;