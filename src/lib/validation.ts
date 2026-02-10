export interface ValidationError {
  [key: string]: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
  return phone.length >= 7 && phoneRegex.test(phone);
};

export const validateContactForm = (data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): ValidationError => {
  const errors: ValidationError = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.subject.trim()) {
    errors.subject = 'Subject is required';
  } else if (data.subject.trim().length < 5) {
    errors.subject = 'Subject must be at least 5 characters';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
};

export const validateApplicationForm = (data: {
  name: string;
  email: string;
  age: string;
  teaching_experience: string;
}): ValidationError => {
  const errors: ValidationError = {};

  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!validateEmail(data.email)) errors.email = 'Invalid email address';

  if (!data.age) errors.age = 'Age is required';
  else if (isNaN(Number(data.age)) || Number(data.age) < 18) {
    errors.age = 'You must be 18 or older';
  }

  if (!data.teaching_experience.trim()) {
    errors.teaching_experience = 'Teaching experience is required';
  }

  return errors;
};
