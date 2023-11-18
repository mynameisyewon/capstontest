// 지금 토큰 값이 보이는 상태니깐 
//localStorage에 저장해서 가지고 아래로 리다이렉트해서 사용하기
//소셜 로그인은 지금 토큰 값이 url 표시되니까 표시 안 나게 하기 뭔 말인지 알지 ??
// window.location.href = "http://127.0.0.1:5500/mainSuccess.html?";
//지금 저 코드 때문에 일반 로그인도 토큰 값 건드려서 안 보이니까
//소셜로그인 할 때 저걸로 처리해줘야돼

var currentURL = window.location.href;

if (currentURL.includes('?')) {
// // 현재 페이지 URL을 가져옵니다.

// // URL에서 쿼리 문자열을 추출합니다.
var queryString = currentURL.split('?')[1];

// // 쿼리 문자열을 파싱하여 키-값 쌍을 객체로 변환합니다.
var queryParams = {};
queryString.split('&').forEach(function(param) {
    var parts = param.split('=');
    var key = decodeURIComponent(parts[0]);
    var value = decodeURIComponent(parts[1]);
    queryParams[key] = value;
});

// // accessToken 및 refreshToken을 추출합니다.
var accessToken = queryParams.accessToken;
var refreshToken = queryParams.refreshToken;

if (accessToken && refreshToken) {
    // localStorage에 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    refreshPage();
}
// 페이지 새로 고침// 다른 페이지로 리디렉션
}

const accessToken = localStorage.getItem('accessToken');
const serverUrl = "http://localhost:8082/userInfo/Id_NickName_Balance";
//URL이 "http://" 또는 "https://"로 시작하지 않으면 "http://"를 추가
if (!serverUrl.startsWith("http://")) {
    serverUrl = "http://" + serverUrl;
}

fetch(serverUrl, {
    method: 'GET',
    headers: {
            'Authorization': "Bearer "+localStorage.getItem('accessToken')
    }
})
.then(response => response.json())
.then(data => {
    
    document.getElementById("homeNickname").textContent = data.nickname;
    document.getElementById("homeNickname2").textContent = data.nickname;
    document.getElementById("homeAccount").textContent = data.account;
    document.getElementById("homeBalance").textContent = data.balance;
    localStorage.setItem('accountNumber', data.account);

})
.catch(error => {
    console.error('회원정보 요청 중 오류 발생:', error);
});

function refreshPage() {
    window.location.href = "http://127.0.0.1:5500/mainSuccess.html"
}



//------------------------랭킹-------------------------

const token1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBY2Nlc3NUb2"
    fetch("http://localhost:8082/userInfo/rank", {
    method: 'GET',
    headers: {
        'Authorization': token1
    }
})



.then(response => response.json())
.then(data => {
   topRanking(data);
   ranking(data);
   infoRanking(data);
})
.catch(error => {
    console.error('랭킹 정보 요청 중 오류 발생:', error);
});

function topRanking(data){
     document.getElementById("nickname1").textContent = data[0].nickname;
     document.getElementById("account1").textContent = data[0].balance +" 원";
 
     document.getElementById("nickname2").textContent = data[1].nickname;
     document.getElementById("account2").textContent = data[1].balance+" 원";
 
     document.getElementById("nickname3").textContent = data[2].nickname;
     document.getElementById("account3").textContent = data[2].balance+" 원";
};
function ranking(data){
    const table= document.getElementById("rankDB");
    const tbody = table.querySelector('tbody');
    data.forEach((data, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        const nicknameCell = document.createElement('td');
        nicknameCell.textContent = data.nickname;
        row.appendChild(nicknameCell);

        const accountCell = document.createElement('td');
        accountCell.textContent = data.balance + " 원";
        row.appendChild(accountCell);

        tbody.appendChild(row);
})};
function infoRanking(data) {
    const savedDataString = localStorage.getItem('accountNumber');

    for (let i = 0; i < data.length; i++) {
        if (data[i].account === savedDataString) {
            document.getElementById("homeRanking").textContent = i+1;
            return;  // 해당 계정을 찾으면 바로 함수를 종료하도록 수정
        }
    }
}
