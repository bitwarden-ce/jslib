import { ConstantsService } from './constants.service';

import { StorageService } from '../abstractions/storage.service';
import { TokenService as TokenServiceAbstraction } from '../abstractions/token.service';

import { Utils } from '../misc/utils';

const Keys = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    twoFactorTokenPrefix: 'twoFactorToken_',
};

export class TokenService implements TokenServiceAbstraction {
    token: string;
    decodedToken: any;
    refreshToken: string;

    constructor(private storageService: StorageService) {
    }

    setTokens(accessToken: string, refreshToken: string): Promise<any> {
        return Promise.all([
            this.setToken(accessToken),
            this.setRefreshToken(refreshToken),
        ]);
    }

    setToken(token: string): Promise<any> {
        this.token = token;
        this.decodedToken = null;
        return this.storageService.save(Keys.accessToken, token);
    }

    async getToken(): Promise<string> {
        if (this.token != null) {
            return this.token;
        }

        this.token = await this.storageService.get<string>(Keys.accessToken);
        return this.token;
    }

    setRefreshToken(refreshToken: string): Promise<any> {
        this.refreshToken = refreshToken;
        return this.storageService.save(Keys.refreshToken, refreshToken);
    }

    async getRefreshToken(): Promise<string> {
        if (this.refreshToken != null) {
            return this.refreshToken;
        }

        this.refreshToken = await this.storageService.get<string>(Keys.refreshToken);
        return this.refreshToken;
    }

    setTwoFactorToken(token: string, email: string): Promise<any> {
        return this.storageService.save(Keys.twoFactorTokenPrefix + email, token);
    }

    getTwoFactorToken(email: string): Promise<string> {
        return this.storageService.get<string>(Keys.twoFactorTokenPrefix + email);
    }

    clearTwoFactorToken(email: string): Promise<any> {
        return this.storageService.remove(Keys.twoFactorTokenPrefix + email);
    }

    clearToken(): Promise<any> {
        this.token = null;
        this.decodedToken = null;
        this.refreshToken = null;

        return Promise.all([
            this.storageService.remove(Keys.accessToken),
            this.storageService.remove(Keys.refreshToken),
        ]);
    }

    // jwthelper methods
    // ref https://github.com/auth0/angular-jwt/blob/master/src/angularJwt/services/jwt.js

    decodeToken(): any {
        if (this.decodedToken) {
            return this.decodedToken;
        }

        if (this.token == null) {
            throw new Error('Token not found.');
        }

        const parts = this.token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }

        const decoded = Utils.fromUrlB64ToUtf8(parts[1]);
        if (decoded == null) {
            throw new Error('Cannot decode the token');
        }

        this.decodedToken = JSON.parse(decoded);
        return this.decodedToken;
    }

    getTokenExpirationDate(): Date {
        const decoded = this.decodeToken();
        if (typeof decoded.exp === 'undefined') {
            return null;
        }

        const d = new Date(0); // The 0 here is the key, which sets the date to the epoch
        d.setUTCSeconds(decoded.exp);
        return d;
    }

    tokenSecondsRemaining(offsetSeconds: number = 0): number {
        const d = this.getTokenExpirationDate();
        if (d == null) {
            return 0;
        }

        const msRemaining = d.valueOf() - (new Date().valueOf() + (offsetSeconds * 1000));
        return Math.round(msRemaining / 1000);
    }

    tokenNeedsRefresh(minutes: number = 5): boolean {
        const sRemaining = this.tokenSecondsRemaining();
        return sRemaining < (60 * minutes);
    }

    getUserId(): string {
        const decoded = this.decodeToken();
        if (typeof decoded.sub === 'undefined') {
            throw new Error('No user id found');
        }

        return decoded.sub as string;
    }

    getEmail(): string {
        const decoded = this.decodeToken();
        if (typeof decoded.email === 'undefined') {
            throw new Error('No email found');
        }

        return decoded.email as string;
    }

    getEmailVerified(): boolean {
        const decoded = this.decodeToken();
        if (typeof decoded.email_verified === 'undefined') {
            throw new Error('No email verification found');
        }

        return decoded.email_verified as boolean;
    }

    getName(): string {
        const decoded = this.decodeToken();
        if (typeof decoded.name === 'undefined') {
            return null;
        }

        return decoded.name as string;
    }

    getIssuer(): string {
        const decoded = this.decodeToken();
        if (typeof decoded.iss === 'undefined') {
            throw new Error('No issuer found');
        }

        return decoded.iss as string;
    }
}
