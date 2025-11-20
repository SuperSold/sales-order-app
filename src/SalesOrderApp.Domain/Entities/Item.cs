namespace SalesOrderApp.Domain.Entities
{
    public class Item
    {
        public int ItemId { get; set; }        // PK
        public string Code { get; set; }       // Item code (for dropdown)
        public string Description { get; set; }
        public decimal Price { get; set; }     // Unit price
    }
}
