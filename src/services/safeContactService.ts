
import { supabase } from '@/lib/supabase';
import { SafeContact } from '@/features/support-network/types';
import { SafeContactDatabase } from '@/lib/supabase';

// Função auxiliar para converter entre os tipos
const mapDatabaseToSafeContact = (dbContact: SafeContactDatabase): SafeContact => {
  return {
    id: dbContact.id,
    name: dbContact.name,
    phone: dbContact.phone,
    relationship: dbContact.relationship || '',
    telegramId: dbContact.telegramId || '',
    twilioAccountSid: dbContact.twilioAccountSid,
    twilioAuthToken: dbContact.twilioAuthToken,
    twilioWhatsappNumber: dbContact.twilioWhatsappNumber
  };
};

export const getSafeContacts = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // Se não estiver autenticado, retorna os contatos do localStorage
      const localContacts = localStorage.getItem('safeContacts');
      const parsedContacts = localContacts ? JSON.parse(localContacts) : [];
      return { 
        success: true, 
        data: parsedContacts.map(mapDatabaseToSafeContact)
      };
    }
    
    const { data, error } = await supabase
      .from('safe_contacts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { 
      success: true, 
      data: data.map(mapDatabaseToSafeContact)
    };
  } catch (error) {
    console.error('Erro ao buscar contatos seguros:', error);
    return { success: false, error };
  }
};

export const addSafeContact = async (contact: Omit<SafeContact, 'id'>) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // Se não estiver autenticado, salva no localStorage
      const localContacts = localStorage.getItem('safeContacts');
      const contacts = localContacts ? JSON.parse(localContacts) : [];
      const newContact = { ...contact, id: Date.now().toString() };
      const updatedContacts = [...contacts, newContact];
      localStorage.setItem('safeContacts', JSON.stringify(updatedContacts));
      return { success: true, data: newContact };
    }
    
    const contactData = {
      ...contact,
      user_id: session.user.id
    };
    
    const { data, error } = await supabase
      .from('safe_contacts')
      .insert([contactData])
      .select();
      
    if (error) throw error;
    
    return { success: true, data: mapDatabaseToSafeContact(data[0]) };
  } catch (error) {
    console.error('Erro ao adicionar contato seguro:', error);
    return { success: false, error };
  }
};

export const updateSafeContact = async (contact: SafeContact) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // Se não estiver autenticado, atualiza no localStorage
      const localContacts = localStorage.getItem('safeContacts');
      if (localContacts) {
        const contacts = JSON.parse(localContacts);
        const updatedContacts = contacts.map((c: SafeContact) => 
          c.id === contact.id ? contact : c
        );
        localStorage.setItem('safeContacts', JSON.stringify(updatedContacts));
      }
      return { success: true, data: contact };
    }
    
    const { data, error } = await supabase
      .from('safe_contacts')
      .update(contact)
      .eq('id', contact.id)
      .select();
      
    if (error) throw error;
    
    return { success: true, data: mapDatabaseToSafeContact(data[0]) };
  } catch (error) {
    console.error('Erro ao atualizar contato seguro:', error);
    return { success: false, error };
  }
};

export const removeSafeContact = async (id: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // Se não estiver autenticado, remove do localStorage
      const localContacts = localStorage.getItem('safeContacts');
      if (localContacts) {
        const contacts = JSON.parse(localContacts);
        const updatedContacts = contacts.filter((c: SafeContact) => c.id !== id);
        localStorage.setItem('safeContacts', JSON.stringify(updatedContacts));
      }
      return { success: true };
    }
    
    const { error } = await supabase
      .from('safe_contacts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao remover contato seguro:', error);
    return { success: false, error };
  }
};
