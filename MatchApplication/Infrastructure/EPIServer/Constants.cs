using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MatchApplication.Infrastructure.EPIServer
{
    public class Constants
    {
        [GroupDefinitions()]
        public static class GroupNames
        {
            [Display(Order = 1)]
            public const string Content = SystemTabNames.Content;

            [Display(Name = "Avtalegiro", Order = 30)]
            public const string Avtalegiro = "Avtalegiro";

            [Display(Name = "Organisasjon", Order = 35)]
            public const string Organization = "Organization";

            [Display(Name = "Kurs innstillinger", Order = 40)]
            public const string CourseSettings = "CourseSettings";

            [Display(Name = "Metadata", Order = 50)]
            public const string MetaData = "Metadata";

            [Display(Name = "Innstillinger", Order = 75)]
            public const string Settings = SystemTabNames.Settings;

            [Display(Name = "Logo", Order = 1800)]
            public const string Logo = "Logo";

            [Display(Name = "Bunntekster", Order = 2000)]
            public const string Footer = "Footer";

            [Display(Name = "Globale innstillinger", Order = 9001)]
            public const string GlobalSettings = "GlobalSettings";

            [Display(Name = "Samtykker", Order = 30)]
            public const string Terms = "Terms";

            [Display(Name = "Produktnummere", Order = 40)]
            public const string ProductNumbers = "ProductNumbers";
        }

        /// <summary>
        /// Names used for UIHint attributes to map specific rendering controls to page properties
        /// </summary>
        public static class SiteUIHints
        {
            public const string Strings = "StringList";
            public const string Date = "Date";
            public const string Price = "Price";
        }


        public static class ContentAreaTags
        {
            public const string NoRenderer = "norenderer";
        }

        public static class Profile
        {
            public const string PasswordResetTokenExpireDate = "PasswordResetTokenExpireDate";
            public const string Address = "Address";
            public const string ZipCode = "ZipCode";
            public const string City = "Locality";


            public const string CrmMemberNumber = "CrmMemberNumber";
        }

        public static class SessionName
        {
            public const string CrmContactId = "CrmContactId";
        }

        public static class RoleNames
        {
            public const string Member = "Medlem";
            public const string Trustee = "Tillitsvalgt";
        }
    }
}