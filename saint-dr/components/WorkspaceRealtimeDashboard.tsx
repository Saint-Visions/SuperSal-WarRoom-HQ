"use client";
import React, { useEffect, useState } from 'react';

const WorkspaceRealtimeDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/workspace/realtime')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-sm text-gray-500">Loading workspace data...</div>;
  if (!data) return <div className="p-4 text-sm text-red-500">Error loading data.</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">📊 Realtime System Dashboard</h2>

      <div>
        <h3 className="text-lg font-semibold">🛡️ War Room</h3>
        <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(data.warroom, null, 2)}</pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold">🧠 SaintSalMe</h3>
        <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(data.saintsalme, null, 2)}</pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold">💻 System Health</h3>
        <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(data.systemHealth, null, 2)}</pre>
      </div>

      <div>
        <h3 className="text-lg font-semibold">🚀 Performance</h3>
        <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(data.performance, null, 2)}</pre>
      </div>
    </div>
  );
};

export default WorkspaceRealtimeDashboard;
