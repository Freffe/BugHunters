using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net;
using Application.Errors;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {

        private const int FILESIZE = 500000;
        private static readonly IList<String> FILETYPES = new ReadOnlyCollection<string>
            (new List<String> {
         "image/jpeg", "image/png", "image.jpg" });
        private readonly Cloudinary _cloudinary;
        // For strongly typed access to user secrets
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            if (file.Length >= FILESIZE || !(FILETYPES.Contains(file.ContentType)))
            {
                throw new RestException(HttpStatusCode.BadRequest, new { Photo = "Bad photo size or format." });
            }
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            return new PhotoUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.AbsoluteUri,
                Name = file.Name
            };
        }

        public string DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = _cloudinary.Destroy(deleteParams);

            return result.Result == "ok" ? result.Result : null;
        }
    }
}