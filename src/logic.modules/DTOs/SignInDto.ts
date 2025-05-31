export class SignInRequestDto {
    email: string;
    password: string;
}

export class SignInResponseDto {
    email: string;
    token: string;
    fechaUltimoAcceso: Date;
    isOnline: boolean;
    userId: string;
    rol: number;

}