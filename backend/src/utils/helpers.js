const crypto = require('crypto');
const moment = require('moment');

module.exports = {
  generateId: () => crypto.randomBytes(16).toString('hex'),
  
  generateCode: (prefix = '', length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = prefix;
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },
  
  generateTableCode: () => {
    return 'TBL' + Math.random().toString(36).substring(2, 8).toUpperCase();
  },
  
  generateOrderNumber: () => {
    return '#' + Date.now().toString().slice(-8);
  },
  
  formatPrice: (price) => {
    return parseFloat(price).toFixed(2);
  },
  
  calculateTax: (subtotal, taxRate = 0.15) => {
    return parseFloat((subtotal * taxRate).toFixed(2));
  },
  
  calculateTotal: (subtotal, taxRate = 0.15, discount = 0) => {
    const tax = parseFloat((subtotal * taxRate).toFixed(2));
    return parseFloat((subtotal + tax - discount).toFixed(2));
  },
  
  isTimeInRange: (time, startTime, endTime) => {
    const current = moment(time, 'HH:mm');
    const start = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');
    return current.isBetween(start, end, null, '[]');
  },
  
  getTimeDifference: (startTime, endTime) => {
    return moment(endTime).diff(moment(startTime), 'minutes');
  },
  
  formatDateTime: (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  },
  
  paginate: (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    return { offset, limit };
  }
};
