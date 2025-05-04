
export const processAttachments = async (
  attachments: File[],
  uploadImage: (file: File, userId?: string, onProgress?: (progress: number) => void) => Promise<{ success: boolean; url?: string; name: string; error?: any }>,
  userId?: string,
  onTotalProgress?: (progress: number) => void,
  onFileProgress?: (fileName: string, progress: number) => void
) => {
  const uploadedAttachments = [];
  const totalFiles = attachments.length;
  let completedFiles = 0;
  
  for (const file of attachments) {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      try {
        const result = await uploadImage(
          file, 
          userId,
          (progress) => {
            // Report individual file progress
            if (onFileProgress) {
              onFileProgress(file.name, progress);
            }
          }
        );
        
        completedFiles++;
        
        // Update total progress
        if (onTotalProgress) {
          onTotalProgress(Math.round((completedFiles / totalFiles) * 100));
        }
        
        if (result.success) {
          uploadedAttachments.push({
            name: result.name,
            url: result.url
          });
        } else {
          // Add failed uploads but mark them as failed
          uploadedAttachments.push({
            name: file.name,
            error: result.error?.message || 'Falha no upload'
          });
        }
      } catch (error) {
        console.error(`Erro ao fazer upload de ${file.name}:`, error);
        uploadedAttachments.push({
          name: file.name,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
        
        completedFiles++;
        if (onTotalProgress) {
          onTotalProgress(Math.round((completedFiles / totalFiles) * 100));
        }
      }
    } else {
      // Para arquivos não-imagem, apenas armazenar o nome
      uploadedAttachments.push({
        name: file.name
      });
      
      completedFiles++;
      if (onTotalProgress) {
        onTotalProgress(Math.round((completedFiles / totalFiles) * 100));
      }
    }
  }
  
  return uploadedAttachments;
};
