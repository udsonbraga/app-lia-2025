
/**
 * Utility functions for handling Telegram messaging
 */

/**
 * Gets the current location of the user
 * @returns Promise with the current position or null if failed
 */
const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log("Geolocalização não suportada pelo navegador");
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

/**
 * Sends a message via Telegram Bot to the specified chat ID
 * @param telegramId The Telegram chat ID to send the message to
 * @returns Promise resolving to boolean indicating success/failure
 */
export const sendTelegramMessage = async (telegramId: string): Promise<boolean> => {
  try {
    const botToken = "7668166969:AAFnukkbhjDnUgGTC5em6vYk1Ch7bXy-rBQ";
    
    // Get user name from localStorage
    const userName = localStorage.getItem("userName") || "Alguém";
    
    // Get current location
    const location = await getCurrentLocation();
    
    // Create message with or without location
    let message = `🚨 ALERTA DE EMERGÊNCIA 🚨\n\n${userName} está em perigo e precisa de sua ajuda! Entre em contato imediatamente.`;
    
    if (location) {
      const googleMapsUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
      message += `\n\n📍 Localização atual:\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}\n\n🗺️ Ver no Google Maps: ${googleMapsUrl}`;
    } else {
      message += `\n\n⚠️ Não foi possível obter a localização atual.`;
    }
    
    // URL da API do Telegram para enviar mensagem
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Verificar se o telegramId é válido
    if (!telegramId || telegramId.trim() === "") {
      console.error("ID do Telegram inválido");
      return false;
    }
    
    console.log("Tentando enviar mensagem para Telegram ID:", telegramId);
    
    // Preparar o corpo da requisição
    const requestBody = {
      chat_id: telegramId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: false
    };
    
    // Fazer a requisição para a API do Telegram
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`Erro ao enviar mensagem: ${response.statusText}`, data);
      return false;
    }
    
    console.log('Mensagem enviada com sucesso para Telegram ID:', telegramId, data);
    
    // If location was obtained, also send location as a separate message
    if (location) {
      const locationApiUrl = `https://api.telegram.org/bot${botToken}/sendLocation`;
      const locationRequestBody = {
        chat_id: telegramId,
        latitude: location.latitude,
        longitude: location.longitude,
        live_period: 900 // Share live location for 15 minutes
      };
      
      try {
        const locationResponse = await fetch(locationApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(locationRequestBody),
        });
        
        if (locationResponse.ok) {
          console.log('Localização enviada com sucesso');
        }
      } catch (locationError) {
        console.error('Erro ao enviar localização:', locationError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem via Telegram:', error);
    return false;
  }
};
