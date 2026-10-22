import React, { useState } from 'react';
import { initialDemands } from './data/mockDemands';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { DemandsList } from './components/DemandsList';
import { DemandForm } from './components/DemandForm';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [demands, setDemands] = useState(initialDemands);

  const handleAddDemand = (newDemand) => {
    setDemands([newDemand, ...demands]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'demands' && <DemandsList demands={demands} />}
        {activeTab === 'new' && <DemandForm onAddDemand={handleAddDemand} setActiveTab={setActiveTab} />}
      </main>

      <Footer />
    </div>
  );
}