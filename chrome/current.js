
var allAzkar = ["بسم الله"];
loadAzkar();
function changeZekrRandomly() {
  const index = Math.floor(Math.random() * allAzkar.length);

  document.getElementById("zekr").innerHTML = allAzkar[index];
  // var mydata = JSON.parse(data);
  // console.log(mydata);

}

function loadAzkar() {
  const url = chrome.runtime.getURL('data.json');
  fetch(url)
      .then((response) => response.json()) //assuming file contains json
      .then((json) => {
        console.log(json);
        allAzkar = json.azkar;
        console.log('hala ', allAzkar);
        changeZekrRandomly();
  });
}