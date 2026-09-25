import { useState, useEffect, useMemo } from 'react';
import './index.css';

const API = 'https://wares-ledger-backend-0ssd.onrender.com';
const PALETTE = ['#6366f1', '#2B6E68', '#8A5A34', '#B8860B', '#7A4B8A', '#10b981', '#ef4444'];
const emptyForm = { name: '', category: '', price: '', stock: '', color: PALETTE[0], rating: 3 };

export default function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeCat, setActiveCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('default');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState('dark');

  // Theme toggle Handler
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  function toast(msg, err = false) {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, err }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }

  async function loadProducts() {
    setStatus('loading');
    try {
      const res = await fetch(`${API}/products`);
      if (!res.ok) throw new Error();
      setProducts(await res.json());
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => { loadProducts(); }, []);

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCat !== 'All') list = list.filter((p) => p.category === activeCat);
    if (searchTerm) list = list.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    switch (sortMode) {
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'stock-asc': list.sort((a, b) => a.stock - b.stock); break;
      case 'rating-desc': list.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return list;
  }, [products, activeCat, searchTerm, sortMode]);

  const stats = useMemo(() => ({
    count: products.length,
    units: products.reduce((s, p) => s + Number(p.stock), 0),
    value: products.reduce((s, p) => s + Number(p.price) * Number(p.stock), 0),
  }), [products]);

  function openPanel(product = null) {
    setEditingId(product ? product.id : null);
    setForm(product ? { ...product } : { ...emptyForm });
    setPanelOpen(true);
  }

  async function saveEntry() {
    if (!form.name || !form.category || form.price === '') return;
    try {
      const res = editingId
        ? await fetch(`${API}/products/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
          })
        : await fetch(`${API}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
          });

      if (!res.ok) throw new Error();
      await loadProducts();
      toast(editingId ? 'Product updated.' : 'Product added to ledger.');
      setPanelOpen(false);
    } catch {
      toast('Could not save data.', true);
    }
  }

  async function doDelete(id) {
    try {
      const res = await fetch(`${API}/products/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error();
      await loadProducts();
      toast('Item removed.');
    } catch {
      toast('Could not delete item.', true);
    }
  }

  return (
    <div className="app-wrapper">
      <header>
        <div>
          <h1>Wares Ledger</h1>
          <p className="tagline">Modern inventory tracking & analytics dashboard</p>
        </div>
        <div className="header-right">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="val">{stats.count}</div>
              <div className="lbl">Items</div>
            </div>
            <div className="stat-box">
              <div className="val">{stats.units}</div>
              <div className="lbl">In Stock</div>
            </div>
            <div className="stat-box">
              <div className="val">${stats.value.toLocaleString()}</div>
              <div className="lbl">Valuation</div>
            </div>
          </div>
        </div>
      </header>

      <div className="controls">
        <input
          className="search-field"
          type="text"
          placeholder="Search items by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={activeCat} onChange={(e) => setActiveCat(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
          <option value="default">Sort: Default</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="price-asc">Sort: Price low–high</option>
          <option value="price-desc">Sort: Price high–low</option>
          <option value="stock-asc">Sort: Stock low–high</option>
          <option value="rating-desc">Sort: Rating high–low</option>
        </select>
        <button className="add-btn" onClick={() => openPanel()}>+ New Item</button>
      </div>

      {status === 'error' && (
        <div style={{ color: 'var(--danger)', textAlign: 'center', padding: '2rem' }}>
          Unable to connect to http://localhost:5000. Ensure backend is running.
        </div>
      )}

      {status === 'ok' && (
        <div className="grid">
          {filtered.map((p) => (
            <div key={p.id} className="card">
              <div className="card-top">
                <span className="dot-indicator" style={{ background: p.color || '#6366f1' }} />
                <span className="badge">{p.category}</span>
              </div>
              <div className="p-title">{p.name}</div>
              <div className="stars-row">{"★".repeat(p.rating || 3)}</div>
              <div className="price-row">
                <span className="price-tag">${Number(p.price).toFixed(2)}</span>
                <span className={`stock-tag ${p.stock < 20 ? 'low' : ''}`}>
                  {p.stock} units {p.stock < 20 ? '(Low)' : ''}
                </span>
              </div>
              <div className="actions">
                <button className="btn-icon" onClick={() => openPanel(p)}>Edit</button>
                <button className="btn-icon del" onClick={() => doDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side Panel Drawer */}
      <div className={`overlay ${panelOpen ? 'active' : ''}`} onClick={() => setPanelOpen(false)} />
      <div className={`modal ${panelOpen ? 'active' : ''}`}>
        <h2>{editingId ? 'Edit Entry' : 'New Entry'}</h2>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        
        {/* Color Palette Selector */}
        <div className="form-group">
          <label>Badge Color</label>
          <div className="color-picker-grid">
            {PALETTE.map((c) => (
              <div
                key={c}
                className={`color-swatch ${form.color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setForm({ ...form, color: c })}
              />
            ))}
          </div>
        </div>

        <button className="add-btn" style={{ marginTop: '1rem' }} onClick={saveEntry}>
          Save Entry
        </button>
      </div>

      <div id="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.err ? 'err' : ''}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
