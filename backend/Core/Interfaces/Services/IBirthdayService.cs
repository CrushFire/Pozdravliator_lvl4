using Core.Models.Birthday;
using Core.Models.Filter;
using Core.Results;

namespace Core.Interfaces.Services
{
    public interface IBirthdayService
    {
        Task<ServiceResult<BirthdayResponse>> AddBirthdayAsync(BirthdayAddRequest req, long userId);
        Task<ServiceResult<List<BirthdayResponse>>> BirthdayForCalendar(int month);
        Task<ServiceResult<List<BirthdayResponse>>> GetBirthdaysByFilterAsync(BirthdayFilterRequest req, long userId);
        Task<ServiceResult<BirthdayResponse>> GetBirthdayByIdAsync(long id);
        Task<ServiceResult<List<BirthdayResponse>>> GetBirthdaysAsync(Pagination pag, long userId);
        Task<ServiceResult<bool>> RemoveBirthday(long id);
        Task<ServiceResult<bool>> UpdateBirthdayAsync(BirthdayUpdateRequest req, long id);
    }
}