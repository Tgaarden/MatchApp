using EPiServer;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Filters;
using EPiServer.Framework.Localization;
using EPiServer.Personalization;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;
using MatchApplication.Models.Blocks;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Security;

namespace MatchApplication.Infrastructure.Services
{
    public static class Tools
    {
        public const string ISO8601DateAndTimeFormat = "yyyy'-'MM'-'dd'T'HH':'mm':'ssK";

        //public static T GetGlobalSetting<T>(Func<SettingsBlock, T> a)
        //{
        //    var settings = GetSettings();
        //    if (settings != null)
        //    {
        //        return a(settings);
        //    }
        //    return default(T);
        //}

        //public static SettingsBlock GetSettings()
        //{
        //    var frontPage = GetStartPage();
        //    if (frontPage != null)
        //    {
        //        return frontPage.Settings;
        //    }
        //    return null;
        //}

        public static string Translate(string resourceKey, string fallback = "")
        {
            var localizationService = ServiceLocator.Current.GetInstance<LocalizationService>();
            string text = "";
            if (localizationService.TryGetString(resourceKey, out text))
            {
                return text;
            }
            if (!string.IsNullOrEmpty(fallback))
            {
                return fallback;
            }
            return "No text for " + resourceKey + "";
        }

        public static bool IsValidEmail(string strIn)
        {
            try
            {
                var m = new System.Net.Mail.MailAddress(strIn);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        public static string AddQueryParameter(string url, string parameterName, string parameterValue)
        {
            if (url.Contains("?"))
            {
                url += "&";
            }
            else
            {
                url += "?";
            }
            return url + parameterName + "=" + HttpUtility.UrlEncode(parameterValue);
        }

        public static int TryParseInt(string val, int def)
        {
            int output = 0;
            if (int.TryParse(val, out output))
            {
                return output;
            }
            return def;
        }

        public static string TruncateDisplayText(string input, int maxCharacters, string markedText = null)
        {

            if (maxCharacters <= 0)
            {
                throw new ArgumentOutOfRangeException("maxCharacters", "maxCharacters should be larger than 0");
            }

            if (!string.IsNullOrEmpty(input) && input.Trim().Length > maxCharacters)
            {
                input = input.Trim();

                if (!string.IsNullOrEmpty(markedText))
                {
                    var markedTexts = string.Join("|", markedText.Split(' ').Where(x => x != " ").ToArray());

                    var matches = Regex.Matches(input, markedTexts, RegexOptions.IgnoreCase);
                    if (matches.Count > 0)
                    {
                        int centerMatchIndex = (int)Math.Floor((float)matches.Count / 2f);
                        int centerIndex = matches[centerMatchIndex].Index;
                        int halfOfText = maxCharacters / 2;

                        int start = centerIndex - halfOfText;
                        int end = centerIndex + halfOfText;
                        if (start < 0)
                        {
                            end += start * -1;
                            start = 0;
                        }
                        if (end > input.Length)
                        {
                            if (start > 0)
                            {
                                start -= (end - input.Length);
                                if (start < 0)
                                {
                                    start = 0;
                                }
                            }
                            end = input.Length;
                        }


                        string output = input.Substring(start, Math.Max(end - start, 1));

                        output = Regex.Replace(output, "(" + markedTexts + ")", "<strong>$1</strong>", RegexOptions.IgnoreCase);

                        if (start > 0)
                        {
                            output = "..." + output;
                        }
                        if (end < input.Length)
                        {
                            output = output + "...";
                        }
                        return output;
                    }
                }

                return input.Substring(0, Math.Max(maxCharacters - 3, 1)) + "...";
            }
            return input;
        }

        public static string WrapVideoEmbedCodeWithResponsiveFrame(string embedCode)
        {
            if (!string.IsNullOrEmpty(embedCode) && embedCode.IndexOf("relative") == -1)
            {
                return string.Format("<div class=\"video-wide-container\">{0}</div>", embedCode);
            }
            return embedCode;
        }

        public static string GetVideoPreviewImage(string embedCode)
        {
            if (!string.IsNullOrEmpty(embedCode))
            {
                // if youtube:
                var m = Regex.Match(embedCode, "^.*youtube.com/embed/([^?]+)\\?.*$", RegexOptions.IgnoreCase);
                if (m.Success && m.Groups.Count == 2)
                {
                    return string.Format("<img src=\"//i.ytimg.com/vi/{0}/0.jpg\"/>", m.Groups[1].Value);
                }


            }
            return string.Empty;
        }

        public static CategoryCollection GetSubCategories(string categoryName)
        {
            var categoryRepository = ServiceLocator.Current.GetInstance<CategoryRepository>();
            var c = categoryRepository.Get(categoryName);
            if (c != null)
            {
                return c.Categories;
            }
            return null;
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        /// <summary>
        /// Do not change this
        /// </summary>
        private static string _thePassword = "oYTU/(J&/monb-4_joibDERUqbeoi.78hsfkt";
        private static byte[] _salt = Encoding.UTF8.GetBytes("5uper Duper H3mme!1g");

        /// <summary>
        /// Encrypt the given string using AES.  The string can be decrypted using 
        /// DecryptStringAES().  The sharedSecret parameters must match.
        /// </summary>
        /// <param name="plainText">The text to encrypt.</param>
        /// <param name="sharedSecret">A password used to generate a key for encryption.</param>
        private static string EncryptStringAES(string plainText, string sharedSecret)
        {
            if (string.IsNullOrEmpty(plainText))
                throw new ArgumentNullException("plainText");
            if (string.IsNullOrEmpty(sharedSecret))
                throw new ArgumentNullException("sharedSecret");

            string outStr = null;                       // Encrypted string to return
            RijndaelManaged aesAlg = null;              // RijndaelManaged object used to encrypt the data.

            try
            {
                // generate the key from the shared secret and the salt
                Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(sharedSecret, _salt);

                // Create a RijndaelManaged object
                aesAlg = new RijndaelManaged();
                aesAlg.Key = key.GetBytes(aesAlg.KeySize / 8);

                // Create a decryptor to perform the stream transform.
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    // prepend the IV
                    msEncrypt.Write(BitConverter.GetBytes(aesAlg.IV.Length), 0, sizeof(int));
                    msEncrypt.Write(aesAlg.IV, 0, aesAlg.IV.Length);
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                    }
                    outStr = Convert.ToBase64String(msEncrypt.ToArray());
                }
            }
            finally
            {
                // Clear the RijndaelManaged object.
                if (aesAlg != null)
                    aesAlg.Clear();
            }

            // Return the encrypted bytes from the memory stream.
            return outStr;
        }

        /// <summary>
        /// Decrypt the given string.  Assumes the string was encrypted using 
        /// EncryptStringAES(), using an identical sharedSecret.
        /// </summary>
        /// <param name="cipherText">The text to decrypt.</param>
        /// <param name="sharedSecret">A password used to generate a key for decryption.</param>
        private static string DecryptStringAES(string cipherText, string sharedSecret)
        {
            if (string.IsNullOrEmpty(cipherText))
                throw new ArgumentNullException("cipherText");
            if (string.IsNullOrEmpty(sharedSecret))
                throw new ArgumentNullException("sharedSecret");

            // Declare the RijndaelManaged object
            // used to decrypt the data.
            RijndaelManaged aesAlg = null;

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            try
            {
                // generate the key from the shared secret and the salt
                Rfc2898DeriveBytes key = new Rfc2898DeriveBytes(sharedSecret, _salt);

                // Create the streams used for decryption.                
                byte[] bytes = Convert.FromBase64String(cipherText);
                using (MemoryStream msDecrypt = new MemoryStream(bytes))
                {
                    // Create a RijndaelManaged object
                    // with the specified key and IV.
                    aesAlg = new RijndaelManaged();
                    aesAlg.Key = key.GetBytes(aesAlg.KeySize / 8);
                    // Get the initialization vector from the encrypted stream
                    aesAlg.IV = ReadByteArray(msDecrypt);
                    // Create a decrytor to perform the stream transform.
                    ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))

                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                    }
                }
            }
            finally
            {
                // Clear the RijndaelManaged object.
                if (aesAlg != null)
                    aesAlg.Clear();
            }

            return plaintext;
        }

        private static byte[] ReadByteArray(Stream s)
        {
            byte[] rawLength = new byte[sizeof(int)];
            if (s.Read(rawLength, 0, rawLength.Length) != rawLength.Length)
            {
                throw new SystemException("Stream did not contain properly formatted byte array");
            }

            byte[] buffer = new byte[BitConverter.ToInt32(rawLength, 0)];
            if (s.Read(buffer, 0, buffer.Length) != buffer.Length)
            {
                throw new SystemException("Did not read byte array properly");
            }

            return buffer;
        }



        /// <summary>
        /// Replace + with 00 and removes dash and spaces and paranteses
        /// </summary>
        /// <param name="mobile"></param>
        /// <returns></returns>
        public static string CleanMobileNumber(string mobile)
        {
            if (string.IsNullOrEmpty(mobile))
            {
                return string.Empty;
            }
            mobile = mobile.Replace(" ", "").Replace("-", "").Replace("(", "").Replace("+", "00").Replace(")", "");
            return mobile;
        }

        public static IEnumerable<T> GetBlocksOfType<T>(bool filterPublished = true, bool filterAccess = true)
    where T : BlockData
        {
            var blockTypeForT = ServiceLocator.Current.GetInstance<IContentTypeRepository>().Load<T>();
            var contentUsages = ServiceLocator.Current.GetInstance<IContentModelUsage>().ListContentOfContentType(blockTypeForT);
            var contentLoader = ServiceLocator.Current.GetInstance<IContentLoader>();

            List<IContent> blocks = contentUsages
                .Select(contentUsage => contentUsage.ContentLink.ToReferenceWithoutVersion())
                .Distinct()
                .Select(contentReference => contentLoader.Get<IContent>(contentReference)).ToList();

            if (filterPublished)
            {
                new FilterPublished().Filter(blocks);
            }
            if (filterAccess)
            {
                new FilterAccess().Filter(blocks);
            }

            return blocks.OfType<T>();
        }

        public static PageData GetCurrentPage()
        {
            if (HttpContext.Current != null)
            {
                var pageRouteHelper = ServiceLocator.Current.GetInstance<IPageRouteHelper>();
                return pageRouteHelper.Page;
            }
            return null;
        }

        public static string DisplayDateSpan(DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
            {
                return string.Empty;
            }

            if (!endDate.HasValue || startDate.Value.Date == endDate.Value.Date)
            {
                return startDate.Value.ToString("d. MMMM yyyy");
            }

            if (startDate.Value.Date.Month == endDate.Value.Date.Month && startDate.Value.Date.Year == endDate.Value.Date.Year)
            {
                return startDate.Value.ToString("d.") + " - " + endDate.Value.ToString("d. MMMM yyyy");
            }

            if (startDate.Value.Date.Year == endDate.Value.Date.Year)
            {
                return startDate.Value.ToString("d. MMMM") + " - " + endDate.Value.ToString("d. MMMM yyyy");
            }

            return startDate.Value.ToString("d. MMMM yyyy") + " - " + endDate.Value.ToString("d. MMMM yyyy");
        }
    }
}