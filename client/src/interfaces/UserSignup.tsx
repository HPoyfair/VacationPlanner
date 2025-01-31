// Interface definition for UserLogin
export interface UserSignup {
  username: string | null;  // Property for storing username, nullable
  password: string | null;  // Property for storing password, nullable
  email: string | null; // Property for storing email, nullable
  confirmPassword: string | null;  // Property for validating password
}
