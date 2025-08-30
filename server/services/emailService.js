const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

async initializeTransporter() {
  try {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      logger: true, // Enable Nodemailer logging
      debug: true, // Include debug output
    });

    // Verify connection
    await this.transporter.verify();
    console.log('Email service initialized successfully');
  } catch (error) {
    console.error('Email service initialization failed:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
    });
    this.transporter = null;
  }
}
  async sendEmail(to, subject, htmlContent) {
    if (!this.transporter) {
      console.log('Email service not available, skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: `"SR Dashboard" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Failed to send email:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Template for new service request
  getNewRequestTemplate(request, createdBy) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0054a6, #8dc63f); color: white; padding: 20px; text-align: center;">
          <h1>New Service Request Created</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #0054a6;">Request Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">SR Number:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${request.serviceNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Node:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${request.node || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Issue:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${request.issue || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Status:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                <span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 4px;">${request.status}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Created By:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${createdBy}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Created Date:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(request.createdAt).toLocaleString()}</td>
            </tr>
          </table>

          ${request.description ? `
            <h3 style="color: #0054a6; margin-top: 20px;">Description</h3>
            <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #8dc63f;">${request.description}</p>
          ` : ''}
<div style="text-align: center; margin-top: 30px;">
  <table border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" bgcolor="#0054a6" style="border-radius: 4px;">
        <a href="http://172.22.97.21:5173" 
           target="_blank"
           style="font-size: 16px; 
                  font-family: Arial, sans-serif; 
                  color: #ffffff; 
                  text-decoration: none; 
                  padding: 12px 24px; 
                  display: inline-block;">
          View Dashboard
        </a>
      </td>
    </tr>
  </table>
</div>

        </div>
        
        <div style="background: #2c3e50; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>Service Request Dashboard - SLT Mobitel</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    `;
  }

  // Template for status update
  getStatusUpdateTemplate(request, oldStatus, newStatus, updatedBy) {
    const statusColors = {
      'open': '#e74c3c',
      'in-progress': '#f39c12',
      'closed': '#27ae60'
    };

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0054a6, #8dc63f); color: white; padding: 20px; text-align: center;">
          <h1>Service Request Status Updated</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #0054a6;">SR Number: ${request.serviceNumber}</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Status Change</h3>
            <p style="margin: 10px 0;">
              <span style="background: ${statusColors[oldStatus]}; color: white; padding: 4px 8px; border-radius: 4px;">${oldStatus}</span>
              <span style="margin: 0 10px;">→</span>
              <span style="background: ${statusColors[newStatus]}; color: white; padding: 4px 8px; border-radius: 4px;">${newStatus}</span>
            </p>
            <p><strong>Updated by:</strong> ${updatedBy}</p>
            <p><strong>Updated on:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; background: white;">
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Node:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${request.node || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;">Issue:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${request.issue || 'N/A'}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <a href="http://172.22.97.21:5173" style="background: linear-gradient(135deg, #0054a6, #8dc63f); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Dashboard
            </a>
          </div>
        </div>
        
        <div style="background: #2c3e50; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>Service Request Dashboard - SLT Mobitel</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    `;
  }

  // Send notification for new request
  async sendNewRequestNotification(request, createdBy) {
    const adminEmail = process.env.ADMIN_EMAIL || 'isuruw.ou@mobitel.lk';
    const subject = `New Service Request: ${request.serviceNumber}`;
    const htmlContent = this.getNewRequestTemplate(request, createdBy);
    
    return await this.sendEmail(adminEmail, subject, htmlContent);
  }

  // Send notification for status update
  async sendStatusUpdateNotification(request, oldStatus, newStatus, updatedBy) {
    const adminEmail = process.env.ADMIN_EMAIL || 'isuruw.ou@mobitel.lk';
    const subject = `SR ${request.serviceNumber} Status: ${oldStatus} → ${newStatus}`;
    const htmlContent = this.getStatusUpdateTemplate(request, oldStatus, newStatus, updatedBy);
    
    return await this.sendEmail(adminEmail, subject, htmlContent);
  }
}

module.exports = new EmailService();
