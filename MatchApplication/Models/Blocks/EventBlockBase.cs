using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;

namespace MatchApplication.Models.Blocks
{
    [ContentType(DisplayName = "EventBlockBase", GUID = "3094fcaf-78b2-422c-a5f6-5ece7b9cf690", Description = "")]
    public class EventBlockBase : BlockData
    {

        [Display(
            Name = "Spiller",
            GroupName = SystemTabNames.Content,
            Order = 10)]
        public virtual string Player { get; set; }
        [Display(
            Name = "Minutt",
            GroupName = SystemTabNames.Content,
            Order = 20)]
        public virtual int Minute { get; set; }

        [Display(
            Name = "Beskrivelse",
            GroupName = SystemTabNames.Content,
            Order = 30)]
        public virtual string Description { get; set; }

    }
}