
/**
 * Utility functions for handling Telegram messaging
 */

/**
 * Sends a message via Telegram Bot to the specified chat ID
 * @param telegramId The Telegram chat ID to send the message to
 * @param locationLink The Google Maps location link to include in the message
 * @returns Promise resolving to boolean indicating success/failure
 */
export const sendTelegramMessage = async (telegramId: string, locationLink: string): Promise<boolean> => {
  try {
    const botToken = "7668166969:AAFnukkbhjDnUgGTC5em6vYk1Ch7bXy-rBQ"; // Updated token
    const message = `EMERGÊNCIA DETECTADA! Som de emergência identificado. Localização atual: ${locationLink}`;
    
    // URL da API do Telegram para enviar mensagem
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Preparar o corpo da requisição
    const requestBody = {
      chat_id: telegramId,
      text: message,
      parse_mode: "HTML"
    };
    
    // Fazer a requisição para a API do Telegram
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Mensagem enviada com sucesso:', data);
    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem via Telegram:', error);
    return false;
  }
};
