using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;

namespace MatchApplication.Models.Pages
{
    [ContentType(DisplayName = "CoachPage", GUID = "dbd75307-acda-47d7-8e14-b0a82fa4886f", Description = "")]
    public class CoachPage : PersonPageBase
    {

    }
}