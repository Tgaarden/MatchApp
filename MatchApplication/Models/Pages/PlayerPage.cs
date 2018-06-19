using System;
using System.ComponentModel.DataAnnotations;
using EPiServer;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;
using EPiServer.Web;

namespace MatchApplication.Models.Pages
{
    [ContentType(DisplayName = "PlayerPage", GUID = "f36704f2-0ee7-484c-ac61-ebd50bcab37d", Description = "")]
    public class PlayerPage : PersonPageBase
    {
        [Display(
            Name = "Draktnummer",
            GroupName = SystemTabNames.Content,
            Order = 40)]
        public virtual int ShirtNumber { get; set; }

        [Display(
            Name = "Spillerposisjon",
            GroupName = SystemTabNames.Content,
            Order = 50)]
        public virtual string Role { get; set; }

        [Display(
            Name = "Spillerbilde",
            GroupName = SystemTabNames.Content,
            Order = 60)]
        [UIHint(UIHint.Image)]
        public virtual Url ProfileImage { get; set; }
    }
}