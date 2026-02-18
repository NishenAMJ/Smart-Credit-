export class AuthResponseDto {
  access_token: string;
  user?: {
    uid: string;
    email: string;
    role: string;
  };
}
