using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;
using EPiServer.Web;

namespace MatchApplication.Models.Pages
{

    [ContentType(DisplayName = "Logg inn side", GUID = "7f558ee1-90fc-44f8-a262-25d990c527c8", Description = "Påloggingsskjema")]
    public class LoginPage : PageData
    {
        [Display(Name = "Heading", 
            GroupName = SystemTabNames.Content, 
            Order = 10)]
        public virtual string Heading { get; set; }

    }

}