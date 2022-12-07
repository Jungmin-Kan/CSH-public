import React, { useState, useEffect, useRef } from 'react';
import { GMap } from 'primereact/gmap';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';

const loadGoogleMaps = (callback) => {
    const existingScript = document.getElementById('googleMaps');

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://maps.google.com/maps/api/js?key=AIzaSyDMVAeLy4cwnHxyO8_p-QRl9W9vW0ciBIU';
        script.id = 'googleMaps';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = () => {
            if (callback) callback();
        };
    }

    if (existingScript && callback) callback();
};

const removeGoogleMaps = () => {
    const mapScript = document.getElementById('googleMaps');

    if (mapScript) {
        mapScript.parentNode.removeChild(mapScript);

        const head = document.getElementsByTagName('head')[0];
        const scripts = head.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            let script = scripts[i];
            let src = script.src;

            if (src.startsWith('https://maps.google.com/maps')) {
                head.removeChild(script);
            }
        }
    }
};

const GMapComponent = ({ marker }) => {

    const [googleMapsReady, setGoogleMapsReady] = useState(false);
    const [overlays, setOverlays] = useState([]);
    const toast = useRef(null);
    const infoWindow = useRef(null);

    useEffect(() => {
        loadGoogleMaps(() => {
            setTimeout(() => {
                setGoogleMapsReady(true);
            }, 5000);
        });
        return () => {
            removeGoogleMaps();
        }
    }, [])


    const onOverlayClick = (event) => {
        let isMarker = event.overlay.getTitle !== undefined;
        // console.log(isMarker)
        if (isMarker) {
            let title = event.overlay.getTitle();
            // console.log(title);
            infoWindow.current = new google.maps.InfoWindow();
            infoWindow.current.setContent('<div>' + title + '</div>');
            infoWindow.current.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());
            toast.current.show({ severity: 'info', summary: 'Marker Selected', detail: title });
        }
        else {
            toast.current.show({ severity: 'info', summary: 'Shape Selected', detail: '' });
        }
    }

    const handleDragEnd = (event) => {
        toast.current.show({ severity: 'info', summary: 'Marker Dragged', detail: event.overlay.getTitle() });
    }

    const isEmptyObj = (obj) => {
        if (obj.constructor === Object && Object.keys(obj).length === 0) {
            return true;
        }
        return false;
    }

    const onMapReady = (event) => {
        let markerBuffer = [];
        marker.forEach((value, index, arr) => {
            // console.log(value)
            if (!isEmptyObj(value)) {
                markerBuffer.push(new google.maps.Marker({ 
                    position: { lat: Number(value.lat), lng: Number(value.long) }, 
                    title: value.name,
                    label:{
                        text: value.name,
                        color: "black",
                        fontSize: "12px",
                    },
                    animation :  google.maps.Animation.DROP}));
            }
        })
        setOverlays(markerBuffer);
    }


    const options = {
        center: { lat: 37.308048901846796, lng: 127.92793536763948 },
        zoom: 12
    };

    return (
        <div>
            <Toast ref={toast}></Toast>
            {
                googleMapsReady ? (
                    <div className="card">
                        <GMap overlays={overlays} options={options} style={{ width: '100%', minHeight: '600px' }} onMapReady={onMapReady}
                            onOverlayClick={onOverlayClick} onOverlayDragEnd={handleDragEnd} />
                    </div>
                ) : <div style={{width:'100%', textAlign:'center'}}><ProgressSpinner /><div>데이터 준비중... </div></div>
            }
        </div>
    );
}
export default GMapComponent;