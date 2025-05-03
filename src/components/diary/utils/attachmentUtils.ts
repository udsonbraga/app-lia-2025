
export const processAttachments = async (
  attachments: File[],
  uploadImage: (file: File, userId?: string) => Promise<{ success: boolean; url?: string; name: string; error?: any }>,
  userId?: string
) => {
  const uploadedAttachments = [];
  
  for (const file of attachments) {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const result = await uploadImage(file, userId);
      if (result.success) {
        uploadedAttachments.push({
          name: result.name,
          url: result.url
        });
      }
    } else {
      // Para arquivos não-imagem, apenas armazenar o nome
      uploadedAttachments.push({
        name: file.name
      });
    }
  }
  
  return uploadedAttachments;
};
