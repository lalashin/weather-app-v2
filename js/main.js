const apiKey ="0d7831c22f79d7464ced7b0431d91be7";
const apiUrl ="https://api.openweathermap.org/data/2.5/";
let url;

const cardBbColor = document.querySelector(".card");
const temperature = document.querySelector(".today-temp");
const place = document.querySelector(".my-local");
const description = document.querySelector(".today-description");
const weatherImg = document.querySelector(".today-weather-icon");
const todayError = document.querySelector(".today-error");
const cityInput =document.querySelector(".city-input");
const searchBtn =document.querySelector(".search-btn");
let forecastDiv = document.querySelector('.forecast-result');
let pagiNation = document.querySelector(".page");
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;


searchBtn.addEventListener('click',searchResult);

const success = (position) => {

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude,longitude)

   getWeather(latitude,longitude);
}

const fail = () => {
    alert("좌표를 받아올 수 없습니다.")
}

window.addEventListener('load', function(){
    navigator.geolocation.getCurrentPosition(success, fail);
});

async function getWeather(lat,lon) {
    url = `${apiUrl}weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
    const response = await fetch(url);
  
 
     if(response.status == 400) {
         document.querySelector(".today-error").style.display = "block";
         document.querySelector(".today-area").style.display = "none"
     }else{
         var data = await response.json();
         console.log(data)
         console.log(data.name)
 
         temperature.innerHTML = Math.round(data.main.temp) + "°C";
         place.innerHTML= data.name;
         description.innerHTML = data.weather[0].description;
         //openweathermap API에서 지원하는 아이콘 사용 시
         //data.weather[0].icon = "09d"
        //  const icon = data.weather[0].icon;
        //  const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`; 
        // weatherImg.setAttribute('src', iconURL);

         //data.weather[0].main ="Clear"
         if(data.weather[0].main == "Clouds"){
            cardBbColor.classList.add("bgClouds");
            weatherImg.src = "images/clouds.png";  
         }else if(data.weather[0].main == "Clear"){
            cardBbColor.classList.add("bgClear");
            weatherImg.src = "images/clear.png";
         }else if(data.weather[0].main == "Rain"){
            cardBbColor.classList.add("bgRain");
            weatherImg.src = "images/rain.png";
        }else if(data.weather[0].main == "Drizzle"){
            cardBbColor.classList.add("bgDrizzle");
            weatherImg.src = "images/Drizzle.png";
        }else if(data.weather[0].main == "Mist"){
            cardBbColor.classList.add("bgMist");
            weatherImg.src = "images/Mist.png";
        }else if(data.weather[0].main == "Snow"){
            cardBbColor.classList.add("bgSnow");
            weatherImg.src = "images/snow.png";
        }
 
 
         document.querySelector(".today-error").style.display = "none";
         document.querySelector(".today-area").style.display = "block"
     }
 }

 cityInput.addEventListener("keydown",function(event){
    if(event.keyCode === 13){
        //addTask(event);
        if(cityInput.value !==''){
            page = 1;
            searchResult();
        }else{
            alert("도시 이름을 입력하세요!");
        }
    
    }
});

searchBtn.addEventListener('click', ()=>{
    if(cityInput.value !==''){
        page = 1;
        searchResult();
    }else{
        alert("도시 이름을 입력하세요!");
    }

});


async function searchResult() {
   // console.log(page);
    
    let city = cityInput.value.trim();
    console.log(city);
    if(city) {
        let url = `${apiUrl}forecast?units=metric&q=${city}&appid=${apiKey}`;
        try{           
            let response = await fetch(url);
            let data = await response.json();
            console.log(data);
            displayForecast(data,city) ;
            pagenationRender();
        } catch(error){
            console.error("날씨예보 실패",error);
        }
    }
}

function displayForecast(data,city) {
    console.log(data);
    console.log(city);
    forecastDiv.innerHTML = `<h3>${city.charAt(0).toUpperCase()+ city.slice(1)}<br><em> 5일에 대한 3시간 간격 기상예보 리스트</em></h3>`;

    totalResults = data.list.length;
    trange = totalResults/10;
    //console.log("범위",trange);

    let pageList = data.list.slice(0,10);
    //0*10 =0
    //1*10 =10
    //2*10 =20
   //(i+1)*10
        // if(page == 1){
        //     pageList = data.list.slice(0,10);
        // }else if(page == 2){
        //     pageList = data.list.slice(10,20);
        // }else if(page == 3){
        //     pageList = data.list.slice(20,30);
        // }else if(page == 4){
        //     pageList = data.list.slice(30,40);
        // }
        for(let i=0;i<=trange+1;i++ ){
            if(page == i+1) {
                pageList = data.list.slice(i*10,(i+1)*10);
            }
        };
  
   

    pageList.forEach((item) => {
       
        const icon = item.weather[0].icon;
        
        const str = new Date(item.dt_txt).toLocaleString();
        const arr = str.split(":")

        
        forecastDiv.innerHTML += `
        <div class="weather-hour">
       
            <div class="condition-area">
                <span class="weather-disc">
                    <strong class="weather-time">${arr[0]}시</strong>
                    <div><img src="http://openweathermap.org/img/wn/${icon}.png"></div>
                    <strong>${Math.round(item.main.temp)}°C</strong>
                    <span>${item.weather[0].description}</span>
                </span>
            </div>  
        </div>
        `;
    
    });
  }

  function pagenationRender(){
    pagiNation.classList.add("on");
    const totalPages = Math.ceil(totalResults/pageSize);
    const pageGroup = Math.ceil(page/pageSize);
    
    let lastPage = pageGroup * groupSize;
    

    if(lastPage > totalPages){
        lastPage = totalPages;
    }

    let firstPage = lastPage - (groupSize-1) <=0 ? 1: lastPage-(pageSize-1);
    
    console.log("firstPage",firstPage);

    let paginationHTML = ` 
    <ul class="pagination modal">`;
    if(page >= 6) {
        paginationHTML += `<li><a href="#" class="first" onclick="moveToPage(1)">&lt;&lt;</a></li>
        <li><a href="#" class="arrow left" onclick="moveToPage(${page-1})">&lt;</a></li>`;
    }

    for(let i=firstPage; i<=lastPage;i++){
        paginationHTML += `<li><a href="#" class="num ${i===page ? "active" : ''}" onclick="moveToPage(${i})" >${i}</a></li>`;
    }

    if (lastPage < totalPages) {
        paginationHTML += `<li><a href="#" class="arrow right" onclick="moveToPage(${page+1})">&gt;</a></li>
        <li><a href="#" class="last" onclick="moveToPage(${totalPages})">&gt;&gt;</a></li>`;
    }

    paginationHTML += ` </ul>
    `;

    pagiNation.innerHTML = paginationHTML;
    

  }


  const moveToPage =(pageNum)=>{
    console.log("moveToPage",pageNum);
    page = pageNum;
    searchResult()
}


