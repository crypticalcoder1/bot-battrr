import React, { useState, useEffect } from 'react';
import BotCollection from './components/BotCollection';
import YourBotArmy from './components/YourBotArmy';
import './styles.css';

function App() {
  const [bots, setBots] = useState([]);
  const [yourBotArmy, setYourBotArmy] = useState([]);

  useEffect(() => {
    // Fetch data from the JSON server running on port 8001
    fetch('http://localhost:8001/bots')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setBots(data))
      .catch(error => console.error('Error fetching bots:', error));
  }, []);

  const enlistBot = (bot) => {
    if (!yourBotArmy.some(b => b.id === bot.id)) {
      setYourBotArmy([...yourBotArmy, bot]);
    }
  };

  const releaseBot = (bot) => {
    setYourBotArmy(yourBotArmy.filter(b => b.id !== bot.id));
  };

  const dischargeBot = (bot) => {
    fetch(`http://localhost:8001/bots/${bot.id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Remove bot from both arrays after successful deletion
      setYourBotArmy(yourBotArmy.filter(b => b.id !== bot.id));
      setBots(bots.filter(b => b.id !== bot.id));
    })
    .catch(error => console.error('Error deleting bot:', error));
  };

  return (
    <div className="App">
      <YourBotArmy
        bots={yourBotArmy}
        releaseBot={releaseBot}
        dischargeBot={dischargeBot}
      />
      <BotCollection 
        bots={bots} 
        addToArmy={enlistBot} 
        onBotClick={() => {}} 
      />
    </div>
  );
}

export default App;
