import logo from './logo.svg';
import './App.css';
import ImportButton from './components/ImportButton';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>COURT MANAGER</h1>
        <ImportButton shouldShowTestButton={true}></ImportButton>
      </header>
    </div>
  );
}

export default App;
