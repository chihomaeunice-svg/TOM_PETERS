const API_KEY = import.meta.env.VITE_RESEND_API_KEY as string;
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string) || 'chihomaeunice@gmail.com';
const FROM = 'TOMPETERS <onboarding@resend.dev>';

async function send(payload: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!API_KEY) { console.warn('Resend API key not configured'); return; }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, ...payload }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Resend error:', err);
    }
  } catch (e) {
    console.error('Email send failed:', e);
  }
}

export const emailNewInquiry = (data: {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  description: string;
}) =>
  send({
    to: ADMIN_EMAIL,
    subject: `New Seller Inquiry — ${data.businessName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border:1px solid #e8e0d4;">
        <h1 style="font-size:22px;color:#1a1a1a;margin:0 0 4px;letter-spacing:2px;text-transform:uppercase;">TOMPETERS</h1>
        <p style="font-size:11px;color:#8c7b6b;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;">New Seller Application</p>
        <hr style="border:none;border-top:1px solid #e8e0d4;margin-bottom:32px;" />
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3a3530;">
          <tr><td style="padding:8px 0;color:#8c7b6b;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${data.name}</td></tr>
          <tr><td style="padding:8px 0;color:#8c7b6b;">Email</td><td style="padding:8px 0;">${data.email}</td></tr>
          <tr><td style="padding:8px 0;color:#8c7b6b;">Phone</td><td style="padding:8px 0;">${data.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#8c7b6b;">Business</td><td style="padding:8px 0;font-weight:600;">${data.businessName}</td></tr>
          <tr><td style="padding:8px 0;color:#8c7b6b;">Type</td><td style="padding:8px 0;">${data.businessType}</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#fff;border:1px solid #e8e0d4;border-radius:4px;">
          <p style="font-size:11px;color:#8c7b6b;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">About Their Brand</p>
          <p style="font-size:14px;color:#3a3530;margin:0;line-height:1.6;">${data.description}</p>
        </div>
        <div style="margin-top:32px;text-align:center;">
          <a href="https://tom-peters-64157.web.app/admin/sellers" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 28px;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
            Review in Admin Panel
          </a>
        </div>
        <p style="margin-top:32px;font-size:11px;color:#b0a090;text-align:center;">© ${new Date().getFullYear()} Tompeters. All rights reserved.</p>
      </div>
    `,
  });

export const emailApplicationDecision = (data: {
  to: string;
  name: string;
  businessName: string;
  decision: 'approved' | 'rejected';
}) => {
  const approved = data.decision === 'approved';
  return send({
    to: data.to,
    subject: `Your Tompeters Application — ${approved ? 'Approved ✓' : 'Update'}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border:1px solid #e8e0d4;">
        <h1 style="font-size:22px;color:#1a1a1a;margin:0 0 4px;letter-spacing:2px;text-transform:uppercase;">TOMPETERS</h1>
        <p style="font-size:11px;color:#8c7b6b;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;">Seller Application Update</p>
        <hr style="border:none;border-top:1px solid #e8e0d4;margin-bottom:32px;" />
        <p style="font-size:15px;color:#3a3530;">Hi <strong>${data.name}</strong>,</p>
        ${approved ? `
          <div style="background:#f0faf4;border-left:3px solid #2d7a4f;padding:16px 20px;margin:20px 0;border-radius:2px;">
            <p style="font-size:15px;color:#1a1a1a;margin:0 0 8px;font-weight:600;">🎉 Your application has been approved!</p>
            <p style="font-size:14px;color:#3a3530;margin:0;line-height:1.6;">
              Welcome to Tompeters, <strong>${data.businessName}</strong>. Your seller account is now active. Sign in to your seller dashboard to start listing your products.
            </p>
          </div>
          <div style="margin-top:28px;text-align:center;">
            <a href="https://tom-peters-64157.web.app/login" style="display:inline-block;background:#c9a96e;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
              Go to Seller Dashboard
            </a>
          </div>
        ` : `
          <div style="background:#fdf5f5;border-left:3px solid #c0392b;padding:16px 20px;margin:20px 0;border-radius:2px;">
            <p style="font-size:15px;color:#1a1a1a;margin:0 0 8px;font-weight:600;">Application not approved</p>
            <p style="font-size:14px;color:#3a3530;margin:0;line-height:1.6;">
              Thank you for your interest in Tompeters. After careful review, we are unable to approve the application for <strong>${data.businessName}</strong> at this time. You are welcome to reapply in the future.
            </p>
          </div>
          <p style="font-size:14px;color:#8c7b6b;line-height:1.6;">
            If you have any questions, please reach out to us at <a href="mailto:chihomaeunice@gmail.com" style="color:#c9a96e;">chihomaeunice@gmail.com</a>.
          </p>
        `}
        <p style="margin-top:40px;font-size:11px;color:#b0a090;text-align:center;">© ${new Date().getFullYear()} Tompeters. All rights reserved.</p>
      </div>
    `,
  });
};

export const emailOrderConfirmation = (data: {
  to: string;
  customerName: string;
  orderId: string;
  items: { name: string; size: string; qty: number; price: number }[];
  total: number;
}) =>
  send({
    to: data.to,
    subject: `Order Confirmed — #${data.orderId.slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border:1px solid #e8e0d4;">
        <h1 style="font-size:22px;color:#1a1a1a;margin:0 0 4px;letter-spacing:2px;text-transform:uppercase;">TOMPETERS</h1>
        <p style="font-size:11px;color:#8c7b6b;letter-spacing:3px;text-transform:uppercase;margin:0 0 32px;">Order Confirmation</p>
        <hr style="border:none;border-top:1px solid #e8e0d4;margin-bottom:32px;" />
        <p style="font-size:15px;color:#3a3530;">Hi <strong>${data.customerName}</strong>, thank you for your order.</p>
        <p style="font-size:13px;color:#8c7b6b;">Order #${data.orderId.slice(-8).toUpperCase()}</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid #e8e0d4;">
              <th style="text-align:left;padding:8px 0;color:#8c7b6b;font-weight:normal;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Item</th>
              <th style="text-align:center;padding:8px 0;color:#8c7b6b;font-weight:normal;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Size</th>
              <th style="text-align:center;padding:8px 0;color:#8c7b6b;font-weight:normal;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Qty</th>
              <th style="text-align:right;padding:8px 0;color:#8c7b6b;font-weight:normal;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(i => `
              <tr style="border-bottom:1px solid #f0ebe4;">
                <td style="padding:10px 0;color:#1a1a1a;">${i.name}</td>
                <td style="padding:10px 0;text-align:center;color:#8c7b6b;">${i.size}</td>
                <td style="padding:10px 0;text-align:center;color:#8c7b6b;">${i.qty}</td>
                <td style="padding:10px 0;text-align:right;color:#1a1a1a;">$${(i.price * i.qty).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding-top:12px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8c7b6b;">Total</td>
              <td style="padding-top:12px;text-align:right;font-size:16px;font-weight:600;color:#1a1a1a;">$${data.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <div style="margin-top:28px;text-align:center;">
          <a href="https://tom-peters-64157.web.app/orders" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 28px;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
            Track Your Order
          </a>
        </div>
        <p style="margin-top:32px;font-size:11px;color:#b0a090;text-align:center;">© ${new Date().getFullYear()} Tompeters. All rights reserved.</p>
      </div>
    `,
  });
