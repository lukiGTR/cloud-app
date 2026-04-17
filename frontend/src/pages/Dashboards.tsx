import { useEffect, useState } from 'react';
import api from '../services/api';

interface CloudTask {
  id: number;
  name: string;
  isCompleted: boolean;
}

const Dashboard = () => {
  const [items, setItems] = useState<CloudTask[]>([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setItems(res.data);
      setError('');
    } catch (err) {
      console.error('Szczegóły błędu:', err);
      setError('Błąd połączenia z API. Sprawdź, czy backend działa na porcie 8081.');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Podaj nazwę zadania');
      return;
    }

    try {
      await api.post('/tasks', {
        name,
        isCompleted
      });

      setName('');
      setIsCompleted(false);
      await loadTasks();
    } catch (err) {
      console.error('Błąd podczas dodawania zadania:', err);
      alert('Nie udało się dodać zadania');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      await loadTasks();
    } catch (err) {
      console.error('Błąd podczas usuwania zadania:', err);
      alert('Nie udało się usunąć zadania');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>Cloud App Dashboard</h1>

      {error && (
        <div
          style={{
            background: '#fff3cd',
            color: '#856404',
            padding: '10px',
            borderRadius: '5px',
            margin: '20px auto',
            maxWidth: '500px'
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          margin: '20px auto',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '10px',
          background: '#f8f9fa'
        }}
      >
        <input
          type="text"
          placeholder="Nazwa zadania"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          Zadanie ukończone
        </label>

        <button type="submit">Dodaj zadanie</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {items.length === 0 && !error && <p>Brak zadań w bazie.</p>}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                background: '#f8f9fa',
                margin: '5px',
                padding: '10px 20px',
                borderRadius: '8px',
                borderLeft: item.isCompleted ? '5px solid green' : '5px solid gray',
                width: '350px',
                color: '#000',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span style={{ textAlign: 'left', flex: 1 }}>
                <strong>{item.name}</strong> {item.isCompleted ? '✅' : '⏳'}
              </span>

              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;