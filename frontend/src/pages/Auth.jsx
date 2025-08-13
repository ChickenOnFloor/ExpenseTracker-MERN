import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", email: "", password: "", general: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: "", email: "", password: "", general: "" });
    setLoading(true);

    try {
      const endpoint =
        tab === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/register";

      const body =
        tab === "login"
          ? { email, password }
          : { username, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          setErrors(prev => ({ ...prev, ...data.errors }));
        } else {
          setErrors(prev => ({ ...prev, general: data.message || "Something went wrong" }));
        }
        throw new Error();
      }
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Expense Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="login" className="w-1/2">Login</TabsTrigger>
              <TabsTrigger value="register" className="w-1/2">Register</TabsTrigger>
            </TabsList>

            {errors.general && (
              <p className="text-red-500 text-sm mb-4 text-center">{errors.general}</p>
            )}

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
                  )}
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
                  )}
                </div>

                <Button disabled={loading} type="submit" className="w-full">
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                  />
                  {errors.username && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.username}</span>
                  )}
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
                  )}
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
                  )}
                </div>

                <Button disabled={loading} type="submit" className="w-full">
                  {loading ? "Registering..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
