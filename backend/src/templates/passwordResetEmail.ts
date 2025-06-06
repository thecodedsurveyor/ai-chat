interface PasswordResetEmailProps {
	firstName: string;
	resetUrl: string;
	appName: string;
	expiryHours: number;
}

export const passwordResetEmailTemplate = ({
	firstName,
	resetUrl,
	appName,
	expiryHours,
}: PasswordResetEmailProps): string => {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Reset Your Password - ${appName}</title>
  <style>
    @media only screen and (max-width: 620px) {
      table.body h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }
      table.body p,
      table.body ul,
      table.body ol,
      table.body td,
      table.body span,
      table.body a {
        font-size: 16px !important;
      }
      table.body .wrapper,
      table.body .article {
        padding: 10px !important;
      }
      table.body .content {
        padding: 0 !important;
      }
      table.body .container {
        padding: 0 !important;
        width: 100% !important;
      }
      table.body .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
      table.body .btn table {
        width: 100% !important;
      }
      table.body .btn a {
        width: 100% !important;
      }
      table.body .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }
    @media all {
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
      .btn-primary table td:hover {
        background-color: #8A2BE2 !important;
      }
      .btn-primary a:hover {
        background-color: #8A2BE2 !important;
        border-color: #8A2BE2 !important;
      }
    }
  </style>
</head>
<body style="background-color: #f4f7ff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.5; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
  <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Reset your password for ${appName}</span>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f7ff; width: 100%;" width="100%" bgcolor="#f4f7ff">
    <tr>
      <td style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
      <td class="container" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; vertical-align: top; display: block; max-width: 600px; padding: 30px 10px; width: 600px; margin: 0 auto;" width="600" valign="top">
        <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;">
          
          <!-- HEADER WITH LOGO -->
          <div style="text-align: center; margin-bottom: 20px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 0;">
              <tr>
                <td style="padding: 0; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; letter-spacing: 1px; color: #8B5CF6;">
                    <span style="background: linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">${appName}</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- START CENTERED WHITE CONTAINER -->
          <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 12px; width: 100%; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);" width="100%">
            
            <!-- HERO SECTION WITH LOCK ICON -->
            <tr>
              <td style="padding: 0;">
                <div style="background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%); border-radius: 12px 12px 0 0; padding: 40px 20px; text-align: center;">
                  <!-- Lock Icon -->
                  <div style="margin: 0 auto 15px; width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; line-height: 60px; font-size: 30px;">🔒</div>
                  <h1 style="color: white; font-size: 28px; font-weight: bold; margin: 0; margin-bottom: 10px; text-shadow: 0 1px 3px rgba(0,0,0,0.1);">Password Reset</h1>
                  <p style="color: white; margin: 0; font-size: 18px; opacity: 0.9;">Secure your account with a new password</p>
                </div>
              </td>
            </tr>
            
            <!-- START MAIN CONTENT AREA -->
            <tr>
              <td class="wrapper" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 30px;" valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                  <tr>
                    <td style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; vertical-align: top;" valign="top">
                      <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 20px; color: #4B5563;">Hi ${firstName},</p>
                      <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 20px; color: #4B5563;">We received a request to reset your password for your ${appName} account.</p>
                      
                      <!-- SECURITY NOTICE BOX -->
                      <div style="margin: 0 0 25px; padding: 20px; background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 6px;">
                        <p style="margin: 0; font-size: 16px; color: #4B5563;">
                          <span style="display: block; font-weight: 600; margin-bottom: 5px; color: #374151;">Security Notice</span>
                          This password reset link will expire in <span style="font-weight: 600; color: #8B5CF6;">${expiryHours} hour${expiryHours > 1 ? 's' : ''}</span> for your security.
                        </p>
                      </div>
                      
                      <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 25px; color: #4B5563;">Click the button below to create a new password and secure your account:</p>
                      
                      <!-- BUTTON -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td align="center" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 25px;" valign="top">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                <tbody>
                                  <tr>
                                    <td style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; vertical-align: top; border-radius: 8px; text-align: center; background: linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%);" valign="top" align="center">
                                      <a href="${resetUrl}" target="_blank" style="display: inline-block; color: #fff; background: transparent; border: solid 1px transparent; border-radius: 8px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 16px; font-weight: bold; margin: 0; padding: 14px 40px;">Reset Password</a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <!-- SAFETY NOTE -->
                      <div style="margin: 0 0 25px; padding: 15px; background-color: #FFEDD5; border-left: 4px solid #F97316; border-radius: 6px;">
                        <p style="margin: 0; font-size: 14px; color: #9A3412;">
                          <strong>Didn't request this change?</strong><br>
                          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                        </p>
                      </div>
                      
                      <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: normal; margin: 0; color: #4B5563;">Thank you,<br>The ${appName} Team</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          <!-- END MAIN CONTENT AREA -->
          </table>
          <!-- END CENTERED WHITE CONTAINER -->
          
          <!-- START FOOTER -->
          <div class="footer" style="clear: both; margin-top: 20px; text-align: center; width: 100%;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
              <tr>
                <td class="content-block" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #9CA3AF; font-size: 13px; text-align: center;" valign="top" align="center">
                  <span class="apple-link" style="color: #9CA3AF; font-size: 13px; text-align: center;">${appName}<br>Need help? Contact support.</span>
                </td>
              </tr>
              <tr>
                <td class="content-block" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 0; color: #9CA3AF; font-size: 13px; text-align: center;" valign="top" align="center">
                  <span style="color: #9CA3AF; font-size: 13px; text-align: center;">© 2023 ${appName}. All rights reserved.</span>
                </td>
              </tr>
            </table>
          </div>
          <!-- END FOOTER -->
        </div>
      </td>
      <td style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
    </tr>
  </table>
</body>
</html>
  `;
};
