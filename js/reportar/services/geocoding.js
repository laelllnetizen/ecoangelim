export async function obterEnderecoPorCoordenadas(lat, lng) {
  try {
    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );

    if (!resposta.ok) throw new Error("Erro no serviço de mapas");

    const dados = await resposta.json();
    return dados.display_name;
  } catch (erro) {
    // Retorna fallback formatado em coordenadas
    const coordenadasTxt = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    return {
      erro: true,
      fallbackTexto: "Endereço não encontrado. Coordenadas utilizadas.",
      coordenadas: coordenadasTxt
    };
  }
}
