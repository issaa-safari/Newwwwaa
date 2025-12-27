# WhatsApp Webhook for Safari Adventure Riders

This webhook is deployed on Vercel for receiving and processing WhatsApp Business API messages.

## Features

✅ Webhook verification
✅ Receive WhatsApp messages
✅ Auto-reply system
✅ Handle text, images, documents, audio, video, location
✅ Message status tracking
✅ Serverless (always on, no maintenance)

## Configuration

Your webhook credentials are configured in `api/webhook.js`:

- **Verify Token:** `safari_adventure_2024_secure_token_xyz789`
- **Phone Number ID:** `799168383168350`
- **Access Token:** Configured in the file

## Webhook URL

After deployment, your webhook URL will be:

```
https://your-project-name.vercel.app/webhook
```

Use this URL in Meta's WhatsApp Configuration page.

## Auto-Reply Keywords

- **"hello" / "hi"** → Welcome message with menu
- **"safari" / "1"** → Safari tour information
- **"booking" / "2"** → Booking instructions
- **"price" / "3"** → Pricing information
- **"contact" / "4"** → Contact details
- **"thank you"** → Gratitude response
- **Other messages** → Default response

## Deployment

This project is ready to deploy to Vercel. The webhook will be automatically available at `/webhook` endpoint.

## Support

For questions about Safari Adventure Riders, visit: https://safariadventureriders.com