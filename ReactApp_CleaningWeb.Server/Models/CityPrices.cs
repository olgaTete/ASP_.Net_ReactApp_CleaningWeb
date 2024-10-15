namespace ReactApp_CleaningWeb.Server.Models
{
    public class CityPrices
    {
        public string City { get; set; }
        public decimal PricePerSquareMeter { get; set; }
        public List<Service> Services { get; set; }
        //public decimal TotalMetre {get; set;}
        //public decimal TotalPrice { get; set; }
    }

    public class Service
    {
        public string Options { get; set; }
        public decimal Price { get; set; }
    }

    public class CalculationRequest
    {
        public string City { get; set; }
        public int TotalMetres { get; set; }
        public List<string> SelectedServices { get; set; }
    }


}
