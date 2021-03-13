using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace NUnitTest.Application.IntegrationTests
{
    class Utils
    {

        public static async Task<Stream> GetTestFile(string fileName)
        {
            var memoryStream = new MemoryStream();
            var fileStream = File.OpenRead(fileName);
            await fileStream.CopyToAsync(memoryStream);
            fileStream.Close();
            return memoryStream;
        }

        public static DefaultModelBindingContext GetBindingContext(IValueProvider valueProvider, Type modelType)
        {
            var metadataProvider = new EmptyModelMetadataProvider();
            var bindingContext = new DefaultModelBindingContext
            {
                ModelMetadata = metadataProvider.GetMetadataForType(modelType),
                ModelName = modelType.Name,
                ModelState = new ModelStateDictionary(),
                ValueProvider = valueProvider,
            };
            return bindingContext;
        }

    }
}
