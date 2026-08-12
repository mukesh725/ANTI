export async function sendBookingConfirmationEmail(bookingDetails: {
  firstName: string;
  lastName: string;
  email: string;
  date: string;
  timeSlot: string;
  location: string;
  bookingReference: string;
}) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  if (!BREVO_API_KEY) {
    console.warn("No Brevo API key found. Email will not be sent.");
    return false;
  }

  const { firstName, lastName, email, date, timeSlot, location, bookingReference } = bookingDetails;
  
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
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1d1d1f; margin: 0; font-size: 26px; font-weight: 600; tracking: -0.5px;">AIRO Health Checkup Booking Confirmation</h1>
        </div>

        <div style="background: #FEF2F2; border-left: 4px solid #DC2626; padding: 16px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #991B1B; font-size: 14px; font-weight: 600; line-height: 1.4;">
            <span style="font-size: 16px; margin-right: 4px;">❗</span> Important: Please keep this email safe. You will need to show the QR code below to our associate when you arrive in-store.
          </p>
        </div>

        <p style="color: #1d1d1f; font-size: 16px; font-weight: 500;">Hi ${firstName} ${lastName},</p>
        <p style="color: #515154; font-size: 15px; line-height: 1.6;">Your AIRO Health Checkup slot has been successfully reserved. We look forward to providing you with a premium, clinical-grade health assessment at our Minute Clinic.</p>
        
        <div style="text-align: center; margin: 35px 0; padding: 30px; background-color: #f5f5f7; border-radius: 16px;">
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #86868b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Booking Reference</p>
          <p style="margin: 0 0 20px 0; font-size: 28px; color: #1d1d1f; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: 2px;">${bookingReference}</p>
          <img src="${qrCodeUrl}" alt="Booking QR Code" style="width: 220px; height: 220px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
        </div>

        <div style="background: #ffffff; border: 1px solid #e5e5ea; border-radius: 12px; padding: 20px; margin: 25px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f7;">
                <span style="color: #86868b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Date</span><br/>
                <span style="color: #1d1d1f; font-size: 16px; font-weight: 500;">${formattedDate}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f7;">
                <span style="color: #86868b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Time</span><br/>
                <span style="color: #1d1d1f; font-size: 16px; font-weight: 500;">${timeSlot}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #86868b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Location</span><br/>
                <span style="color: #1d1d1f; font-size: 16px; font-weight: 500;">AIRO Store - ${location}</span>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e5e5ea;">
          <h3 style="color: #1d1d1f; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">Arrival & Support</h3>
          
          <div style="margin-bottom: 15px;">
            <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1d1d1f;">📍 Directions</p>
            <p style="margin: 0; font-size: 14px; color: #515154; line-height: 1.5;">When you arrive at the <strong>${location}</strong> store, please head towards the pharmacy counter and present your QR code to our AIRO Health Associate. We request you to arrive 5 minutes early.</p>
          </div>

          <div style="margin-bottom: 15px;">
            <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1d1d1f;">📞 Contact Us</p>
            <p style="margin: 0; font-size: 14px; color: #515154; line-height: 1.5;">Need to reschedule? Call us at <a href="tel:+918801010010" style="color: #0A84FF; text-decoration: none;">+91 88010 10010</a></p>
          </div>
          
          <div>
            <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1d1d1f;">✉️ Email Support</p>
            <p style="margin: 0; font-size: 14px; color: #515154; line-height: 1.5;"><a href="mailto:support@airoessentials.com" style="color: #0A84FF; text-decoration: none;">support@airoessentials.com</a></p>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e5ea; margin: 35px 0 20px 0;" />
        <p style="color: #86868b; font-size: 12px; text-align: center; margin: 0;">
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
        subject: 'Your AIRO Health Checkup Booking Confirmation',
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
