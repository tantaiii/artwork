// sessionUtils.js
import CryptoJS from "crypto-js";

// Khóa bí mật - nên được tạo động từ server trong thực tế
const SECRET_KEY = "QuangBinhDaNangQuangNam123!@#$%^&*()"; // Khóa dài và phức tạp hơn
const IV = CryptoJS.lib.WordArray.random(16); // Vector khởi tạo ngẫu nhiên (IV)

// Lưu trữ sessionStorage gốc
const originalSessionStorage = window.sessionStorage;

// Hàm mã hóa với AES
const encrypt = (data) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, {
    iv: IV, // Vector khởi tạo để tăng độ ngẫu nhiên
    mode: CryptoJS.mode.CBC, // Chế độ mã hóa khối
    padding: CryptoJS.pad.Pkcs7, // Đệm dữ liệu
  });
  return encrypted.toString(); // Trả về chuỗi mã hóa
};

// Hàm giải mã với AES
const decrypt = (encryptedData) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    return null; // Trả về null nếu giải mã thất bại
  }
};

// Ghi đè sessionStorage
Object.defineProperty(window, "sessionStorage", {
  value: {
    setItem: (key, value) => {
      const encryptedValue = encrypt(value);
      originalSessionStorage.setItem(key, encryptedValue);
    },
    getItem: (key) => {
      const encryptedValue = originalSessionStorage.getItem(key);
      return encryptedValue ? decrypt(encryptedValue) : null;
    },
    removeItem: (key) => {
      originalSessionStorage.removeItem(key);
    },
    clear: () => {
      originalSessionStorage.clear();
    },
  },
  writable: false, // Ngăn ghi đè lại
});
