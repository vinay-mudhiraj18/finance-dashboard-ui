const { useState, useMemo } = React;

/* -------------------- CONSTANTS -------------------- */
const CATEGORIES = [
  'Food','Rent','Salary','Transport','Entertainment','Health','Shopping','Freelance'
];

const COLORS = ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899'];

const DATA = [
  { id:1, date:'2026-02-03', amount:32000, category:'Salary', type:'income' },
  { id:2, date:'2026-02-05', amount:8000,  category:'Rent',   type:'expense' },
  { id:3, date:'2026-02-08', amount:1200,  category:'Food',   type:'expense' },
];

/* -------------------- HELPERS -------------------- */
const formatINR = n => '₹' + Number(n).toLocaleString('en-IN');

/* -------------------- SECTION TOGGLE -------------------- */
function Section({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="section-block">
      <div className="section-header" onClick={() => setOpen(!open)}>
        <span className="section-title">{title}</span>
        <span>{open ? '▲' : '▼'}</span>
      </div>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

/* -------------------- CHARTS -------------------- */
function LineChart({ txns }) {
  if (!txns.length) return <div className="empty-state">No data</div>;

  const sorted = [...txns].sort((a,b)=>a.date.localeCompare(b.date));
  let balance = 0;

  const points = sorted.map(t=>{
    balance += t.type==='income'?t.amount:-t.amount;
    return balance;
  });

  return <div className="empty-state">Chart Rendered (SVG)</div>;
}

function BarChart({ txns }) {
  return <div className="empty-state">Bar Chart (SVG)</div>;
}

/* -------------------- FORM -------------------- */
function TxnForm({ onSave, onCancel, initial }) {
  const [form, setForm] = useState(initial || {
    date:'', amount:'', category:'Food', type:'expense'
  });

  function handleSubmit() {
    if(!form.date || !form.amount) return alert("Fill all fields");
    onSave({...form, amount:Number(form.amount)});
  }

  return (
    <div className="card">
      <div className="form-grid">
        <input type="date" onChange={e=>setForm({...form,date:e.target.value})}/>
        <input type="number" placeholder="Amount"
          onChange={e=>setForm({...form,amount:e.target.value})}/>
        <select onChange={e=>setForm({...form,category:e.target.value})}>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
        <select onChange={e=>setForm({...form,type:e.target.value})}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="form-actions">
        <button className="btn btn-blue" onClick={handleSubmit}>Save</button>
        <button className="btn btn-grey" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* -------------------- TRANSACTIONS -------------------- */
function Transactions({ txns, role, onAdd }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {role === 'admin' && (
        <>
          {showForm
            ? <TxnForm onSave={(t)=>{onAdd(t);setShowForm(false)}} onCancel={()=>setShowForm(false)}/>
            : <button className="btn btn-blue" onClick={()=>setShowForm(true)}>+ Add Transaction</button>
          }
        </>
      )}

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {txns.map(t=>(
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.category}</td>
              <td>{formatINR(t.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------- APP -------------------- */
function App() {
  const [txns, setTxns] = useState(DATA);
  const [role, setRole] = useState('viewer');

  function addTxn(t) {
    setTxns(prev => [...prev, {...t, id:Date.now()}]);
  }

  return (
    <div>
      {/* HEADER */}
      <div className="header">
        <h1>Finance Dashboard</h1>

        <div className="role-area">
          <button className={role==='viewer'?'role-btn viewer-on':'role-btn'}
            onClick={()=>setRole('viewer')}>Viewer</button>

          <button className={role==='admin'?'role-btn admin-on':'role-btn'}
            onClick={()=>setRole('admin')}>Admin</button>
        </div>
      </div>

      <div className="container">

        {/* SUMMARY */}
        <div className="summary-row">
          <div className="card">Balance</div>
          <div className="card">Income</div>
          <div className="card">Expenses</div>
        </div>

        <Section title="Transactions">
          <Transactions txns={txns} role={role} onAdd={addTxn}/>
        </Section>

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);