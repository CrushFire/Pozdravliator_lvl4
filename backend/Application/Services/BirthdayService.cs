using AutoMapper;
using Core.Entities;
using Core.Interfaces.Services;
using Core.Models.Birthday;
using Core.Models.Filter;
using Core.Results;
using DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class BirthdayService : IBirthdayService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;

        public BirthdayService(ApplicationDbContext context, IMapper mapper, IImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
        }

        public async Task<ServiceResult<BirthdayResponse>> GetBirthdayByIdAsync(long id)
        {
            var birthday = await _context.Birthdays.FirstOrDefaultAsync(x => x.Id == id);
            if (birthday == null)
            {
                return ServiceResult<BirthdayResponse>.Fail("Такого дня рождения не существует", 404);
            }
            var response = _mapper.Map<BirthdayResponse>(birthday);
            return ServiceResult<BirthdayResponse>.Suc(response);
        }

        public async Task<ServiceResult<List<BirthdayResponse>>> GetBirthdaysAsync(Pagination pag, long userId)
        {
            var today = DateTime.Today;

            var birthdays = await _context.Birthdays
                .Where(x => x.UserId == userId)
                .Where(x => new DateTime(today.Year, x.BirthDate.Month, x.BirthDate.Day) >= today)
                .OrderBy(x => x.Name)
                .OrderBy(x => new DateTime(today.Year, x.BirthDate.Month, x.BirthDate.Day))
                .Skip(pag.PageSize * (pag.Page - 1))
                .Take(pag.PageSize)
                .ToListAsync();

            if (birthdays == null)
            {
                return ServiceResult<List<BirthdayResponse>>.Fail("Список пуст", 404);
            }
            var response = _mapper.Map<List<BirthdayResponse>>(birthdays);
            return ServiceResult<List<BirthdayResponse>>.Suc(response);
        }

        public async Task<ServiceResult<BirthdayResponse>> AddBirthdayAsync(BirthdayAddRequest req, long userId)
        {
            var birthday = _mapper.Map<Birthday>(req);
            if (req.BirthDate.ToDateTime(TimeOnly.MinValue) > DateTime.Today)
            {
                return ServiceResult<BirthdayResponse>.Fail("Дата не может быть больше текущей");
            }
            var newFile = await _imageService.AddUploadedImagesAsync(req.ImageFile);
            birthday.UserId = userId;
            birthday.Image = newFile;
            var newBirthday = await _context.Birthdays.AddAsync(birthday);
            if (newBirthday == null)
            {
                return ServiceResult<BirthdayResponse>.Fail("Не удалось добавить день рождения", 500);
            }
            await _context.SaveChangesAsync();
            var response = _mapper.Map<BirthdayResponse>(newBirthday.Entity);
            return ServiceResult<BirthdayResponse>.Suc(response);
        }

        public async Task<ServiceResult<bool>> UpdateBirthdayAsync(BirthdayUpdateRequest req, long id)
        {
            if(req.BirthDate.ToDateTime(TimeOnly.MinValue) > DateTime.Today)
            {
                return ServiceResult<bool>.Fail("Дата не может быть больше текущей");
            }
            var birthday = await _context.Birthdays.FirstOrDefaultAsync(x => x.Id == id);
            string? newFile = null;
            if (birthday.Image != null && req.ImageFile != null)
            {
                _imageService.RemoveImageFromServer(birthday.Image);
                newFile = await _imageService.AddUploadedImagesAsync(req.ImageFile);
            }
            else if (birthday.Image == null && req.ImageFile != null)
            {
                newFile = await _imageService.AddUploadedImagesAsync(req.ImageFile);
            }
            else if (birthday.Image != null && req.ImageFile == null && req.RemoveImage)
            {
                _imageService.RemoveImageFromServer(birthday.Image);
                newFile = null;
            }
            else if (birthday.Image != null && req.ImageFile == null && !req.RemoveImage)
            {
                newFile = birthday.Image;
            }
            birthday.Image = newFile;
            birthday.Type = req.Type;
            birthday.Name = req.Name;
            birthday.BirthDate = req.BirthDate;
            _context.Birthdays.Update(birthday);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Suc(true);
        }

        public async Task<ServiceResult<List<BirthdayResponse>>> GetBirthdaysByFilterAsync(BirthdayFilterRequest req, long userId)
        {
            if(userId == null)
            {
                return ServiceResult<List<BirthdayResponse>>.Fail("Ошибка токена");
            }
            var query = _context.Birthdays.AsQueryable();

            if (!string.IsNullOrWhiteSpace(req.Name))
            {
                var parts = req.Name
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(part => $"%{part}%")
                    .ToList();

                query = query.Where(p => parts.Any(part => EF.Functions.Like(p.Name, part)));
            }

            if (req.BirthdayType != null)
            {
                query = query.Where(x => x.Type == req.BirthdayType);
            }

            var today = DateTime.Today;

            switch (req.TimeInterval)
            {
                case "Неделя":
                    var end = today.AddDays(7);

                    query = query.Where(x =>
                        (x.BirthDate.Month == today.Month && x.BirthDate.Day >= today.Day) &&
                        (x.BirthDate.Month == end.Month && x.BirthDate.Day <= end.Day));
                    break;
                case "Месяц":
                    query = query.Where(x => new DateTime(today.Year, x.BirthDate.Month, x.BirthDate.Day) >= today && x.BirthDate.Month == DateTime.Today.Month);
                    break;
                case "Квартал":
                    query = query.Where(x => new DateTime(today.Year, x.BirthDate.Month, x.BirthDate.Day) >= today && x.BirthDate.Month <= DateTime.Today.Month + 3);
                    break;
                case "Полгода":
                    query = query.Where(x => new DateTime(today.Year, x.BirthDate.Month, x.BirthDate.Day) >= today && x.BirthDate.Month <= DateTime.Today.Month + 6);
                    break;
                case "Прошедшие":
                    query = query.Where(x => new DateTime(today.Year, x.BirthDate.Month, x.BirthDate.Day) < DateTime.Today);
                    break;
            }

            bool ascending = string.Equals(req.DirectionSort, "desk", StringComparison.OrdinalIgnoreCase);
            query = ascending ? query.OrderBy(x => new DateTime(today.Year, x.BirthDate.Month, x.BirthDate.Day)) : query.OrderByDescending(x => new DateTime(today.Year, x.BirthDate.Month, x.BirthDate.Day));

            query = query.Skip(req.PageSize * (req.Page - 1)).Take(req.PageSize);

            var birthdays = await query.ToListAsync();

            var response = _mapper.Map<List<BirthdayResponse>>(birthdays);
            return ServiceResult<List<BirthdayResponse>>.Suc(response);
        }

        public async Task<ServiceResult<bool>> RemoveBirthday(long id)
        {
            var birthday = await _context.Birthdays.FirstOrDefaultAsync(x => x.Id == id);
            if (birthday == null)
            {
                return ServiceResult<bool>.Fail("День рождения с данными айди не существует", 404);
            }
            if(birthday.Image != null)
            {
                _imageService.RemoveImageFromServer(birthday.Image);
            }
            _context.Birthdays.Remove(birthday);
            await _context.SaveChangesAsync();
            return ServiceResult<bool>.Suc(true);
        }

        public async Task<ServiceResult<List<BirthdayResponse>>> BirthdayForCalendar(int month)
        {
            var birthdays = await _context.Birthdays.Where(x => x.BirthDate.Month == month).ToListAsync();
            var response = _mapper.Map<List<BirthdayResponse>>(birthdays);
            return ServiceResult<List<BirthdayResponse>>.Suc(response);
        }
    }
}
