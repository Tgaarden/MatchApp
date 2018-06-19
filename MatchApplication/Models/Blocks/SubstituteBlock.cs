using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;

namespace MatchApplication.Models.Blocks
{
    [ContentType(DisplayName = "Substitute", GUID = "26b11110-65d6-4f35-b6ff-fb4418620457", Description = "")]
    public class SubstituteBlock : EventBlockBase
    {

        [Display(
            Name = "Innbyttespiller",
            GroupName = SystemTabNames.Content,
            Order = 40)]
        public virtual string PlayerIn { get; set; }


    }
}