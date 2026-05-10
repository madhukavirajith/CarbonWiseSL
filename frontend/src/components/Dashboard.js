// frontend/src/components/Dashboard.js
import React from 'react';
import {
 BarChart, Bar, XAxis, YAxis, CartesianGrid,
 Tooltip, ResponsiveContainer, Cell
} from 'recharts';
// Colour scale for SHAP bars
const getColor = (value) => value > 0 ? '#C0392B' : '#1A7A4A';
function Dashboard({ results }) {
 if (!results) return null;
 const { prediction, explanation, cluster } = results;
 // Prepare SHAP chart data — top 8 features only
 const shapData = explanation.shap_values
 .slice(0, 8)
 .map(sv => ({
 name: sv.feature.replace(/_/g, ' '),
 value: sv.shap_value,
 percent: sv.contribution_percent
 }));
 // Emission level colour
 const levelColor = {
 Low: '#1A7A4A', Medium: '#C8932A', High: '#C0392B'
 }[prediction.emission_level] || '#1B2A4A';
 return (
 <div style={{ maxWidth:800, margin:'0 auto', padding:24 }}>
 {/* Summary Cards */}
 <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
 gap:16, marginBottom:32 }}>
 <div style={{ background:'#1B2A4A', color:'white',
 padding:20, borderRadius:12, textAlign:'center' }}>
 <div style={{ fontSize:13, color:'#B2DDE0' }}>Daily CO₂</div>
 <div style={{ fontSize:32, fontWeight:'bold' }}>
 {prediction.daily_co2_kg}
 </div>
 <div style={{ fontSize:13, color:'#B2DDE0' }}>kg CO₂</div>
 </div>
 <div style={{ background:'#0D7680', color:'white',
 padding:20, borderRadius:12, textAlign:'center' }}>
 <div style={{ fontSize:13, color:'#B2DDE0' }}>Monthly CO₂</div>
 <div style={{ fontSize:32, fontWeight:'bold' }}>
 {prediction.monthly_co2_kg}
 </div>
 <div style={{ fontSize:13, color:'#B2DDE0' }}>kg CO₂</div>
 </div>
 <div style={{ background:levelColor, color:'white',
 padding:20, borderRadius:12, textAlign:'center' }}>
 <div style={{ fontSize:13, opacity:0.8 }}>Level</div>
 <div style={{ fontSize:28, fontWeight:'bold' }}>
 {prediction.emission_level}
 </div>
 <div style={{ fontSize:13, opacity:0.8 }}>
 LKR {prediction.monthly_cost_lkr.toLocaleString()}
 </div>
 </div>
 </div>
 {/* SHAP Waterfall Chart */}
 <div style={{ background:'white', padding:24,
 borderRadius:12, boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
 marginBottom:24 }}>
 <h3 style={{ color:'#1B2A4A', marginTop:0 }}>
 Which Appliances Contribute Most?
 </h3>
 <p style={{ color:'#666', fontSize:14 }}>
 Red bars increase your CO₂. Green bars reduce it.
 </p>
 <ResponsiveContainer width='100%' height={300}>
 <BarChart data={shapData} layout='vertical'
 margin={{ left:80, right:20 }}>
 <CartesianGrid strokeDasharray='3 3' />
 <XAxis type='number' label={{
 value:'CO₂ impact (kg)', position:'insideBottom', offset:-5
 }}/>
 <YAxis type='category' dataKey='name' width={100}
 tick={{ fontSize:12 }}/>
 <Tooltip
 formatter={(val) => [`${val.toFixed(4)} kg CO₂`, 'Impact']}
 />
 <Bar dataKey='value'>
 {shapData.map((entry, i) => (
 <Cell key={i} fill={getColor(entry.value)} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 {/* Cluster Recommendations */}
 <div style={{ background:'#FDF6E3', padding:24,
 borderRadius:12, border:'1px solid #C8932A' }}>
 <h3 style={{ color:'#1B2A4A', marginTop:0 }}>
 Your Profile: {cluster.cluster_name}
 </h3>
 <p style={{ color:'#666', fontSize:14 }}>
 Personalised recommendations for your household:
 </p>
 <ul style={{ paddingLeft:20 }}>
 {cluster.recommendations.map((rec, i) => (
 <li key={i} style={{ marginBottom:8,
 color:'#1B2A4A', lineHeight:1.5 }}>
{rec}
 </li>
 ))}
 </ul>
 </div>
 </div>
 );
}
export default Dashboard;
