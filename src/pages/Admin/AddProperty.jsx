import { useState } from 'react';
import { motion } from 'framer-motion';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UploadCloud, X, PlusCircle, LoaderCircle } from 'lucide-react';

export default function AddProperty() {
  const [formData, setFormData] = useState({
    title: '', price: '', neighborhood: '', city: 'São Paulo',
    area: '', rooms: '', bathrooms: '', type: 'Apartamento', status: 'Venda'
  });
  const [images, setImages] = useState([]); // Arquivos originais
  const [previews, setPreviews] = useState([]); // URLs para visualização
  const [loading, setLoading] = useState(false);

  // 1. Gerenciar seleção de imagens e previews
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // 2. Remover imagem selecionada
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // 3. Função principal de upload e salvamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Adicione pelo menos uma imagem.");
    setLoading(true);

    try {
      // Step 3a: Upload das imagens para o Storage
      const imageUrls = [];
      for (const image of images) {
        // Cria uma referência única para cada imagem: /properties/timestamp_nome.jpg
        const storageRef = ref(storage, `properties/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadURL);
      }

      // Step 3b: Preparar os dados finais (converter strings para números)
      const finalData = {
        ...formData,
        price: parseFloat(formData.price),
        area: parseInt(formData.area),
        rooms: parseInt(formData.rooms),
        bathrooms: parseInt(formData.bathrooms),
        image: imageUrls[0], // Foto principal
        images: imageUrls,    // Galeria completa
        createdAt: serverTimestamp(),
        coordinates: { lat: -23.5505, lng: -46.6333 } // Coordenada mockada por enquanto
      };

      // Step 3c: Salvar no Firestore
      await addDoc(collection(db, "properties"), finalData);

      alert("Imóvel cadastrado com sucesso!");
      // Limpar formulário
      setFormData({ title: '', price: '', neighborhood: '', city: 'São Paulo', area: '', rooms: '', bathrooms: '', type: 'Apartamento', status: 'Venda' });
      setImages([]);
      setPreviews([]);

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar imóvel.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-accent outline-none";

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-28 pb-20 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10 border-b pb-6 border-gray-100">
        <h1 className="text-4xl font-black text-gray-900">Novo Imóvel</h1>
        {loading && <LoaderCircle className="animate-spin text-accent" size={32} />}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Coluna 1: Dados */}
        <div className="space-y-6">
          <input required type="text" placeholder="Título do Anúncio (ex: Cobertura Duplex no Jardins)" className={inputClass} onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Preço (R$)" className={inputClass} onChange={e => setFormData({...formData, price: e.target.value})} />
            <select className={inputClass} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="Venda">Venda</option>
              <option value="Locação">Locação</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="Bairro" className={inputClass} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
            <input required type="text" placeholder="Cidade" className={inputClass} defaultValue="São Paulo" onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>

          <div className="grid grid-cols-3 gap-4 border-t pt-6 border-gray-100">
            <input required type="number" placeholder="Área m²" className={inputClass} onChange={e => setFormData({...formData, area: e.target.value})} />
            <input required type="number" placeholder="Quartos" className={inputClass} onChange={e => setFormData({...formData, rooms: e.target.value})} />
            <input required type="number" placeholder="Banheiros" className={inputClass} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50">
            {loading ? 'Cadastrando...' : <><PlusCircle size={22} /> Publicar Imóvel</>}
          </button>
        </div>

        {/* Coluna 2: Upload de Imagens */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <label className="text-lg font-bold text-gray-700 flex items-center gap-2">
            <UploadCloud className="text-accent" /> Galeria de Fotos (Múltiplas)
          </label>
          
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-accent transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
              <UploadCloud size={32} className="mb-3 text-gray-400" />
              <p className="mb-2 text-sm">Clique ou arraste para enviar</p>
              <p className="text-xs">PNG, JPG ou WEBP (Max. 5MB por foto)</p>
            </div>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          {/* Área de Preview */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {previews.map((url, index) => (
              <div key={index} className="relative group h-24 rounded-lg overflow-hidden border">
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                {index === 0 && (
                  <div className="absolute top-0 left-0 bg-accent text-white text-[10px] px-2 py-0.5 rounded-br-md font-bold uppercase">
                    Capa
                  </div>
                )}
                <button 
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </motion.main>
  );
}