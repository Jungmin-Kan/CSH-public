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


/**
 * 
 * 
			{
			restaurant_id: (string), 식당 아이디 
		  restaurant_name: (string), 식당 이름 
			is_check_hygiene: (string), 관리자의 식당 위생 체크 여부 
			judgement_grade: (string), 식당 위생 등급 (양호, 불량, 미검사)
			restaurant_address: (string), 식당 주소 
			is_visited_restaurant: (string), 현장 방문 여부
			bz_num: (string) 사업자 등록번호
			}
		

    {
        "id": 1000,
        "name": "James Butt",
        "country": {
            "name": "Algeria",
            "code": "dz"
        },
        "company": "Benton, John B Jr",
        "date": "2015-09-13",
        "status": "unqualified",
        "verified": true,
        "activity": 17,
        "representative": {
            "name": "Ioni Bowcher",
            "image": "ionibowcher.png"
        },
        "balance": 70663
    },
 * @returns 
 */
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
    body: JSON.stringify({restaurant_id, judgement_grade})
  }).then(res=>res.json()).then(data=>data)
}