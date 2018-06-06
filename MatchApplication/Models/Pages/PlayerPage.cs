using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;

namespace MatchApplication.Models.Pages
{
    [ContentType(DisplayName = "PlayerPage", GUID = "f36704f2-0ee7-484c-ac61-ebd50bcab37d", Description = "")]
    public class PlayerPage : PersonPageBase
    {
        [Display(
            Name = "Draktnummer",
            GroupName = SystemTabNames.Content,
            Order = 10)]
        public virtual int ShirtNumber { get; set; }

        [Display(
            Name = "Spillerposisjon",
            GroupName = SystemTabNames.Content,
            Order = 20)]
        public virtual string Role { get; set; }
    }
}