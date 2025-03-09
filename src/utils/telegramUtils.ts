
/**
 * Utility functions for handling Telegram messaging
 */

/**
 * Sends a message via Telegram Bot to the specified chat ID
 * @param message The message text to send
 * @param locationLink The Google Maps location link to include in the message
 * @param audioBlob Optional audio recording to send with the message
 * @returns Promise resolving to boolean indicating success/failure
 */
export const sendTelegramMessage = async (
  message: string, 
  locationLink: string = "", 
  audioBlob?: Blob
): Promise<boolean> => {
  try {
    // Token do bot suport@safelady_bot
    const botToken = "7668166969:AAFnukkbhjDnUgGTC5em6vYk1Ch7bXy-rBQ";
    
    // O chat ID corrigido para o suport@safelady_bot
    const chatId = "5557317932"; // ID do chat para o suport@safelady_bot
    
    // Preparar a mensagem completa
    const fullMessage = locationLink 
      ? `${message} Localização atual: ${locationLink}` 
      : message;
    
    // Enviar mensagem de texto primeiro
    const textApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const textRequestBody = {
      chat_id: chatId,
      text: fullMessage,
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
      console.error("Erro na resposta do Telegram:", await textResponse.text());
      throw new Error(`Erro ao enviar mensagem de texto: ${textResponse.statusText}`);
    }
    
    console.log('Mensagem de texto enviada com sucesso');
    
    // Se tiver áudio, enviar como segundo arquivo
    if (audioBlob) {
      try {
        // Criar FormData para enviar o arquivo de áudio
        const formData = new FormData();
        formData.append('chat_id', chatId);
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
          console.error("Erro na resposta de áudio do Telegram:", await audioResponse.text());
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

/**
 * Sends feedback message to the support Telegram bot
 * @param feedbackMessage The feedback message to send
 * @returns Promise resolving to boolean indicating success/failure
 */
export const sendFeedbackMessage = async (feedbackMessage: string): Promise<boolean> => {
  try {
    const message = `NOVO FEEDBACK RECEBIDO!\n\nMensagem: ${feedbackMessage}\nData: ${new Date().toLocaleString()}`;
    
    // Enviar o feedback diretamente para o bot de suporte
    return await sendTelegramMessage(message);
  } catch (error) {
    console.error('Erro ao enviar feedback para o Telegram:', error);
    return false;
  }
};
