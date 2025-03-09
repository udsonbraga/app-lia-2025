
/**
 * Utility functions for handling Telegram messaging
 */

/**
 * Sends a message via Telegram Bot to the specified chat ID
 * @param telegramId The Telegram chat ID to send the message to
 * @param locationLink The Google Maps location link to include in the message
 * @param audioBlob Optional audio recording to send with the message
 * @returns Promise resolving to boolean indicating success/failure
 */
export const sendTelegramMessage = async (
  telegramId: string, 
  locationLink: string, 
  audioBlob?: Blob
): Promise<boolean> => {
  try {
    const botToken = "7583759027:AAEE7KUF9ye6esERLzac-ATth7VOjfvRx8s"; // Token real do bot SafeLady_bot
    const message = `EMERGÊNCIA DETECTADA! Som de emergência identificado. Localização atual: ${locationLink}`;
    
    // Enviar mensagem de texto primeiro
    const textApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const textRequestBody = {
      chat_id: telegramId,
      text: message,
      parse_mode: "HTML"
    };
    
    const textResponse = await fetch(textApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(textRequestBody),
    });
    
    if (!textResponse.ok) {
      throw new Error(`Erro ao enviar mensagem de texto: ${textResponse.statusText}`);
    }
    
    console.log('Mensagem de texto enviada com sucesso');
    
    // Se tiver áudio, enviar como segundo arquivo
    if (audioBlob) {
      try {
        // Criar FormData para enviar o arquivo de áudio
        const formData = new FormData();
        formData.append('chat_id', telegramId);
        formData.append('caption', 'Gravação de áudio da emergência');
        
        // Adicionar arquivo de áudio ao formData
        formData.append('voice', audioBlob, 'emergency_recording.webm');
        
        // URL da API para enviar áudio
        const audioApiUrl = `https://api.telegram.org/bot${botToken}/sendVoice`;
        
        // Enviar o áudio
        const audioResponse = await fetch(audioApiUrl, {
          method: 'POST',
          body: formData,
        });
        
        if (!audioResponse.ok) {
          throw new Error(`Erro ao enviar áudio: ${audioResponse.statusText}`);
        }
        
        console.log('Áudio enviado com sucesso');
      } catch (audioError) {
        console.error('Erro ao enviar áudio:', audioError);
        // Não falhar completamente se apenas o áudio falhar
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem via Telegram:', error);
    return false;
  }
};
