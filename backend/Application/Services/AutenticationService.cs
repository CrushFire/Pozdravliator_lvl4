using Application.Utils;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Interfaces.Services;
using Core.Models.Authentication;
using Core.Results;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AutenticationService : IAutenticationService
    {
        private readonly ApplicationDbContext _context;
        private readonly JWTTokenGen _jwtTokenGen;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher _passwordHasher;

        public AutenticationService(ApplicationDbContext context, JWTTokenGen jwtTokenGen, IMapper mapper, IPasswordHasher passwordHasher)
        {
            _context = context;
            _jwtTokenGen = jwtTokenGen;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        public async Task<ServiceResult<(string token, long id)>> RegistrationAsync(RegistrationRequest req)
        {
            var userExist = await _context.Users.AnyAsync(u => u.Email == req.Email);

            if (userExist)
                return ServiceResult<(string, long)>.Fail("Данная почта уже используется другим пользователем", 409);

            var newUser = new User { Name = req.Name, Email = req.Email };
            newUser.PasswordHash = _passwordHasher.HashPassword(req.Password);

            await _context.AddAsync(newUser);
            await _context.SaveChangesAsync();

            var token = _jwtTokenGen.GenerateToken(newUser.Id.ToString(), newUser.Name, newUser.Email);
            return ServiceResult<(string, long)>.Suc((token, newUser.Id));
        }

        public async Task<ServiceResult<(string token, long id)>> AuthorizationAsync(AuthorizationRequest req)
        {
            var existUser = await _context.Users.Where(u => u.Email == req.Email).FirstOrDefaultAsync();

            if (existUser == null)
            {
                return ServiceResult<(string, long)>.Fail("Данного юзера не существует", 404);
            }

            if (!_passwordHasher.VerifyPassword(req.Password, existUser.PasswordHash))
            {
                return ServiceResult<(string, long)>.Fail("Неверный пароль", 401);
            }

            var token = _jwtTokenGen.GenerateToken(existUser.Id.ToString(), existUser.Name, existUser.Email);

            return ServiceResult<(string, long)>.Suc((token, existUser.Id));
        }
    }
}
