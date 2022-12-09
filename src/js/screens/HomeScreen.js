import React, { useState, useEffect,useRef } from 'react';
import { Card } from 'primereact/card';
import GMapComponent from '../component/GMap';
import CalendarComponent from '../component/CalendarComponent';
import { governRestaurantList } from '../api';
import { ProgressSpinner } from 'primereact/progressspinner';

const HomeScreen = () => {

    const [marker,setMarker] = useState([]);
    const [data, setData] = useState([]);
    const [hasHygiene, setHasHygiene] = useState(0);
    useEffect(()=>{
        _governRestaurantList();
    },[]);

    useEffect(()=>{
        if (data.length) {
            findLatLng(data);
        }
    },[data]);

    const _governRestaurantList = async() =>{
        let res = await governRestaurantList();
        setData(res.data);
    }
    useEffect(()=>{
        // console.log(marker)
    },[marker])

    const findLatLng = (data) =>{
        let buffer = [];
        // console.log(data)
        data.forEach(async(value,index,arr) => {
            if (!value.is_check_hygiene) {
                setHasHygiene(prev=>prev+1);
            }
            let _res = await _geoCode(value.restaurant_address, value.restaurant_name);
            buffer.push(_res);
        });

    
        setTimeout(() => {
            setMarker(buffer);
        }, 1000);
    }

    const _geoCode = async(address, name) =>{
        let markerObject = {};
        let reciveGeo = naver.maps.Service.geocode({ query: address}, function(status, response) {
            if (status !== naver.maps.Service.Status.OK) { }
            var result = response.v2, // 검색 결과의 컨테이너
                items = result.addresses; // 검색 결과의 배열
                try {
	                markerObject.long = items[0].x;
	                markerObject.lat = items[0].y;
	                markerObject.name = name;
                } catch (error) {}
                // console.log(markerObject)
        });
        return markerObject;
    }


    return (
        <div>
            <div style={{padding:10}}>
                <div style={{display:'flex', flex:1, flexDirection:'row'}}>
                    <Card title="청신한 위생관리 모니터링 시스템" style={{ width: '100%', marginBottom: '2em', textAlign:'center' }}/>
                </div>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly'}}>
                    <Card title="관리대상" style={{ width: '25rem', marginBottom: '2em',margin:5 }}>
                        <h1 className="m-0" style={{lineHeight: '1.5'}}>{data.length}</h1>
                    </Card>
                    <Card title="위생 검사 실시 현황" style={{ width: '25rem', marginBottom: '2em',margin:5 }}>
                        <h1 className="m-0" style={{lineHeight: '1.5'}}>{data.length - hasHygiene}</h1>
                    </Card>
                    <Card title="위생 검사 미 실시 현황" style={{ width: '25rem', marginBottom: '2em',margin:5 }}>
                        <h1 className="m-0" style={{lineHeight: '1.5'}}>{hasHygiene}</h1>
                    </Card>
                </div>
            </div>    
            
            <div style={{padding:10}}>
                {marker.length ? <GMapComponent marker={marker}/> : <div style={{width:'100%', textAlign:'center'}}><ProgressSpinner/>
                <div>단말기 위치설정 중 입니다...</div></div>}
            </div>
            <div style={{padding:10}}>
                {marker.length ? <CalendarComponent originData={data}/> : <div style={{width:'100%', textAlign:'center'}}><ProgressSpinner/>
                <div>날짜 설정 중 입니다...</div></div>}
            </div>
            <div style={{padding:10, flexDirection:'row', display:'flex', alignItems:'center'}}>
                <div style={{width:35, height:35, borderRadius:50, backgroundColor:'red', display:'inline-block'}}></div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>방문 점검 날짜</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <div style={{width:35, height:35, borderRadius:50, backgroundColor:'#ced4da', display:'inline-block'}}></div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>현재날짜</span>
            </div>

            {/* <div style={{padding:10, flexDirection:'row', display:'flex', alignItems:'center'}}>
                <div style={{width:35, height:35, borderRadius:50, backgroundColor:'#ced4da', display:'inline-block'}}></div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>현재날짜</span>
            </div> */}

        </div>
    );
}

export default HomeScreen;
