export interface INft {
  address: string; // Адрес NFT
  index: number; // Индекс NFT
  owner: {
    address: string; // Адрес владельца
    is_scam: boolean; // Является ли владелец мошенником
    is_wallet: boolean; // Является ли адрес кошельком
  };
  collection: {
    address: string; // Адрес коллекции
    name: string; // Название коллекции
    description: string; // Описание коллекции
  };
  verified: boolean; // Подтверждённый статус
  metadata: {
    attributes: Array<{ trait_type: string; value: string }>; // Атрибуты NFT
    content_url: string; // URL контента
    description: string; // Описание NFT
    marketplace: string; // Маркетплейс
    content_type: string; // Тип контента
    name: string; // Название NFT
    image: string; // URL изображения
  };
  previews: Array<{
    resolution: string; // Разрешение
    url: string; // URL превью
  }>;
  approved_by: string[]; // Одобренные платформы
  trust: "whitelist"; // Доверенный статус
}
