using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Pozdravliator.Controllers
{
    public class CustomControllerBase : Controller
    {
        protected long? UserId => long.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId) ? userId : null;
    }
}
