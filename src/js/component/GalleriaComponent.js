import React, { useState, useEffect } from 'react';

import { Galleria } from 'primereact/galleria';
import { Button } from 'primereact/button';


const GalleriaComponent = ({index, pivot, value, judgementGrade}) => {
    const [images, setImages] = useState(value.images)
    const [visible, setVisivle] = useState(false);
    useEffect(()=>{
        // acc_hygiene, clean_per_total
        console.log(value)
        console.log(images)
    },[])
    useEffect(() => { 
        setVisivle(false);
        if (index == pivot) { setVisivle(true);}
    }, [pivot]); 

    const itemTemplate = (item) => { 
        // console.log(item.hygiene_type)
        return <>
            {itemHygieneType(item.hygiene_type)}
            <img src={item.img_path}  onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={item.alt} style={{ width: '100%' ,display: 'block', height:600 }} /> 
        </>
    }
    const itemHygieneType = (hygiene_type) =>{
        console.log(hygiene_type);
        if (hygiene_type == "판별불가") {
            return <Button style={{position:'absolute', top:30, left:30}} label={"사진결과 :"+hygiene_type} className='p-button-secondary' onClick={() => {}} autoFocus />
        }else if(hygiene_type == "clean"){
            return <Button style={{position:'absolute', top:30, left:30}} label={"사진결과 :"+hygiene_type} className='p-button-success' onClick={() => {}} autoFocus />
        }else if (hygiene_type == "dirty"){
            return <Button style={{position:'absolute', top:30, left:30}} label={"사진결과 :"+hygiene_type} className='p-button-danger' onClick={() => {}} autoFocus />
        }else if(hygiene_type == "판별대기"){
            return <Button style={{position:'absolute', top:30, left:30}} label={"사진결과 :"+hygiene_type} className='p-button-warning' onClick={() => {}} autoFocus />
        }
    }
    const thumbnailTemplate = (item) => { return <img src={item.img_path} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={item.alt} style={{ display: 'block', width:50, height:50 }} /> }
    const totalHygieneType = () =>{
        const _left = 150;
        const _nextLeft = 160;
        if (value.total_hygiene_type == "clean") {
            return <div style={{position:'absolute', top:20, left: _left, flexDirection:'row', width:800}}>
                <Button style={{marginRight:10}}  label={value.total_tool_type} className='p-button-secondary' onClick={() => {}} autoFocus />
                <Button style={{marginRight:10}}  label={"검사결과 :"+judgementGrade} className='p-button-success' onClick={() => {}} autoFocus />
                <Button style={{marginRight:10}} label={"이미지 부분결과 :"+value.total_hygiene_type} className='p-button-success' onClick={() => {}} autoFocus />
                <Button style={{marginRight:10}} label={value.acc_hygiene.toString()} className="p-button-rounded p-button-secondary" />
                <Button style={{marginRight:10}} label={value.clean_per_total.toString()} className="p-button-rounded p-button-secondary" />
                </div>
        }else if(value.total_hygiene_type == "dirty"){
            return <div style={{position:'absolute', top:20, left: _left, flexDirection:'row', width:800}}>
                <Button style={{marginRight:10}}  label={value.total_tool_type} className='p-button-secondary' onClick={() => {}} autoFocus />
                <Button style={{marginRight:10}} label={"검사결과 :"+judgementGrade} className='p-button-danger' onClick={() => {}} autoFocus />
                <Button style={{marginRight:10}} label={"종합결과 :"+value.total_hygiene_type} className='p-button-danger' onClick={() => {}} autoFocus />
                <Button style={{marginRight:10}} label={value.acc_hygiene.toString()} className="p-button-rounded p-button-secondary" />
                <Button style={{marginRight:10}} label={value.clean_per_total.toString()} className="p-button-rounded p-button-secondary" />
                </div>
        }else if(value.total_hygiene_type == "판별대기"){
            return <div style={{position:'absolute', top:20, left: _left, flexDirection:'row', width:800}} >
                <Button style={{marginRight:10}}  label={value.total_tool_type} className='p-button-secondary' onClick={() => {}} autoFocus />
                <Button style={{marginRight:10}} label={"검22사결과 :"+judgementGrade} className='p-button-warning' onClick={() => {}} autoFocus />
                <Button style={{marginRight:10}} label={"종합결과 :"+value.total_hygiene_type} className='p-button-warning' onClick={() => {}} autoFocus />
                <Button style={{marginRight:10}} label={value.acc_hygiene.toString()} className="p-button-rounded p-button-secondary" />
                <Button style={{marginRight:10}} label={value.clean_per_total.toString()} className="p-button-rounded p-button-secondary" />
                </div>
        }else{
            return  <div style={{position:'absolute', top:20, left: _left, flexDirection:'row', width:800}} >
            <Button style={{marginRight:10}}  label={value.total_tool_type} className='p-button-secondary' onClick={() => {}} autoFocus />
            <Button style={{marginRight:10}} label={"검사결과 :"+judgementGrade} className='p-button-warning' onClick={() => {}} autoFocus />
            <Button style={{marginRight:10}} label={"종합결과 :"+value.total_hygiene_type} className='p-button-warning' onClick={() => {}} autoFocus />
            <Button style={{marginRight:10}} label={value.acc_hygiene.toString()} className="p-button-rounded p-button-secondary" />
            <Button style={{marginRight:10}} label={value.clean_per_total.toString()} className="p-button-rounded p-button-secondary" />
            </div>
        }
    }
    return (<>
        {visible && totalHygieneType()}
        <Galleria value={images} 
        responsiveOptions={[{ breakpoint: '1024px', numVisible: 5},{ breakpoint: '768px', numVisible: 3},{ breakpoint: '560px', numVisible: 1}]} 
        numVisible={5} circular style={{ maxWidth: '640px', display : visible ? 'block' : 'none'}} 
        showItemNavigators 
        item={itemTemplate} 
        thumbnail={thumbnailTemplate} />
        </>
    
    );     
}


export default GalleriaComponent;

