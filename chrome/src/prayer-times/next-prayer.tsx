import { Button, Card, H4, Section, SectionCard } from '@blueprintjs/core';
import './next-prayer.css';
import { useEffect, useState } from 'react';
import PrayersTimeTable from './prayers-time-table';
import { ONE_HOUR, ONE_MINUTE, city, country, prayerNames } from './constants';

function NextPrayer() {
    const [prayerTimes, setPrayerTimes] = useState({} as any);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState({
        name: ' ',
        time: null,
        diff: '00:00:00',
    });
    const [prayerUpdateInterval, setPrayerUpdateInterval] = useState(-1);
    const [showPrayersTimeTable, setShowPrayersTimeTable] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(["prayerTimes"]).then((result: any) => {
            console.log('reading local storage', result);
            if (result.prayerTimes) {
                setPrayerTimes(result.prayerTimes);
            } else {
                loadPrayerTimes();
            }
        });
    }, []); // Does not run again (except once in development)

    useEffect(() => {
        const newInterval = window.setInterval(play , 1000);
        window.clearInterval(prayerUpdateInterval);
        setPrayerUpdateInterval(newInterval);
    }, [prayerTimes]);

    useEffect(() => {
        updateClosestPrayerInfo();
    }, [currentTime]);

    function loadPrayerTimes() {
        console.log("calling API....");
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`;
        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                storePrayerTimes(json.data);
                setPrayerTimes(json.data);
                console.log(prayerTimes);
            });
    }

    function updateClosestPrayerInfo() {
        if (!prayerTimes?.timings) {
            return;
        }
        const cur = new Date();
        console.log('updating ' + cur);
        const keyNames = Object.keys(prayerNames);
        var recentPrayer = '';
        var recentDiff = ONE_HOUR * 24; // max so it will be replaced in first round
        for (const k in prayerTimes.timings) {
            if (keyNames.includes(k)) {
                const diff = getTimeDiff(prayerTimes.timings[k]);
                if (diff > 0 && diff < recentDiff) {
                    recentDiff = diff;
                    recentPrayer = k;
                }
            }
        }

        var diffx = recentDiff;
        const hour = Math.floor(diffx / ONE_HOUR);
        diffx = diffx - (hour * ONE_HOUR);
        const min = Math.floor(diffx / ONE_MINUTE);
        diffx = diffx - (min * ONE_MINUTE);
        const sec = Math.floor(diffx / 1000);
        const diff = `${formateTime(hour, min, sec)}`;
        console.log('next diff', diff);
        setNextPrayer({
            name: prayerNames[recentPrayer],
            time: prayerTimes.timings[recentPrayer],
            diff,
        })
    }

    function getTimeDiff(time: string) {
        const split = time.split(':')
        var temp = new Date();
        temp.setHours(+split[0]);
        temp.setMinutes(+split[1]);
        temp.setSeconds(0);
        temp.setMilliseconds(0)
        return temp.getTime() - currentTime.getTime();
    }

    function formateTime(hour: number, min: number, sec: number) {
        return hour.toLocaleString('en-US', { minimumIntegerDigits: 2 }) + ':' +
            min.toLocaleString('en-US', { minimumIntegerDigits: 2 }) + ':' +
            sec.toLocaleString('en-US', { minimumIntegerDigits: 2 });

    }

    function storePrayerTimes(value: any) {
        chrome.storage.local.set({ prayerTimes: value }).then(() => {
            console.log("Value is set", value);
        });
    }

    function play() {
        setCurrentTime(new Date());
    }
    function triggerPrayersTimeTable() {
        setShowPrayersTimeTable(!showPrayersTimeTable); // TODO more actions if needed
    }

    return (
        <div>
            <div className='nextprayer-container'>
                <Section title={<div className='nextprayer-details'>
                    {/* <span>{nextPrayer.time}</span>
                    <span>{nextPrayer.name}</span> */}
                    <span>باقي على أذان  {nextPrayer.name}</span> 
                </div>}>
                <SectionCard >
                    <div className='nextprayer-diff'>{nextPrayer.diff}</div>
                </SectionCard>
                {!showPrayersTimeTable && <Button icon="double-chevron-down" fill={true} onClick={triggerPrayersTimeTable} />}
                {showPrayersTimeTable && <Button icon="double-chevron-up" fill={true} onClick={triggerPrayersTimeTable} />}
                </Section>
            </div>
            {showPrayersTimeTable && <PrayersTimeTable prayerTimes={prayerTimes.timings}/>}
        </div>

    );
}

export default NextPrayer;
