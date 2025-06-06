interface PasswordChangedEmailProps {
	firstName: string;
	appName: string;
	supportEmail: string;
	loginUrl: string;
}

export const passwordChangedEmailTemplate = ({
	firstName,
	appName,
	supportEmail,
	loginUrl,
}: PasswordChangedEmailProps): string => {
	return `
    <html>
      <body>
        <h2>Password Changed Successfully</h2>
        <p>Hi ${firstName},</p>
        <p>Your password for ${appName} has been changed successfully.</p>
        <p>If you did not perform this action, please contact support at <a href="mailto:${supportEmail}">${supportEmail}</a> immediately.</p>
        <p><a href="${loginUrl}">Login to your account</a></p>
        <p>Thank you,<br/>The ${appName} Team</p>
      </body>
    </html>
  `;
};
