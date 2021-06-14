import * as crypto from 'crypto';
import { generateRandomString } from './generate-random-string';

export const hashPassword = (password: string): string => {
  const hmac = crypto.createHmac(
    'sha512',
    'uyguydgiusdahcaiuhbcyasbhciouahrcuivasdcuioasdbcoaqncbo;uahcldsiumncfitionwamra;isercfncsm,lcfmfhasdk.fhskfjserh;lifcjasrlk;fhcdlvdsnfljkvlkmaskl;dcxmsl;dmclks,x;aklhndcksrhfvpawjkcpaisjfia;skf;oajf;jg;iesrhifgjdsa;flkjads;akd;kfjsfiuaghfdiadhasgkjcxgacybhaeiucxbaysudcgascbdaukcghyakcbgskybcyasdbcksadbcsakycbdasjgcvsdcyjabsdjkcbjsdavcscavvdfvdv',
  );
  hmac.update(password);
  return hmac.digest('hex');
};

export const hashRandom = (): string => {
  const random = generateRandomString(12);
  const hmac = crypto.createHmac(
    'sha256',
    'gdfsdfsdfsdfrtdgysvdjgoisdrjgdfghudsflhgdsfuighslkjvhisudhbciaudgcfjhzxgciyzsgysegcusgdcuyszgdcuyzgbdfgawefsjgyesukdfgxdjksyvgbdfhjvkgtsduykgdsjrvjdfhvgghdbyjtjknscfsdfdfghdfgulsdhufghwaoruighsoiufhsnjklvnxlkcvxhsruvnsldfsdfhsduifhsdlifdjp9sejflkndlkjnlvxcvmnghiu',
  );
  hmac.update(random);
  return hmac.digest('hex');
};
