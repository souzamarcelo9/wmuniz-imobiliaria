import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const createLead = async (leadData) => {
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...leadData,
      status: "Novo", // Status inicial para o seu CRM
      createdAt: serverTimestamp(), // Data e hora do servidor
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao salvar lead:", error);
    return { success: false, error };
  }
};

export const saveLead = async (leadData) => {
  try {
    await addDoc(collection(db, "leads"), {
      ...leadData,
      createdAt: serverTimestamp(),
      status: "novo", // para você controlar no seu CRM
      origem: leadData.origem || "geral" // chat, formulario_nao_encontrei, cadastro
    });
    return true;
  } catch (e) {
    console.error("Erro ao salvar lead: ", e);
    return false;
  }
};