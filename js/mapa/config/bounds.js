// Limite máximo de exploração (Câmera)
export const limitesExploracao = L.latLngBounds(
  [-8.945, -36.306], // Sudoeste
  [-8.865, -36.250]  // Nordeste
);

// Limites das Grades Lógicas
export const limitesCentro = L.latLngBounds(
  [-8.905, -36.303],
  [-8.878, -36.270]
);

export const limitesQuatroBocas = L.latLngBounds(
  [-8.942, -36.300],
  [-8.930, -36.286]
);

// Estilo visual clean para guiar o usuário a clicar dentro dos retângulos
export const estiloSelecionavel = {
  color: "#2E7D32",      // Verde padrão do projeto
  weight: 2,             // Espessura fina
  dashArray: "5, 5",     // Linha tracejada suave
  fillColor: "#2E7D32",
  fillOpacity: 0.05,     // Fundo muito sutil
  interactive: false     // Não interfere nos cliques do mapa
};

// Configuração das subdivisões
export const configCentro = { linhas: 3, colunas: 4, inicioNum: 1 };
export const configQuatroBocas = { linhas: 1, colunas: 2, inicioNum: 13 };
