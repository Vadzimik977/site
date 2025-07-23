export const url = process.env.VITE_BACKEND;

export const getPlanet = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api2/planet/${id}`);
  if (!res.ok) throw new Error('Ошибка при получении данных планеты');
  return res.json();
};

export const getPlanetImage = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api2/planet/${id}/image`);
  if (!res.ok) throw new Error('Ошибка при получении изображения планеты');
  return res.json();
};

export const getPlanetWiki = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api2/planet/${id}/wiki`);
  if (!res.ok) throw new Error('Ошибка при получении вики-информации о планете');
  return res.json();
};
