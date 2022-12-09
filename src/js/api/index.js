const SERVER = 'http://172.26.126.237:3000';


export const boardList = () =>{
    return fetch("http://172.26.126.237:3000/board-list?", {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
      })
      .then(res=>res.text())
      .then(data=>data);
}

export const governRestaurantList = () =>{
    return fetch("http://cshserver.ga:8000/govern-restaurantList?city=원주시", {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
      })
      .then(res=>res.json())
      .then(data=>data);
}

export const governDetailRestaurant = (value) =>{
  return fetch(`http://cshserver.ga:8000/govern-detail-restaurant?restaurantId=${value}`, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  })
  .then(res=>res.json())
  .then(data=>data);
}


export const governFixHygiene = (restaurant_id, judgement_grade) =>{
  return fetch(`http://cshserver.ga:8000/govern-fixHygiene`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({restaurant_id:restaurant_id, judgement_grade:judgement_grade})
  }).then(res=>res.json()).then(data=>data)
}


export const governEnrollVisitDate  = (date, restaurant_id) =>{
  return fetch(`http://cshserver.ga:8000/govern-enrollVisitDate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({date:date, restaurant_id:restaurant_id})
  }).then(res=>res.json()).then(data=>data)
}




export const governNoticeList = () =>{
  return fetch(`http://cshserver.ga:8000/govern-noticeList`, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  })
  .then(res=>res.json())
  .then(data=>data);
}


export const governEnrollNotice = (date, title, content) =>{
  return fetch(`http://cshserver.ga:8000/govern-enrollNotice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({date:date, title:title,content:content })
  }).then(res=>res.json()).then(data=>data)
}

export const governDeleteNotice = (title) =>{
  return fetch(`http://cshserver.ga:8000/govern-deleteNotice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({title:title })
  }).then(res=>res.json()).then(data=>data)
}



export const governfixIsVisit = (is_visited_restaurant, restaurant_id) =>{
  return fetch(`http://cshserver.ga:8000/govern-fixIsvisit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      is_visited_restaurant:is_visited_restaurant,
      restaurant_id:restaurant_id.toString()
    })
  }).then(res=>res.json()).then(data=>data)
}