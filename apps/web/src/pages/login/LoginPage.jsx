import { useAuth } from "../../app/context/AuthContext"
import { useState } from "react";

export default function LoginPage(){
    const { login } = useAuth();

    const apiUrl = import.meta.env.VITE_API_URL;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async(e) => {
      e.preventDefault();
      setError('');

      if (!email.trim() || !password.trim()){
        setError("Please enter both your email and password.");
        return ;
      }

      setIsLoading(true);

      try {
        console.log("Logging in...");
        login({ email, password});
      } catch (error) {
        setError(error.message || "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false)
      }


    }

  return (
    <div className="login-container">
        <p>{import.meta.env.VITE_API_URL}</p>
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Sign In</h2>

        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}