import React, { useState, useEffect } from 'react';
import DataTableNoticeComponent from '../component/DataTableNoticeComponent';

const NoticeListScreen = () => {
    return (
        <div>
            <DataTableNoticeComponent title={'공지리스트'}/>
        </div>
    );
}

export default NoticeListScreen;