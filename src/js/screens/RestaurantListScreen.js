import React, { useState, useEffect } from 'react';
import DataTableRes from '../component/DataTableRes';

const RestaurantListScreen = () => {
    return (
      <div>
         <DataTableRes title={'식당리스트'}/>
      </div>  
    );
}

export default RestaurantListScreen;