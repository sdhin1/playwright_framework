import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

function getKeyFromPassphrase(passphrase: string) {
  return createHash('sha256').update(passphrase).digest();
}

export function encrypt(text: string) {
  let iv = randomBytes(IV_LENGTH);
  let cipher = createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift()!, 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const passphrase = '@pagal1!';
const ENCRYPTION_KEY = getKeyFromPassphrase(passphrase);
const IV_LENGTH = 16;
