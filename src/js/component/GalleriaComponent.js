import React, { useState, useEffect } from 'react';

import { Galleria } from 'primereact/galleria';
import { Button } from 'primereact/button';


const GalleriaComponent = ({index,pivot,value}) => {
    const [images, setImages] = useState(value.images)
    const [visible, setVisivle] = useState(false);
    useEffect(()=>{
        console.log(images)
    },[])
    useEffect(() => { 
        setVisivle(false);
        if (index == pivot) { setVisivle(true);}
    }, [pivot]); 

    const itemTemplate = (item) => { 
        console.log(item.hygiene_type)
        return <>
            {itemHygieneType(item.hygiene_type)}
            <img src={item.img_path}  onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={item.alt} style={{ width: '100%' ,display: 'block', height:600 }} /> 
        </>
    }
    const itemHygieneType = (hygiene_type) =>{
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
        if (value.total_hygiene_type == "clean") {
            return <Button style={{position:'absolute', top:20, left:200}} label={"종합결과 :"+value.total_hygiene_type} className='p-button-success' onClick={() => {}} autoFocus />
        }else if(value.total_hygiene_type == "dirty"){
            return <Button style={{position:'absolute', top:20, left:200}} label={"종합결과 :"+value.total_hygiene_type} className='p-button-danger' onClick={() => {}} autoFocus />
        }else if(value.total_hygiene_type == "판별대기"){
            return <Button style={{position:'absolute', top:20, left:200}} label={"종합결과 :"+value.total_hygiene_type} className='p-button-warning' onClick={() => {}} autoFocus />
        }
    }
    return (<>
        {visible&&totalHygieneType()}
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