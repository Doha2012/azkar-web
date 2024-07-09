import { Callout, H4 } from '@blueprintjs/core';
import myData from './data.json';
import './random-zekr.css';

function RandomZekr() {
    const allAzkar = myData.azkar;
    const index = Math.floor(Math.random() * allAzkar.length);
    
    return (
        <div className='zekr-container'>
             <Callout>
                <H4> {myData.azkar[index]} </H4>
            </Callout>
        </div>
    );
}

export default RandomZekr;
