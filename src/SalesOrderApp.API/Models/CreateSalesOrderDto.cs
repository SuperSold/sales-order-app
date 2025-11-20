using System;
using System.Collections.Generic;

namespace SalesOrderApp.API.Models
{
    public class CreateSalesOrderDto
    {
        public int ClientId { get; set; }
        public DateTime OrderDate { get; set; }
        public string? Notes { get; set; }

        
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? ContactNumber { get; set; }

        public List<SalesOrderLineDto> Lines { get; set; } = new();
    }

    public class SalesOrderLineDto
    {
        public int ItemId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TaxRate { get; set; }

      
        public string? Description { get; set; }
    }
}
