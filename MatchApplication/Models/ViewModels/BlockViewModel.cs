using EPiServer;
using EPiServer.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MatchApplication.Models.ViewModels

{
    public class BlockViewModel<TBlock> : IBlockViewModel<TBlock> where TBlock : BlockData
    {
        public TBlock CurrentBlock { get; private set; }

        public BlockViewModel(TBlock currentBlock)
        {
            CurrentBlock = currentBlock;
        }
    }

    public static class BlockViewModel
    {
        public static IBlockViewModel<TBlock> CreateModel<TBlock>(TBlock block) where TBlock : BlockData
        {
            Type type = typeof(BlockViewModel<>).MakeGenericType(block.GetOriginalType());
            return Activator.CreateInstance(type, block) as IBlockViewModel<TBlock>;
        }
    }
}