using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;

namespace MatchApplication.Models.Pages
{
    [ContentType(DisplayName = "ForgotPasswordPage", GUID = "b2a44870-b25a-414a-bbc1-d0fa4c771894", Description = "")]
    public class ForgotPasswordPage : PageData
    {
        [Display(Name = "Heading", GroupName = SystemTabNames.Content, Order = 10)]
        public virtual string Heading { get; set; }
    }
}