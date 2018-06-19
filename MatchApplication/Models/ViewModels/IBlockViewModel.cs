using EPiServer.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MatchApplication.Models.ViewModels
{
    public interface IBlockViewModel<out TBlock> where TBlock : BlockData
    {
        TBlock CurrentBlock { get; }
    }
}