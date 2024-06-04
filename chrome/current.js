
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
const currentTime = new Date();
const ONE_HOUR = 60 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

loadAzkar();
loadPrayerTimes();

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
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`;
  fetch(url)
      .then((response) => response.json()) 
      .then((json) => {
        // console.log(json);
        const timings = json.data.timings;
        // todo save them locally every day
        const result = getClosestPrayerInfo(timings);
        document.getElementById("next-prayer-name").innerHTML = result.name;
        document.getElementById("next-prayer-time").innerHTML = result.time;
        document.getElementById("next-prayer-diff").innerHTML = result.diff;
  });
}

function getClosestPrayerInfo(timings) {
  const keyNames = Object.keys(prayerNames);
  var recentPrayer = '';
  var recentDiff = ONE_HOUR * 24; // max so it will be replaced in first round
  for (k in timings) {
    if (keyNames.includes(k)) {
      const diff = getTimeDiff(timings[k]);
      if(diff < recentDiff) {
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
  return {
    name: prayerNames[recentPrayer],
    time: timings[recentPrayer],
    diff: `${hour.toLocaleString('en-US', {minimumIntegerDigits: 2})}:${min.toLocaleString('en-US', {minimumIntegerDigits: 2})}:${sec.toLocaleString('en-US', {minimumIntegerDigits: 2})}`,
  };
}

function getTimeDiff(time) {
  const split = time.split(':')
  var temp = new Date();
  temp.setHours(split[0]);
  temp.setMinutes(split[1]);
  temp.setSeconds(0);
  temp.setMilliseconds(0)
  return Math.abs(temp.getTime() - currentTime.getTime());
}