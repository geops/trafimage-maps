const formatPhone = (phone) => {
  try {
    return phone
      .split(/(\+41)(\d{2})(\d{3})(\d{2})(\d{2})/g)
      .join(' ')
      .trim();
  } catch (e) {
    return phone;
  }
};

export default formatPhone;
