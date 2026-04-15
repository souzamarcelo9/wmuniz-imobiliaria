import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { motion } from 'framer-motion';
import { UserCheck, Clock, MessageSquare, Trash2 } from 'lucide-react';

export default function LeadsPanel() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "leads", id), { status: newStatus });
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black mb-8">Gestão de Leads</h1>
      
      <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Imóvel de Interesse</th>
              <th className="px-6 py-4">Data/Hora</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-6">
                  <p className="font-bold text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.email} | {lead.phone}</p>
                </td>
                <td className="px-6 py-6 text-sm font-medium text-amber-600">
                  {lead.propertyTitle}
                </td>
                <td className="px-6 py-6 text-xs text-gray-400">
                  {lead.createdAt?.toDate().toLocaleString('pt-BR')}
                </td>
                <td className="px-6 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    lead.status === 'Novo' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <select 
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className="text-xs border rounded-lg p-1 outline-none"
                    value={lead.status}
                  >
                    <option value="Novo">Novo</option>
                    <option value="Em Atendimento">Em Atendimento</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}