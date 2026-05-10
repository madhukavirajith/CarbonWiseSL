// frontend/src/components/ApplianceForm.js
import React, { useState } from 'react';
import { predictEmissions, explainPrediction, getCluster } from '../api';
const defaultForm = {
 city: 'Colombo', occupants: 3, ceb_units: 150,
 has_ac: 0, ac_hours: 0, ac_temp: 24,
 has_fridge: 1, has_heater: 0, heater_hours: 0,
 num_fans: 2, fan_hours: 8, num_tvs: 1, tv_hours: 4,
 has_washer: 0, washer_loads: 0,
 led_count: 6, old_bulb_count: 0,
 has_computer: 1, computer_hours: 4
};
function ApplianceForm({ onResults }) {
 const [form, setForm] = useState(defaultForm);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const handleChange = (e) => {
 const { name, value, type } = e.target;
 setForm(prev => ({
 ...prev,
 [name]: type === 'checkbox' ? (e.target.checked ? 1 : 0) :
parseFloat(value) || value
 }));
 };
 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 setError('');
 try {
 // Call all three endpoints simultaneously
 const [predRes, explRes, clusterRes] = await Promise.all([
 predictEmissions(form),
 explainPrediction(form),
 getCluster(form)
 ]);
 onResults({
 prediction: predRes.data,
 explanation: explRes.data,
 cluster: clusterRes.data,
 formData: form
 });
 } catch (err) {
  setError('Could not connect to server. Make sure FastAPI is running.');
 console.error(err);
 }
 setLoading(false);
 };
 return (
 <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
 <h2 style={{ color: '#1B2A4A' }}>Enter Your Household Details</h2>
 <form onSubmit={handleSubmit}>
 {/* City */}
 <div style={{ marginBottom: 16 }}>
 <label>City:</label>
 <select name='city' value={form.city} onChange={handleChange}
 style={{ width:'100%', padding:8, marginTop:4 }}>
 <option>Colombo</option>
 <option>Kandy</option>
 <option>Galle</option>
 </select>
 </div>
 {/* Occupants */}
 <div style={{ marginBottom: 16 }}>
 <label>Number of people in household: {form.occupants}</label>
 <input type='range' name='occupants' min={1} max={10}
 value={form.occupants} onChange={handleChange}
 style={{ width:'100%' }} />
 </div>
 {/* CEB Units */}
 <div style={{ marginBottom: 16 }}>
 <label>Last month CEB bill (units):</label>
 <input type='number' name='ceb_units' value={form.ceb_units}
 onChange={handleChange} min={0} max={2000}
 style={{ width:'100%', padding:8, marginTop:4 }} />
 </div>
 {/* Air Conditioner */}
 <div style={{ marginBottom: 16, padding:16,
 background:'#E6F4F5', borderRadius:8 }}>
 <label>
 <input type='checkbox' name='has_ac'
 checked={form.has_ac === 1} onChange={handleChange} />
 {' '}<strong>Air Conditioner</strong>
 </label>
 {form.has_ac === 1 && (<>
 <div style={{ marginTop:8 }}>
 <label>Hours per day: {form.ac_hours}</label>
 <input type='range' name='ac_hours' min={0} max={24}
 value={form.ac_hours} onChange={handleChange}
 style={{ width:'100%' }} />
 </div>
 <div style={{ marginTop:8 }}>
 <label>Temperature setting: {form.ac_temp}°C</label>
 <input type='range' name='ac_temp' min={16} max={30}
 value={form.ac_temp} onChange={handleChange}
 style={{ width:'100%' }} />
 </div>
 </>)}
 </div>
 {/* Fans */}
 <div style={{ marginBottom: 16 }}>
 <label>Number of fans: {form.num_fans}</label>
 <input type='range' name='num_fans' min={0} max={10}
 value={form.num_fans} onChange={handleChange}
 style={{ width:'100%' }} />
 <label>Hours per day: {form.fan_hours}</label>
 <input type='range' name='fan_hours' min={0} max={24}
 value={form.fan_hours} onChange={handleChange}
 style={{ width:'100%' }} />
 </div>
 {error && <p style={{ color:'red' }}>{error}</p>}
 <button type='submit' disabled={loading}
 style={{ background:'#0D7680', color:'white',
 padding:'12px 32px', border:'none',
 borderRadius:8, fontSize:16, cursor:'pointer',
 width:'100%' }}>
 {loading ? 'Calculating...' : 'Calculate My Carbon Footprint'}
 </button>
 </form>
 </div>
 );
 }
export default ApplianceForm;
