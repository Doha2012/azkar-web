
var allAzkar = ["بسم الله"];
var city = 'Alexandria';
var country = 'Egypt';
const prayerNames = {
  'Asr': 'العصر',
  'Dhuhr': 'الظهر',
  'Fajr': 'الفجر',
  'Isha': 'العشاء',
  'Maghrib': 'المغرب',
  'Sunrise': 'الشروق'
};
var currentTime = new Date();
const ONE_HOUR = 60 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;
var timingsResponse = {};
const refreshCountDown = setInterval(updateClosestPrayerInfo, 1000);


chrome.storage.local.get(["prayerTimes"]).then((result) => {
  timingsResponse = result.prayerTimes;
  loadAzkar();
  loadPrayerTimes();
});



function changeZekrRandomly() {
  const index = Math.floor(Math.random() * allAzkar.length);
  document.getElementById("zekr").innerHTML = allAzkar[index];
}

function loadAzkar() {
  const url = chrome.runtime.getURL('data.json');
  fetch(url)
      .then((response) => response.json())
      .then((json) => {
        allAzkar = json.azkar;
        changeZekrRandomly();
  });
}

function loadPrayerTimes() {
  if (timingsResponse?.date?.readable && new Date(timingsResponse.date.readable).toDateString() === currentTime.toDateString()) {
    updateClosestPrayerInfo();
    return;
  }
  console.log("calling API....");
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`;
  fetch(url)
      .then((response) => response.json()) 
      .then((json) => {
        console.log(json);
        const timings = json.data.timings;
        storePrayerTimes(json.data);
        timingsResponse = json.data;
        updateClosestPrayerInfo();
        console.log(timingsResponse);
  });
}

function updateClosestPrayerInfo() {
  if (!timingsResponse?.timings) {
    return;
  }
  console.log('updating');
  currentTime = new Date();
  const keyNames = Object.keys(prayerNames);
  var recentPrayer = '';
  var recentDiff = ONE_HOUR * 24; // max so it will be replaced in first round
  for (k in timingsResponse.timings) {
    if (keyNames.includes(k)) {
      const diff = getTimeDiff(timingsResponse.timings[k]);
      if(diff > 0 && diff < recentDiff) {
        recentDiff = diff;
        recentPrayer = k;
      }
    }
  }

  var diffx = recentDiff;
  const hour = Math.floor(diffx/ONE_HOUR);
  diffx = diffx - (hour * ONE_HOUR);
  const min = Math.floor(diffx/ONE_MINUTE);
  diffx = diffx - (min * ONE_MINUTE);
  const sec = Math.floor(diffx/1000);
  const diff = `${formateTime(hour, min, sec)} باقي على الآذان`;
  document.getElementById("next-prayer-name").innerHTML = prayerNames[recentPrayer];
  document.getElementById("next-prayer-time").innerHTML = timingsResponse.timings[recentPrayer];
  document.getElementById("next-prayer-diff").innerHTML = diff;
}

function getTimeDiff(time) {
  const split = time.split(':')
  var temp = new Date();
  temp.setHours(split[0]);
  temp.setMinutes(split[1]);
  temp.setSeconds(0);
  temp.setMilliseconds(0)
  return temp.getTime() - currentTime.getTime();
}

function formateTime(hour, min, sec) {
 return   hour.toLocaleString('en-US', {minimumIntegerDigits: 2}) + ':' +
              min.toLocaleString('en-US', {minimumIntegerDigits: 2}) + ':' +
              sec.toLocaleString('en-US', {minimumIntegerDigits: 2});

}

function storePrayerTimes(value) {
  chrome.storage.local.set({ prayerTimes: value }).then(() => {
    console.log("Value is set", value);
  });
}


