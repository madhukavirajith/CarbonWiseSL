// frontend/src/App.js
import React, { useState } from 'react';
import ApplianceForm from './components/ApplianceForm';
import Dashboard from './components/Dashboard';
function App() {
 const [results, setResults] = useState(null);
 return (
 <div style={{ fontFamily:'Calibri, sans-serif',
 minHeight:'100vh', background:'#F4F6F8' }}>
 {/* Header */}
 <header style={{ background:'#1B2A4A', color:'white',
 padding:'16px 24px', display:'flex',
 alignItems:'center', gap:12 }}>
 <span style={{ fontSize:24, fontWeight:'bold' }}>
 CarbonWise SL
 </span>
 <span style={{ color:'#B2DDE0', fontSize:14 }}>
 AI-Powered Electricity Carbon Tracker for Sri Lanka
 </span>
 </header>
 {/* Main content */}
 <main style={{ padding:'32px 16px' }}>
 {!results ? (
 <ApplianceForm onResults={setResults} />
 ) : (
 <>
 <Dashboard results={results} />
 <div style={{ textAlign:'center', marginTop:24 }}>
 <button onClick={() => setResults(null)}
 style={{ background:'#0D7680', color:'white',
 padding:'10px 24px', border:'none',
borderRadius:8, cursor:'pointer' }}>
 Calculate Again
 </button>
 </div>
 </>
 )}
 </main>
 </div>
 );
}
export default App;