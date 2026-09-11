export interface BookingEmailDetails {
  firstName: string;
  lastName: string;
  email: string;
  date: string;
  timeSlot: string;
  location: string;
  bookingReference: string;
  service?: string;
  careOption?: 'in-person' | 'virtual' | 'scan';
  doctorName?: string;
  meetingLink?: string;
}

export async function sendBookingConfirmationEmail(bookingDetails: BookingEmailDetails) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  if (!BREVO_API_KEY) {
    console.warn("No Brevo API key found. Email will not be sent.");
    return false;
  }

  const { 
    firstName, 
    lastName, 
    email, 
    date, 
    timeSlot, 
    location, 
    bookingReference,
    service = "AIRO Minute Clinic Visit",
    careOption = "in-person",
    doctorName,
    meetingLink
  } = bookingDetails;
  
  // Format date for better readability (e.g. Monday, August 10, 2026)
  const dateObj = new Date(date);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : date;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://airohealthhub.com';
  const qrCodeUrl = `${baseUrl}/api/bookings/qr?ref=${encodeURIComponent(bookingReference)}`;

  let mapLink = 'https://www.google.com/maps/search/AIRO+Essentials';
  if (location && location.toLowerCase().includes('kondapur')) {
    mapLink = 'https://share.google/aAEKjMbEpbbZ3Sq6l';
  } else if (location && location.toLowerCase().includes('kompally')) {
    mapLink = 'https://share.google/kjLtlr771ylTznpGW';
  }

  const isVirtual = careOption === 'virtual';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - AIRO Health Hub</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 30px 15px; color: #111827;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 35px 30px; border-radius: 20px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
        
        <!-- Header Brand -->
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="display: inline-block; background-color: #006537; color: #ffffff; padding: 6px 14px; border-radius: 8px; font-weight: 800; font-size: 14px; letter-spacing: 1px; margin-bottom: 12px;">
            AIRO HEALTH HUB
          </div>
          <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
            Appointment Confirmed
          </h1>
          <p style="color: #6b7280; font-size: 14px; margin: 6px 0 0 0;">
            ${isVirtual ? 'Virtual Video Consultation' : 'In-Person Minute Clinic Visit'}
          </p>
        </div>

        <!-- Notification Banner -->
        <div style="background: ${isVirtual ? '#eff6ff' : '#ecfdf5'}; border-left: 4px solid ${isVirtual ? '#2563eb' : '#059669'}; padding: 14px 16px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: ${isVirtual ? '#1e40af' : '#065f46'}; font-size: 14px; font-weight: 600; line-height: 1.4;">
            ${isVirtual 
              ? '🎥 Your telemedicine video consultation room is ready below. Join at your appointment time.' 
              : '✅ Before you arrive, complete your quick pre-visit checklist in your profile to check in instantly.'}
          </p>
        </div>

        <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Hi ${firstName} ${lastName},</p>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Your appointment for <strong>${service}</strong> has been successfully booked with AIRO Health Hub.
        </p>

        <!-- Reference Code Box -->
        <div style="text-align: center; margin: 25px 0; padding: 24px; background-color: #f9fafb; border-radius: 16px; border: 1px dashed #d1d5db;">
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Booking Reference</p>
          <p style="margin: 0 0 ${isVirtual ? '0' : '15px'} 0; font-size: 26px; color: #111827; font-weight: 800; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: 2px;">
            #${bookingReference}
          </p>
          ${!isVirtual ? `
            <img src="${qrCodeUrl}" alt="Check-in QR Code" style="width: 170px; height: 170px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: white; padding: 8px;" />
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">Show this QR code upon arrival at the clinic counter.</p>
          ` : ''}
        </div>

        <!-- Appointment Details Table -->
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px 20px; margin-bottom: 25px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                <span style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Service</span><br/>
                <span style="color: #111827; font-size: 15px; font-weight: 700;">${service}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                <span style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Date & Time</span><br/>
                <span style="color: #111827; font-size: 15px; font-weight: 600;">${formattedDate} at ${timeSlot}</span>
              </td>
            </tr>
            ${isVirtual && doctorName ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                <span style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Clinical Specialist</span><br/>
                <span style="color: #111827; font-size: 15px; font-weight: 600;">${doctorName}</span>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                <span style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Location / Care Mode</span><br/>
                <span style="color: #111827; font-size: 15px; font-weight: 600;">
                  ${isVirtual ? 'Virtual Consultation Room (100ms HD Audio/Video)' : location}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Action CTA Button -->
        <div style="text-align: center; margin: 25px 0;">
          ${isVirtual && meetingLink ? `
            <a href="${meetingLink}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);">
              Join Video Consultation Room &rarr;
            </a>
          ` : `
            <a href="https://airohealthhub.com/ecommerce/account#consultations" target="_blank" style="display: inline-block; background-color: #006537; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(0, 101, 55, 0.2);">
              Open Pre-Visit Checklist & Check-In &rarr;
            </a>
          `}
        </div>

        <!-- Help & Directions Footer -->
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #4b5563;">
          ${!isVirtual ? `
            <div style="margin-bottom: 12px;">
              <span style="font-weight: 700; color: #111827;">📍 Directions:</span>
              <a href="${mapLink}" style="color: #006537; text-decoration: underline; margin-left: 4px; font-weight: 600;">View Clinic on Google Maps &rarr;</a>
            </div>
          ` : ''}
          <div style="margin-bottom: 12px;">
            <span style="font-weight: 700; color: #111827;">📞 Patient Support:</span>
            <a href="tel:+9190000182121" style="color: #006537; text-decoration: none; margin-left: 4px;">+91 90000 182121</a>
          </div>
          <div>
            <span style="font-weight: 700; color: #111827;">✉️ Support Desk:</span>
            <a href="mailto:info@airoessentials.com" style="color: #006537; text-decoration: none; margin-left: 4px;">info@airoessentials.com</a>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0 16px 0;" />
        <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
          &copy; ${new Date().getFullYear()} AIRO Health Hub & AIRO Essentials. All rights reserved.
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
          name: 'AIRO Health Hub',
          email: 'info@airoessentials.com'
        },
        to: [
          {
            email: email.trim(),
            name: `${firstName} ${lastName}`.trim() || 'Valued Patient'
          }
        ],
        subject: `Appointment Confirmed: ${service} with AIRO Health Hub (#${bookingReference})`,
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Brevo Booking Confirmation API Error]:', errorData);
      return false;
    }

    const resData = await response.json().catch(() => ({}));
    console.log(`[Brevo Email Sent] Message ID: ${resData.messageId} to ${email}`);
    return true;
  } catch (error) {
    console.error('[Email Dispatch Error]:', error);
    return false;
  }
}
