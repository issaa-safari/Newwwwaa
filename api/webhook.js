/**
 * WhatsApp Business API Webhook Handler
 * Deployed on Vercel Serverless
 * For: Safari Adventure Riders
 * Created: December 27, 2024
 */

// Configuration
const VERIFY_TOKEN = 'safari_adventure_2024_secure_token_xyz789';
const WHATSAPP_TOKEN = 'EAAQzmttLIEcBQVZBLi883fOVojB3aqf2WD9Rh8jiadZBZC5kGATwU6N0xx2cCSbRh7P5iyHAzamuQlaEskjX4Kv060T4gXnEwZAGcs4jnzcCChONRnSNzZAO20GfivZAzTttlyf8daTEG0CjVVsaTf5xCZCslAwNmGgdoBRhVLuiNmZAqHiZAUrSJscVIJCZBZBNUgITgZDZD';
const PHONE_NUMBER_ID = '799168383168350';

// Helper: Send WhatsApp message
async function sendWhatsAppMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      })
    });
    
    const data = await response.json();
    console.log('✅ Message sent successfully:', data);
    return true;
  } catch (error) {
    console.error('❌ Failed to send message:', error);
    return false;
  }
}

// Process text messages and send auto-replies
async function processTextMessage(from, text) {
  console.log(`Processing message from ${from}: ${text}`);
  
  const textLower = text.toLowerCase().trim();
  let reply = '';
  
  if (textLower.includes('hello') || textLower.includes('hi')) {
    reply = "🏕️ Hello! Welcome to Safari Adventure Riders!\n\nHow can we help you today?\n\n1. Safari Tours\n2. Booking Information\n3. Pricing\n4. Contact Us\n\nReply with a number or ask us anything!";
  }
  else if (textLower.includes('safari') || textLower === '1') {
    reply = "🦁 Our Safari Tours:\n\n• Wildlife Safari - 3 Days\n• Adventure Safari - 5 Days\n• Premium Safari - 7 Days\n\nWould you like more details about any of these?";
  }
  else if (textLower.includes('booking') || textLower === '2') {
    reply = "📅 Booking Information:\n\nTo book a safari:\n1. Choose your tour\n2. Select dates\n3. Confirm number of people\n\nVisit: https://safariadventureriders.com/booking\n\nOr reply with your preferred dates!";
  }
  else if (textLower.includes('price') || textLower.includes('cost') || textLower === '3') {
    reply = "💰 Pricing:\n\n• Wildlife Safari: $299/person\n• Adventure Safari: $599/person\n• Premium Safari: $999/person\n\nGroup discounts available!\n\nNeed a custom quote?";
  }
  else if (textLower.includes('contact') || textLower === '4') {
    reply = "📞 Contact Us:\n\nPhone: +1-XXX-XXX-XXXX\nEmail: info@safariadventureriders.com\nWebsite: https://safariadventureriders.com\n\nWe're here to help!";
  }
  else if (textLower.includes('thank')) {
    reply = "You're welcome! 🙏 Feel free to reach out anytime. Happy adventures! 🏕️";
  }
  else {
    reply = "Thanks for your message! Our team will get back to you shortly. 😊\n\nIn the meantime, visit https://safariadventureriders.com for more information!";
  }
  
  await sendWhatsAppMessage(from, reply);
}

// Main webhook handler
export default async function handler(req, res) {
  console.log('=== Webhook Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  // Handle GET request (webhook verification)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    console.log('Verification attempt:', { mode, token: token?.substring(0, 10) + '...' });
    
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully!');
      return res.status(200).send(challenge);
    } else {
      console.log('❌ Verification failed!');
      return res.status(403).send('Verification failed');
    }
  }
  
  // Handle POST request (webhook events)
  if (req.method === 'POST') {
    const body = req.body;
    
    console.log('📩 Webhook event received');
    console.log('Payload:', JSON.stringify(body, null, 2));
    
    if (body.object === 'whatsapp_business_account') {
      
      // Process entries
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          
          if (change.field === 'messages') {
            const value = change.value;
            
            // Handle incoming messages
            if (value.messages) {
              for (const message of value.messages) {
                const from = message.from;
                const messageId = message.id;
                const type = message.type;
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📨 NEW MESSAGE');
                console.log('From:', from);
                console.log('ID:', messageId);
                console.log('Type:', type);
                
                // Handle text messages
                if (type === 'text' && message.text?.body) {
                  const text = message.text.body;
                  console.log('Text:', text);
                  await processTextMessage(from, text);
                }
                
                // Handle image messages
                else if (type === 'image' && message.image) {
                  console.log('Image received');
                  await sendWhatsAppMessage(from, "📸 Thanks for the image! Our team will review it shortly.");
                }
                
                // Handle document messages
                else if (type === 'document' && message.document) {
                  const filename = message.document.filename || 'document';
                  console.log('Document received:', filename);
                  await sendWhatsAppMessage(from, `📄 Document received: ${filename}\nThank you! We'll review it soon.`);
                }
                
                // Handle audio messages
                else if (type === 'audio' && message.audio) {
                  console.log('Audio received');
                  await sendWhatsAppMessage(from, "🎵 Voice message received! We'll listen to it and get back to you.");
                }
                
                // Handle video messages
                else if (type === 'video' && message.video) {
                  console.log('Video received');
                  await sendWhatsAppMessage(from, "🎥 Video received! Thanks for sharing.");
                }
                
                // Handle location messages
                else if (type === 'location' && message.location) {
                  const lat = message.location.latitude;
                  const lon = message.location.longitude;
                  console.log('Location received:', lat, lon);
                  await sendWhatsAppMessage(from, "📍 Location received! Thanks for sharing your location.");
                }
                
                // Handle contact messages
                else if (type === 'contacts' && message.contacts) {
                  console.log('Contact shared');
                  await sendWhatsAppMessage(from, "👤 Contact information received. Thank you!");
                }
                
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              }
            }
            
            // Handle message status updates
            if (value.statuses) {
              for (const status of value.statuses) {
                console.log('📊 Status update:', status.status, 'for message:', status.id);
              }
            }
          }
        }
      }
    }
    
    console.log('✅ Webhook processed');
    return res.status(200).json({ status: 'success' });
  }
  
  // Handle other methods
  return res.status(405).send('Method not allowed');
}