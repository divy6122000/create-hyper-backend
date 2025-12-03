import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const app = express();
const PORT = process.env.EMAIL_SERVICE_PORT || 3001;

app.use(express.json());

app.post("/send-email", (req, res) => {
    const { to, subject, text } = req.body;
    console.log(chalk.blue(`📧 Sending email to ${to}: ${subject}`));
    // Implement actual email sending logic here
    res.json({ status: "success", message: "Email sent (mock)" });
});

app.listen(PORT, () => {
    console.log(chalk.green(`📨 Email Service running on port ${PORT}`));
});
