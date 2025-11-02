// netlify/functions/send-to-telegram.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const { name, contact, suggestion } = JSON.parse(event.body);

    // Ambil token dan chat ID dari environment variables
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server configuration error. Missing token or chat ID." }),
        };
    }

    const message = `
📩 *Saran Baru dari Si Terang Website!*

👤 *Nama:* ${name}
📞 *Kontak:* ${contact}
💬 *Saran:*
 ${suggestion}
    `;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.description || 'Failed to send message to Telegram');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Success! Message sent." }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};