
/**
 * Utility functions for handling Telegram messaging
 */

/**
 * Sends a message via Telegram Bot to the specified chat ID
 * @param telegramId The Telegram chat ID to send the message to
 * @returns Promise resolving to boolean indicating success/failure
 */
export const sendTelegramMessage = async (telegramId: string): Promise<boolean> => {
  try {
    const botToken = "7668166969:AAFnukkbhjDnUgGTC5em6vYk1Ch7bXy-rBQ"; // Updated token
    
    // Get user name from localStorage
    const userName = localStorage.getItem("userName") || "Alguém";
    
    // Mensagem simplificada sem localização
    const message = `${userName} está em perigo e precisa de sua ajuda! Entre em contato imediatamente.`;
    
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
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`Erro ao enviar mensagem: ${response.statusText}`, data);
      return false;
    }
    
    console.log('Mensagem enviada com sucesso para Telegram ID:', telegramId, data);
    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem via Telegram:', error);
    return false;
  }
};
