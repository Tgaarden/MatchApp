using EPiServer.Shell.ObjectEditing;
using MatchApplication.Infrastructure.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace MatchApplication.Infrastructure.Attributes
{

    public class EnumSelectionAttribute : SelectOneAttribute, IMetadataAware
    {
        public EnumSelectionAttribute(Type enumType) { EnumType = enumType; }
        public Type EnumType { get; set; }
        public new void OnMetadataCreated(ModelMetadata metadata)
        {
            var enumType = metadata.ModelType;
            SelectionFactoryType = typeof(EnumSelectionFactory<>).MakeGenericType(EnumType);
            base.OnMetadataCreated(metadata);
        }

    }
}