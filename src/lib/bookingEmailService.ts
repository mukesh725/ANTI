export async function sendBookingConfirmationEmail(bookingDetails: {
  firstName: string;
  lastName: string;
  email: string;
  date: string;
  timeSlot: string;
  bookingReference: string;
}) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  if (!BREVO_API_KEY) {
    console.warn("No Brevo API key found. Email will not be sent.");
    return false;
  }

  const { firstName, lastName, email, date, timeSlot, bookingReference } = bookingDetails;
  
  // Format date for better readability (e.g. Monday, August 10, 2026)
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.airoessentials.com';
  const qrCodeUrl = `${baseUrl}/api/bookings/qr?ref=${bookingReference}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
      <div style="max-w-md mx-auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #eaeaea;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1C1C1E; margin: 0; font-size: 24px;">AIRO Health Scan Confirmed</h1>
        </div>

        <div style="background: #FFF3E0; border-left: 4px solid #FF9800; padding: 12px; margin-bottom: 20px;">
          <p style="margin: 0; color: #E65100; font-size: 13px; font-weight: bold;">
            ⚠️ Please star or keep this email safe. You will need to show the QR code below when you arrive in-store.
          </p>
        </div>

        <p style="color: #333; font-size: 16px;">Hi ${firstName} ${lastName},</p>
        <p style="color: #555; line-height: 1.5;">Your free health check-up slot has been successfully booked. We are looking forward to seeing you at our Minute Clinic.</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</p>
          <p style="margin: 0 0 15px 0; font-size: 24px; color: #1C1C1E; font-weight: bold; font-family: monospace;">${bookingReference}</p>
          <img src="${qrCodeUrl}" alt="Booking QR Code" style="width: 200px; height: 200px; border-radius: 12px; border: 1px solid #eaeaea;" />
        </div>

        <div style="background: #f9f9f9; border-left: 4px solid #1C1C1E; padding: 15px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 0; font-size: 14px; color: #666;"><strong>Time:</strong> ${timeSlot}</p>
        </div>

        <p style="color: #555; line-height: 1.5; font-size: 14px;">
          <strong>Location:</strong> AIRO Essentials Clinic<br/>
          Please arrive 5 minutes early for your appointment. If you need to reschedule, please contact our support team.
        </p>

        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} AIRO Essentials. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: 'AIRO Essentials',
          email: 'support@airoessentials.com' // Should be an authorized sender in Brevo
        },
        to: [
          {
            email: email,
            name: `${firstName} ${lastName}`
          }
        ],
        subject: 'Your AIRO Health Scan Booking Confirmation',
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email dispatch error:', error);
    return false;
  }
}
