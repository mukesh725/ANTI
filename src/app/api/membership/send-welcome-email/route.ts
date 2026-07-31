import { NextResponse } from 'next/server';
import { MemberRecord } from '@/types/membership';

export const dynamic = 'force-dynamic';

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';

const PLAN_BENEFITS: Record<string, string[]> = {
  Signature: [
    'Up to 5 Members Covered',
    '6% Essentials Discount',
    '22% Pharmacy Discount',
    '10 Free Doctor Consultations/Yr',
    'Unlimited Basic Health Screenings',
    'VIP Priority Service'
  ],
  Preferred: [
    'Up to 3 Members Covered',
    '4% Essentials Discount',
    '18% Pharmacy Discount',
    '6 Free Doctor Consultations/Yr',
    '10 Basic Health Screenings'
  ],
  Select: [
    '1 Member Covered',
    '2% Essentials Discount',
    '15% Pharmacy Discount',
    '2 Free Doctor Consultations/Yr',
    '4 Basic Health Screenings'
  ],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const member: MemberRecord = body.member;

    if (!member || !member.email) {
      return NextResponse.json({ error: 'Member record with email is required' }, { status: 400 });
    }

    const memberName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Valued Member';
    const oneId = member.memberId || 'AIRO-1000001';
    
    // Normalize plan name
    let planKey = 'Select';
    if (member.membershipPlan?.toLowerCase().includes('signature')) planKey = 'Signature';
    else if (member.membershipPlan?.toLowerCase().includes('preferred')) planKey = 'Preferred';
    
    const displayPlanName = member.membershipPlan || `AIRO ONE ${planKey}`;
    const benefitsList = PLAN_BENEFITS[planKey] || PLAN_BENEFITS['Select'];

    const activationStr = member.activationDate
      ? new Date(member.activationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const expiryStr = member.expiryDate
      ? new Date(member.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'N/A';

    const digitalCardPageUrl = `https://airohealthhub.com/member/${oneId}`;
    
    // QR Code Image API URL for clean rendering across all email clients
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(digitalCardPageUrl)}&margin=4`;

    // Split benefits into 2 columns for Apple-style layout
    const midPoint = Math.ceil(benefitsList.length / 2);
    const col1 = benefitsList.slice(0, midPoint);
    const col2 = benefitsList.slice(midPoint);

    // Apple-Style HTML Email Template (Fluid Hybrid for Bulletproof Mobile Rendering)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AIRO ONE</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; color: #1d1d1f; }
          @media only screen and (max-width: 600px) {
            .container { padding: 20px 12px !important; }
            .stack-col { display: block !important; width: 100% !important; max-width: 100% !important; padding-right: 0 !important; padding-left: 0 !important; padding-bottom: 24px !important; }
            .center-on-mobile { text-align: center !important; }
            .details-grid td { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
            .hide-on-mobile { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; background-color: #f5f5f7; padding: 30px 10px; box-sizing: border-box;">
          <div class="container" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 28px; padding: 40px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);">
            
            <!-- Top Logo Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <img src="https://airoessentials.com/airo-one-logo.png" width="160" alt="AIRO ONE" style="display: block; margin: 0 auto;"/>
              
              <table class="hide-on-mobile" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; max-width: 320px; margin-left: auto; margin-right: auto;">
                <tr>
                  <td align="center" width="50%" style="padding-right: 12px;">
                    <img src="https://airoessentials.com/airo-essentials-logo.png" width="110" alt="AIRO Essentials" style="display: block; margin: 0 auto;" />
                  </td>
                  <td align="center" width="50%" style="padding-left: 12px;">
                    <img src="https://airoessentials.com/airo-health-logo.png" width="110" alt="AIRO Health" style="display: block; margin: 0 auto;" />
                  </td>
                </tr>
              </table>
            </div>

            <!-- Hero Banner Card (Full Width Vertical) -->
            <div style="background-color: #f5f5f7; border-radius: 24px; padding: 32px 16px; margin-bottom: 32px; text-align: center;">
              
              <!-- Welcome Text -->
              <div style="margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: 700; line-height: 1.15; color: #1d1d1f; margin: 0 0 8px 0; letter-spacing: -0.5px;">Welcome to<br>AIRO ONE.</h1>
                <h2 style="font-size: 20px; font-weight: 600; color: #86868b; margin: 0 0 16px 0; letter-spacing: -0.3px;">Your membership is now active.</h2>
                <p style="font-size: 13px; line-height: 1.5; color: #515154; margin: 0; max-width: 400px; margin-left: auto; margin-right: auto;">
                  Thank you for joining AIRO ONE. Your journey to better health, greater savings and exclusive benefits starts here.
                </p>
              </div>

              <!-- Digital Membership Card Preview (Landscape Uncompressed) -->
              <div style="background-color: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 20px; padding: 24px; width: 100%; max-width: 480px; margin: 0 auto; box-sizing: border-box; text-align: left;">
                
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src="https://airoessentials.com/airo-one-logo.png" width="160" alt="AIRO 1" style="display: inline-block;" />
                </div>

                <div style="background-image: url('https://airoessentials.com/templates/${planKey.toLowerCase()}.jpg'); background-size: cover; background-position: center; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 80px;">
                    <tr>
                      <td>&nbsp;</td>
                    </tr>
                  </table>

                  <div style="text-align: center; font-size: 11px; font-weight: 700; color: #1d1d1f; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 28px;">
                    Membership Access
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td valign="bottom" style="padding-right: 12px;">
                        <div style="font-size: 16px; font-weight: 700; color: #1d1d1f; text-transform: uppercase; margin-bottom: 4px; white-space: nowrap;">${memberName}</div>
                        <div style="font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 20px; white-space: nowrap;">${displayPlanName}</div>
                        
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td valign="top" width="50%">
                              <div style="font-size: 9px; color: #4b5563; font-weight: 600; margin-bottom: 4px; white-space: nowrap;">One ID</div>
                              <div style="font-size: 12px; color: #1d1d1f; font-weight: 600; white-space: nowrap;">${oneId}</div>
                            </td>
                            <td valign="top" width="50%">
                              <div style="font-size: 9px; color: #4b5563; font-weight: 600; margin-bottom: 4px; white-space: nowrap;">Valid Until</div>
                              <div style="font-size: 12px; color: #1d1d1f; font-weight: 600; white-space: nowrap;">${expiryStr}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td width="76" align="right" valign="bottom">
                        <div style="text-align: center;">
                          <div style="font-size: 7px; font-weight: 700; color: #111827; letter-spacing: 0.5px; margin-bottom: 6px; white-space: nowrap;">SCAN</div>
                          <img src="${qrImageUrl}" width="76" height="76" alt="QR Code" style="display: block; border: 0;" />
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            <!-- Digital Card Access Action Box -->
            <div style="border: 1px solid #e5e5e5; border-radius: 20px; padding: 20px 24px; margin-bottom: 28px; background-color: #ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="48" valign="middle" class="hide-on-mobile">
                    <div style="background-color: #1d1d1f; color: #ffffff; width: 38px; height: 38px; border-radius: 12px; font-size: 18px; text-align: center; line-height: 38px;">
                      💳
                    </div>
                  </td>
                  <td valign="middle" class="stack-col center-on-mobile" style="padding-left: 12px; padding-bottom: 0 !important;">
                    <div style="font-size: 14px; font-weight: 700; color: #1d1d1f; margin-bottom: 2px;">
                      Your Digital Membership Card
                    </div>
                    <div style="font-size: 11px; color: #86868b;">
                      Show this card at partner locations to enjoy exclusive member benefits.
                    </div>
                  </td>
                  <td width="130" align="right" valign="middle" class="stack-col center-on-mobile" style="padding-bottom: 0 !important;">
                    <a href="${digitalCardPageUrl}" target="_blank" style="background-color: #1d1d1f; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-size: 13px; font-weight: 600; display: inline-block; white-space: nowrap; margin-top: 8px;">
                      View Card &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Dynamic Plan Benefits Section -->
            <div style="border: 1px solid #e5e5e5; border-radius: 20px; padding: 24px; margin-bottom: 28px; background-color: #ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td width="44" valign="middle">
                    <div style="background-color: #1d1d1f; color: #ffffff; width: 36px; height: 36px; border-radius: 10px; font-size: 16px; text-align: center; line-height: 36px;">
                      💎
                    </div>
                  </td>
                  <td valign="middle" style="padding-left: 10px;">
                    <div style="font-size: 14px; font-weight: 700; color: #1d1d1f;">
                      Your ${displayPlanName} Plan Benefits
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Benefits List (Fluid Hybrid) -->
              <div style="text-align: left; font-size: 0;">
                <!--[if mso]>
                <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="50%" valign="top">
                <![endif]-->
                
                <div class="stack-col" style="display: inline-block; width: 100%; max-width: 240px; vertical-align: top; font-size: 14px; padding-right: 12px; box-sizing: border-box;">
                  ${col1.map(benefit => `
                    <div style="font-size: 12px; color: #1d1d1f; margin-bottom: 10px; line-height: 1.4;">
                      <span style="color: #1d1d1f; font-weight: 800; margin-right: 6px;">✓</span> ${benefit}
                    </div>
                  `).join('')}
                </div>

                <!--[if mso]>
                </td><td width="50%" valign="top">
                <![endif]-->

                <div class="stack-col" style="display: inline-block; width: 100%; max-width: 240px; vertical-align: top; font-size: 14px; padding-left: 12px; box-sizing: border-box;">
                  ${col2.map(b => `
                    <div style="font-size: 12px; color: #1d1d1f; margin-bottom: 10px; line-height: 1.4;">
                      <span style="color: #1d1d1f; font-weight: 800; margin-right: 6px;">✓</span> ${b}
                    </div>
                  `).join('')}
                </div>

                <!--[if mso]>
                </td></tr></table>
                <![endif]-->
              </div>
            </div>

            <!-- Assistance Contact Box -->
            <div style="background-color: #f5f5f7; border-radius: 20px; padding: 20px 24px; margin-bottom: 32px; text-align: center; font-size: 0;">
                <!--[if mso]>
                <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="50%" valign="middle">
                <![endif]-->

                <div class="stack-col center-on-mobile" style="display: inline-block; width: 100%; max-width: 240px; vertical-align: middle; text-align: left; font-size: 14px;">
                  <table border="0" cellspacing="0" cellpadding="0" class="center-on-mobile" style="margin: 0 auto;">
                    <tr>
                      <td width="40" valign="middle">
                        <div style="font-size: 22px;">🎧</div>
                      </td>
                      <td valign="middle">
                        <div style="font-size: 13px; font-weight: 700; color: #1d1d1f; margin-bottom: 2px;">
                          Need Assistance?
                        </div>
                        <div style="font-size: 11px; color: #86868b;">
                          We're here to help you on your health journey.
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>

                <!--[if mso]>
                </td><td width="50%" valign="middle" align="right">
                <![endif]-->

                <div class="stack-col center-on-mobile" style="display: inline-block; width: 100%; max-width: 240px; vertical-align: middle; text-align: right; font-size: 14px;">
                  <div style="font-size: 11px; color: #1d1d1f; line-height: 1.6;">
                    📞 <a href="tel:+918801010010" style="color: #1d1d1f; text-decoration: none; font-weight: 600;">+91 88010 10010</a><br>
                    ✉️ <a href="mailto:care@airohealth.com" style="color: #1d1d1f; text-decoration: none; font-weight: 600;">care@airohealth.com</a><br>
                    🌐 <a href="https://www.airohealth.com" target="_blank" style="color: #1d1d1f; text-decoration: none; font-weight: 600;">www.airohealth.com</a>
                  </div>
                </div>

                <!--[if mso]>
                </td></tr></table>
                <![endif]-->
            </div>

            <!-- Footer -->
            <div style="font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #1d1d1f; text-align: center; margin-bottom: 6px;">🟢 AIRO ONE</div>
            <p style="font-size: 10px; color: #86868b; text-align: center; line-height: 1.5; margin: 0;">
              One Membership. Complete Health. Everyday Savings.<br>
              This is a system generated email. Please do not reply to this email.
            </p>

          </div>
        </div>
      </body>
      </html>
    `;

    // Dispatch Transactional Email via Brevo REST API v3
    const brevoPayload = {
      sender: {
        name: 'AIRO ONE Membership',
        email: 'info@airoessentials.com',
      },
      to: [
        {
          email: member.email.trim(),
          name: memberName,
        },
      ],
      subject: `Welcome to AIRO ONE – Your ${displayPlanName} Membership (${oneId}) is Active!`,
      htmlContent: htmlContent,
    };

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(brevoPayload),
    });

    const brevoData = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error('Brevo API Error:', brevoData);
      const errorMessage = brevoData.message || brevoData.code || 'Brevo API Error';
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: brevoData,
        },
        { status: brevoResponse.status }
      );
    }

    console.log(`[BREVO EMAIL DISPATCH SUCCESS] Message ID: ${brevoData.messageId} to ${member.email}`);

    return NextResponse.json({
      success: true,
      messageId: brevoData.messageId,
      email: member.email,
      oneId,
    });
  } catch (error: any) {
    console.error('Send Welcome Email Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send welcome email' }, { status: 500 });
  }
}
