const crypto = require('crypto');
// require("dotenv").config();
const algorithm = 'aes-256-cbc';

const key = "2c79dc25ea68ef4177334e64c3fb7a27fa91c50b013da2d8b792cd7b846417d0";

const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
 }

 // Decrypting text
 function decrypt(hash, text) {
    try {
    let iv = Buffer.from(hash, 'hex');
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    try {
        return JSON.parse(decrypted.toString());
      } catch (e) {
        return decrypted.toString();
      }
    } catch (err) {
      console.log(err);
      return err;
    }
 }

 // Text send to encrypt function
 var hw = encrypt("Welcome to Tutorials Point...")
 console.log(hw)
 console.log(decrypt(hw.iv, hw.encryptedData))
