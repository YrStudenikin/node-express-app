export type SignUpDTO = {
  email: string;
  name: string;
  password: string;
};

export type SignInDTO = {
  email: string;
  password: string;
};

export type AuthUserOutputDTO = {
  id: string;
  email: string;
  name: string;
};

export type AuthOutputDTO = {
  user: AuthUserOutputDTO;
  accessToken: string;
  refreshToken: string;
};
