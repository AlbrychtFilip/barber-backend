import twilio from 'twilio';

function getClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );
}

export const notificationsService = {
  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    try {
      await getClient().messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: phoneNumber,
      });
      console.log(`SMS sent to ${phoneNumber}: ${message}`);
      return true;
    } catch (error) {
      console.error(`Failed to send SMS to ${phoneNumber}:`, error);
      return false;
    }
  },
};
