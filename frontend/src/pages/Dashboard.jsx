import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  const fetchExpenses = async (pageNum = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/expenses?page=${pageNum}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExpenses(data.expenses);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(page);
  }, [page]);


  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    setLoading(true);
    try {
      await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, category, description }),
      });
      setAmount(""); setCategory(""); setDescription("");
      setPage(1);
      fetchExpenses(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/", { replace: true });
  };

  const totalSpend = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  const chartData = Object.values(
    expenses.reduce((acc, exp) => {
      const date = new Date(exp.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, total: 0 };
      acc[date].total += Number(exp.amount) || 0;
      return acc;
    }, {})
  );

  if (!token) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Spending</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalSpend.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Add Expense</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <Label>Amount</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {["Food","Transport","Shopping","Bills","Other"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Expense"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Spending Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Expense List</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px] md:min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Amount</th>
                  <th className="py-2 text-left">Category</th>
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp._id} className="border-b">
                    <td>${exp.amount}</td>
                    <td>{exp.category}</td>
                    <td>{exp.description || "-"}</td>
                    <td>{new Date(exp.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                size="sm"
                variant={page === i + 1 ? "default" : "outline"}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
