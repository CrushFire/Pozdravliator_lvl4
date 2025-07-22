using Microsoft.AspNetCore.Http;

namespace Core.Interfaces.Services
{
    public interface IImageService
    {
        Task<string?> AddUploadedImagesAsync(IFormFile? uploadedImage);
        Task<bool> RemoveImageFromServer(string? imageUrl);
    }
}