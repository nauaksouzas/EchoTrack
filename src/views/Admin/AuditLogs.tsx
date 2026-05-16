import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Common';
import { format } from 'date-fns';

export function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/audit', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight text-[#0A0A0A]">Audit Logs</h1>
          <p className="text-[#6B7280] text-xs uppercase tracking-widest mt-1">System Security & Activity Records</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F9FAFB] text-[#6B7280] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-[#E5E7EB]">Timestamp</th>
                <th className="px-6 py-4 font-bold border-b border-[#E5E7EB]">Actor</th>
                <th className="px-6 py-4 font-bold border-b border-[#E5E7EB]">Role</th>
                <th className="px-6 py-4 font-bold border-b border-[#E5E7EB]">Action</th>
                <th className="px-6 py-4 font-bold border-b border-[#E5E7EB]">Entity</th>
                <th className="px-6 py-4 font-bold border-b border-[#E5E7EB] w-full">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-medium whitespace-nowrap">
                    {format(new Date(log.createdAt), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{log.actorId ? log.actorId.substring(0, 8) + '...' : 'System'}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{log.actorRole || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 bg-gray-100 text-gray-800 text-[10px] uppercase font-bold rounded-md ${
                      log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                      log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                      log.action === 'DELETE' ? 'bg-red-100 text-red-800' : ''
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{log.entityType}</td>
                  <td className="px-6 py-4 text-gray-500 truncate max-w-sm" title={log.description}>{log.description}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No audit logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
