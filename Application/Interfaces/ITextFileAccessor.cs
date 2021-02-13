using Application.TextFiles;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface ITextFileAccessor
    {
        TextFileUploadResult AddTextFile(IFormFile file);
        string DeleteTextFile(string publicId);
    }
}