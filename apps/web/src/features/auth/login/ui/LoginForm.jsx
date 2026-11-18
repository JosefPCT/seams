import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../api/useLogin";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate: login, isPending, isError, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    login(
      { email, password },
      {
        onSuccess: () => {
          // Redirect after the session cache is updated
          navigate("/dashboard", { replace: true });
        }
      }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      {isError && (
        <p style={{ color: "red" }}>
          {error?.message || "Failed to log in. Please try again."}
        </p>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}