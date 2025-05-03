
import { supabase } from '@/lib/supabase';
import type { FeedbackItem } from '@/lib/supabase';

export const submitFeedback = async (type: string, content: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Se o usuário estiver logado, associamos o feedback ao usuário
    // Caso contrário, o user_id será null
    const feedbackData = {
      type,
      content,
      user_id: session?.user?.id
    };
    
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackData])
      .select();
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    return { success: false, error };
  }
};

export const getUserFeedback = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { success: false, error: 'Usuário não autenticado' };
    }
    
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar feedback:', error);
    return { success: false, error };
  }
};
