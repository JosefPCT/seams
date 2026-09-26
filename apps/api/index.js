import express from 'express';
import { prisma } from "@repo/database"

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.status(200).json({ name: "frodo"})
})

app.get('/api', (req, res) => {
  res.json({ message: "Hello from the Node.js backend!" });
});

app.get('/user', async (req, res) => {
  const user = await prisma.user.findFirst();
  console.log(user);
  res.status(200).json({ userId: user.id, username: user.username, password: user.password });
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});