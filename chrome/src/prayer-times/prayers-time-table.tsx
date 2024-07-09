import { Card } from '@blueprintjs/core';
import './prayers-time-table.css';
import { prayerNames } from './constants';

interface PrayersTimeTableProps {
    prayerTimes: Record<string, string>
}

function PrayersTimeTable(props : PrayersTimeTableProps) {
    return (
        <div className='prayers-time-table-container'>
            <Card>
                <table>
                    <tbody>
                    {
                        Object.keys(prayerNames).map((key, index) => ( 
                        <tr key={index}> <td>{props.prayerTimes[key]}</td><td>{prayerNames[key]}</td></tr>
                        ))
                    }      
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

export default PrayersTimeTable;

// {
//     Object.keys(props.prayerTimes ?? {}).map((key, index) => ( 
//     <tr key={index}> <td>{prayerNames[key]}</td><td>{props.prayerTimes[key]}</td></tr>
//     ))
// }  