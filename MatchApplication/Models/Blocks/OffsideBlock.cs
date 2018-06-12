using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;

namespace MatchApplication.Models.Blocks
{
    [ContentType(DisplayName = "Offside", GUID = "f434385c-4b83-4e5f-a69e-0e2fc5f089cf", Description = "")]
    public class OffsideBlock : EventBlockBase
    {

    }
}