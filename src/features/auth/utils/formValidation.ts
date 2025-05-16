
interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(phone);
};

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return value;
};

export const validateForm = (formData: FormData): Partial<FormData> => {
  const errors: Partial<FormData> = {};

  if (!formData.name) {
    errors.name = "Nome é obrigatório";
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = "E-mail inválido";
  }

  if (!formData.phone || !validatePhone(formData.phone)) {
    errors.phone = "Telefone inválido - Use o formato (99) 99999-9999";
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres";
  }

  return errors;
};
