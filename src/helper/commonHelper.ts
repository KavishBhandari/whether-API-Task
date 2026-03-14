import { JWTSignOptions, library } from "../utils/library";

const isTokenExpired = (token: string): boolean => {
    const payloadBase64 = token.split(".")[1];
    const decodePayload = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodePayload);
    const expired = Date.now() >= decoded.exp * 1000;
    return expired;
};

const hasedPassword = async (password: string) => {
    const saltValue = await library.bcrypt.genSalt(10);
    return await library.bcrypt.hash(password, saltValue);
    
};

const verifyPassword = async (bodyPassword: string, dbPassword: string) => {
    return await library.bcrypt.compare(bodyPassword, dbPassword);
};

const verifySignature = async (token: string) => {
    return library.jwt.verify(token, process.env.SECRET_OR_KEY as string);
};

const generateAuthToken = async (
    payload: object,
    expiredTime: string
): Promise<string> => {
    const options: JWTSignOptions = {
        expiresIn: expiredTime as `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`,
    };

    return library.jwt.sign(payload, library.secretOrKey, options);
};

export const CommonHelper = {
    isTokenExpired,
    hasedPassword,
    verifyPassword,
    verifySignature,
    generateAuthToken,
};