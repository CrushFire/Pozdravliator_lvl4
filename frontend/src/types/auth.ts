export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthorizationRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
     newPassword: string;
     oldPassword: string;
}