export interface PasswordRecoveryDTO {
    email: string;
}

export interface PasswordRecoveryMailDTO {
    email: string;
    recoveryLink: string;
}