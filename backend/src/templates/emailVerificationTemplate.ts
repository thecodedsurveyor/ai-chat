interface EmailVerificationProps {
	firstName: string;
	verificationUrl: string;
	appName: string;
}

export const emailVerificationTemplate = ({
	firstName,
	verificationUrl,
	appName,
}: EmailVerificationProps): string => {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Verify Your Email - ${appName}</title>
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
  <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Verify your email to complete your ${appName} registration</span>
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

            <!-- HERO SECTION -->
            <tr>
              <td style="padding: 0;">
                <div style="background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%); border-radius: 12px 12px 0 0; padding: 40px 20px; text-align: center;">
                  <!-- Email Verification Icon -->
                  <div style="margin: 0 auto 15px; width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; line-height: 60px; font-size: 30px;">✉️</div>
                  <h1 style="color: white; font-size: 28px; font-weight: bold; margin: 0; margin-bottom: 10px; text-shadow: 0 1px 3px rgba(0,0,0,0.1);">Verify Your Email</h1>
                  <p style="color: white; margin: 0; font-size: 18px; opacity: 0.9;">Almost there! Just one click to get started</p>
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
                      <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 20px; color: #4B5563;">Welcome to ${appName}! We're excited to have you join our AI-powered community. To complete your registration and unlock all features, please verify your email address.</p>
                      
                      <!-- VERIFICATION NOTICE BOX -->
                      <div style="margin: 0 0 25px; padding: 20px; background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 6px;">
                        <p style="margin: 0; font-size: 16px; color: #4B5563;">
                          <span style="display: block; font-weight: 600; margin-bottom: 5px; color: #374151;">Quick Verification Required</span>
                          This verification link will expire in <span style="font-weight: 600; color: #8B5CF6;">24 hours</span> for your security.
                        </p>
                      </div>
                      
                      <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 25px; color: #4B5563;">Click the button below to verify your email and start exploring:</p>
                      
                      <!-- VERIFICATION BUTTON -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td align="center" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 25px;" valign="top">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                <tbody>
                                  <tr>
                                    <td style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; vertical-align: top; border-radius: 8px; text-align: center; background: linear-gradient(90deg, #EC4899 0%, #8B5CF6 100%);" valign="top" align="center">
                                      <a href="${verificationUrl}" target="_blank" style="display: inline-block; color: #fff; background: transparent; border: solid 1px transparent; border-radius: 8px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 16px; font-weight: bold; margin: 0; padding: 14px 40px;">✅ Verify Email Address</a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <!-- FEATURE PREVIEW BOXES -->
                      <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: 600; margin: 0; margin-bottom: 15px; color: #374151;">What's waiting for you:</p>
                      
                      <!-- Feature 1 -->
                      <div style="background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="40" valign="top">
                              <div style="background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%); width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold;">🤖</div>
                            </td>
                            <td style="padding-left: 10px;">
                              <p style="margin: 0; font-weight: 600; color: #374151;">Advanced AI Conversations</p>
                              <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Chat with multiple AI personalities tailored to your needs</p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Feature 2 -->
                      <div style="background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="40" valign="top">
                              <div style="background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%); width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold;">📁</div>
                            </td>
                            <td style="padding-left: 10px;">
                              <p style="margin: 0; font-weight: 600; color: #374151;">Document Analysis</p>
                              <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Upload and analyze documents with AI assistance</p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Feature 3 -->
                      <div style="background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 6px; padding: 15px; margin-bottom: 25px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="40" valign="top">
                              <div style="background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%); width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold;">🎵</div>
                            </td>
                            <td style="padding-left: 10px;">
                              <p style="margin: 0; font-weight: 600; color: #374151;">Voice Interactions</p>
                              <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Speak naturally with voice input and output</p>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- ALTERNATIVE LINK BOX -->
                      <div style="margin: 0 0 25px; padding: 15px; background-color: #F3F4F6; border-radius: 6px; border: 1px solid #E5E7EB;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600; color: #374151;">Can't click the button?</p>
                        <p style="margin: 0; font-size: 14px; color: #6B7280;">Copy and paste this link into your browser:</p>
                        <p style="margin: 5px 0 0 0; font-size: 12px; word-break: break-all;"><a href="${verificationUrl}" style="color: #8B5CF6; text-decoration: none;">${verificationUrl}</a></p>
                      </div>
                      
                      <!-- DIDN'T SIGN UP NOTICE -->
                      <div style="margin: 0 0 25px; padding: 15px; background-color: #FFEDD5; border-left: 4px solid #F97316; border-radius: 6px;">
                        <p style="margin: 0; font-size: 14px; color: #9A3412;">
                          <strong>Didn't sign up for ${appName}?</strong><br>
                          If you didn't create an account, you can safely ignore this email.
                        </p>
                      </div>
                      
                      <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: normal; margin: 0; color: #4B5563;">Thank you for joining us,<br>The ${appName} Team</p>
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
