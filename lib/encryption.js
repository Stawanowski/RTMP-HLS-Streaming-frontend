import crypto from "crypto"

const algorithm = 'aes-256-cbc'; 
const secret =process.env.ENCRYPTION_SECRET
const secretIv = process.env.ENCRYPTION_SECRET_IV


 export function encode(object) {
    const key = Buffer.from(secret, 'hex');
    const iv = Buffer.from(secretIv, 'hex');
    const text = JSON.stringify(object);
    
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decode(input) {

    const key = Buffer.from(secret, 'hex');
    const iv = Buffer.from(secretIv, 'hex');
    const encryptedText = Buffer.from(input, 'hex');

    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return JSON.parse(decrypted);
}


