using Core.Interfaces.Services;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class ImageService : IImageService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ImageService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string?> AddUploadedImagesAsync(IFormFile? uploadedImage)
        {
            if (uploadedImage == null)
            {
                return null;
            }

            var request = _httpContextAccessor.HttpContext?.Request; //?
            if (request == null)
                throw new Exception("Не удалось получить адрес сервера");

            var baseUrl = $"{request.Scheme}://{request.Host}";

            if (uploadedImage.Length == 0)
            {
                return null;
            }

            var extension = Path.GetExtension(uploadedImage.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await uploadedImage.CopyToAsync(stream);
            }

            return "images/" + fileName;
        }

        public async Task<bool> RemoveImageFromServer(string? imageUrl)
        {
            if (imageUrl == null)
            {
                return true;
            }
            var startIndex = imageUrl.IndexOf("images/") + "images/".Length;
            var fileName = imageUrl.Substring(startIndex);

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);
            if (File.Exists(filePath)) File.Delete(filePath);

            return true;
        }
    }
}
