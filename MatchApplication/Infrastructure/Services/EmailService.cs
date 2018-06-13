using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace MatchApplication.Infrastructure.Services
{
    public static class EmailService
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(EmailService));

        public static bool SendEmail(string to, string subject, string body, string from, string replyTo = "")
        {
            var mailMessage = new MailMessage(from.Trim(), to.Trim());
            mailMessage.Subject = subject;
            mailMessage.Body = body;
            if (!string.IsNullOrEmpty(replyTo))
            {
                mailMessage.ReplyToList.Add(replyTo);
            }
            mailMessage.IsBodyHtml = true;
            return SendEmail(mailMessage);
        }

        public static bool SendEmail(MailMessage message)
        {
            var mailClient = new SmtpClient();
            try
            {
                mailClient.Send(message);
                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex);
                return false;
            }
        }
    }
}