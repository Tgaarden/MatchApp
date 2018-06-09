using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;

namespace MatchApplication.Models.Pages
{
    [ContentType(DisplayName = "FrontPage", GUID = "b795a9e1-2b23-4ed2-ba2d-b0411e0de639", Description = "")]
    public class FrontPage : PageData
    {
        [Display(
            Name = "Tittel",
            GroupName = SystemTabNames.Content,
            Order = 10)]
        public virtual string Heading { get; set; }

        [Display(
            Name = "Hovedinnhold",
            GroupName = SystemTabNames.Content,
            Order = 20)]
        public virtual ContentArea FrontPageContent { get; set; }
         
    }
}