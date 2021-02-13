using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net;
using Application.Errors;
using Application.Interfaces;
using Application.TextFiles;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class TextFileAccessor : ITextFileAccessor
    {
        private const int FILESIZE = 50000;
        private static readonly IList<String> FILETYPES = new ReadOnlyCollection<string>
            (new List<String> {
         "text/plain"});
        private readonly Cloudinary _cloudinary;
        // For strongly typed access to user secrets
        public TextFileAccessor(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        public TextFileUploadResult AddTextFile(IFormFile file)
        {
            if (file.Length >= FILESIZE || !(FILETYPES.Contains(file.ContentType)))
            {
                throw new RestException(HttpStatusCode.BadRequest, new { Text = "Bad text size or format." });
            }

            var uploadResult = new RawUploadResult { ResourceType = "raw" };

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new RawUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            return new TextFileUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.AbsoluteUri,
                Name = file.FileName
            };
        }

        public string DeleteTextFile(string publicId)
        {
            var deleteParams = new DeletionParams(publicId) { ResourceType = ResourceType.Raw };
            var result = _cloudinary.Destroy(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}

