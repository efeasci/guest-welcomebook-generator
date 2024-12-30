export const transformListingData = (formData: {
  house_rules: string[] | string;
  before_you_leave: string[] | string;
  [key: string]: any;
}, userId: string) => {
  return {
    ...formData,
    user_id: userId,
    house_rules: Array.isArray(formData.house_rules) 
      ? formData.house_rules 
      : typeof formData.house_rules === 'string'
        ? formData.house_rules.split('\n').filter(rule => rule.trim())
        : [],
    before_you_leave: Array.isArray(formData.before_you_leave)
      ? formData.before_you_leave
      : typeof formData.before_you_leave === 'string'
        ? formData.before_you_leave.split('\n').filter(instruction => instruction.trim())
        : []
  };
};