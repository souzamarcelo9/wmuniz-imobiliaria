import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase'

export function useProperties(filterStatus = null) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let q = collection(db, "properties");
        
        // Se quisermos filtrar por Venda ou Locação
        if (filterStatus) {
          q = query(q, where("status", "==", filterStatus));
        }

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProperties(data);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filterStatus]);

  return { properties, loading };
}