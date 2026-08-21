const express = require("express");
const cors = require("cors");
require("dotenv").config();

const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve the frontend HTML files
app.use(express.static(path.join(__dirname, "public")));

app.post("/send-email", async (req, res) => {
    console.log("📩 /send-email request received");
    try {
        const { toEmail, htmlContent } = req.body;

        console.log("Recipient:", toEmail);
        console.log("HTML received:", !!htmlContent);

        if (!toEmail || !htmlContent) {
            return res.status(400).json({
                success: false,
                message: "Email address and HTML content are required.",
            });
        }

        if (!process.env.BREVO_API_KEY) {
            console.error("❌ BREVO_API_KEY is missing");
            return res.status(500).json({
                success: false,
                message: "BREVO_API_KEY is missing on the server.",
            });
        }

        if (!process.env.FROM_EMAIL) {
            console.error("❌ FROM_EMAIL is missing");
            return res.status(500).json({
                success: false,
                message: "FROM_EMAIL is missing on the server.",
            });
        }

        console.log("🚀 Calling Brevo API...");

        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 15000);

        // Parse multiple emails separated by commas or spaces
        const emailList = toEmail.split(/[\s,]+/).filter(e => {
            e = e.trim();
            // Basic regex to ensure valid email structure
            return e.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        });
        
        if (emailList.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid email addresses provided in the recipient list.",
            });
        }
        
        const toArray = emailList.map(email => ({ email: email.trim() }));

        const response = await fetch(
            "https://api.brevo.com/v3/smtp/email",
            {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    sender: {
                        name: "AstroVed",
                        email: process.env.FROM_EMAIL,
                    },
                    to: toArray,
                    subject: "Your Custom HTML Email",
                    htmlContent: htmlContent,
                }),
                signal: controller.signal,
            }
        );

        clearTimeout(timeout);

        console.log("📡 Brevo status:", response.status);
        const data = await response.json();
        console.log("📨 Brevo response:", data);

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: "Brevo failed to send email.",
                error: data,
            });
        }

        console.log("✅ Email sent successfully");

        return res.status(200).json({
            success: true,
            message: "Email sent successfully!",
            messageId: data.messageId,
        });

    } catch (error) {
        console.error("❌ Server error:", error);

        if (error.name === "AbortError") {
            return res.status(504).json({
                success: false,
                message: "Brevo API request timed out.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to send email.",
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});