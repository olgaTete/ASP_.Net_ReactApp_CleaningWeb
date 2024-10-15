using Microsoft.AspNetCore.Mvc;
using ReactApp_CleaningWeb.Server.Models;

namespace ReactApp_CleaningWeb.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        public static List<CityPrices> Prices { get; } = new List<CityPrices>
    {
        new CityPrices
        {
            City = "Stockholm",
            PricePerSquareMeter = 65,
            Services = new List<Service>
            {
                new Service { Options = "WindowCleaning", Price = 300 },
                new Service { Options = "BalconyCleaning", Price = 150 }
            }
        },
        new CityPrices
        {
            City = "Uppsala",
            PricePerSquareMeter = 55,
            Services = new List<Service>
            {
                new Service { Options = "WindowCleaning", Price = 300 },
                new Service { Options = "BalconyCleaning", Price = 150 },
                new Service { Options = "RemovalRubbish", Price = 400 }
            }
        }
    };

        [HttpGet("{city}")]
        public ActionResult<CityPrices> GetPricesByCity(string city)
        {
            var cityPrices = Prices.FirstOrDefault(p => p.City.Equals(city, StringComparison.OrdinalIgnoreCase));

            if (cityPrices == null)
            {
                return NotFound(new { Message = "No prices found for the specified city." });
            }

            return Ok(cityPrices);
        }

        [HttpPost("CalculatePrice")]
        public ActionResult CalculateTotalPrice([FromBody] CalculationRequest request)
        {
            var cityPrices = Prices.FirstOrDefault(p => p.City.Equals(request.City, StringComparison.OrdinalIgnoreCase));

            if (cityPrices == null)
            {
                return NotFound(new { Message = "No prices found for the specified city." });
            }

            decimal totalPrice = cityPrices.PricePerSquareMeter * request.TotalMetres;

            foreach (var selectedService in request.SelectedServices)
            {
                var service = cityPrices.Services.FirstOrDefault(s => s.Options.Equals(selectedService, StringComparison.OrdinalIgnoreCase));
                if (service != null)
                {
                    totalPrice += service.Price;
                }
            }
            return Ok(new { TotalPrice = totalPrice });
        }

    }
}