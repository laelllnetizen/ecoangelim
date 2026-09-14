/* ' ECOANGELIM - js/loja/data/estadoLoja.js ' */
export const estadoLoja = {
  lojas: [
    {
      id: 1,
      nome: "Verde & Vida",
      categoria: "Produtos naturais",
      logo: "🌿",
      localizacao: "https://www.google.com/maps/search/?api=1&query=Angelim+PE",
      itens: [
        { id: 101, nome: "Muda nativa", quantidade: 2, preco: 80, imagem: "🌱" },
        { id: 102, nome: "Kit sementes", quantidade: 8, preco: 120, imagem: "🌻" },
        { id: 103, nome: "Ecobag", quantidade: 5, preco: 150, imagem: "👜" },
        { id: 104, nome: "Vaso reciclado", quantidade: 3, preco: 180, imagem: "🪴" }
      ]
    },
    {
      id: 2,
      nome: "Comércio Angelim",
      categoria: "Comércio local",
      logo: "🏪",
      localizacao: "https://www.google.com/maps/search/?api=1&query=Comercio+Angelim+PE",
      itens: [
        { id: 201, nome: "Desconto 5%", quantidade: 20, preco: 100, imagem: "🏷️" },
        { id: 202, nome: "Café local", quantidade: 10, preco: 140, imagem: "☕" },
        { id: 203, nome: "Produto artesanal", quantidade: 6, preco: 200, imagem: "🧺" }
      ]
    },
    {
      id: 3,
      nome: "EcoLar",
      categoria: "Casa sustentável",
      logo: "🏡",
      localizacao: "https://www.google.com/maps/search/?api=1&query=Angelim+Pernambuco",
      itens: [
        { id: 301, nome: "Lâmpada LED", quantidade: 15, preco: 90, imagem: "💡" },
        { id: 302, nome: "Sabão ecológico", quantidade: 9, preco: 110, imagem: "🧼" },
        { id: 303, nome: "Kit reutilizável", quantidade: 4, preco: 220, imagem: "♻️" }
      ]
    }
  ]
};
