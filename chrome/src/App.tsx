import RandomZekr from './main-zekr/random-zekr';
import './App.css';
import NextPrayer from './prayer-times/next-prayer';
import AzkarList from './day-night-azkar/azkar-list';
import myData from './day-night-azkar/azkar_sabah.json';

function App() {
  return (
    <div className="App">
      <div className='bp5-dark' id='main-container'>
        {/* <RandomZekr/>
         */}
         <NextPrayer/>
        <AzkarList azkar={myData.content} title={'أذكار الصباح'}/>
      </div>
    </div>
  );
}

export default App;
