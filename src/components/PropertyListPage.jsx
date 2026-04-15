const properties = [
  {
    id: 1,
    title: "Highland Apartments",
    price: 1250000,
    neighborhood: "Jardins, SP",
    area: 120,
    rooms: 3,
    bathrooms: 2,
    status: "Venda",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687940-4e5a994239b7?auto=format&fit=crop&w=800&q=80"
    ]
  },
  // Adicione mais imóveis aqui...
];

export default function PropertyListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {properties.map((p, index) => (
          <PropertyCard key={p.id} property={p} index={index} />
        ))}
      </div>
    </div>
  );
}