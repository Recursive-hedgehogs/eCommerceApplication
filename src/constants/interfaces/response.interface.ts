export interface ITokenResponse {
    access_token: string;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}
