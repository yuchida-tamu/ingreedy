import type { TResult } from "../types/result";

type TLoginResponse = {
    accessToken: string;
    refreshToken: string;
};

export abstract class IAuthService {
  abstract login(email: string, password: string):Promise<TResult<TLoginResponse>>;
  abstract logout(): Promise<void>;
}