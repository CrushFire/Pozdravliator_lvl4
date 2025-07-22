using Core.Models.Authentication;
using Core.Results;

namespace Core.Interfaces.Services
{
    public interface IAutenticationService
    {
        Task<ServiceResult<(string token, long id)>> AuthorizationAsync(AuthorizationRequest req);
        Task<ServiceResult<(string token, long id)>> RegistrationAsync(RegistrationRequest req);
    }
}