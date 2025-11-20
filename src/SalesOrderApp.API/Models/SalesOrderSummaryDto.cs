using System;

namespace SalesOrderApp.API.Models
{
    public class SalesOrderSummaryDto
    {
        public int SalesOrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }

        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }
    }

     public class SalesOrderDetailsDto
    {
        public int SalesOrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;

        public int ClientId { get; set; }
        public DateTime OrderDate { get; set; }
        public string? Notes { get; set; }

        public List<SalesOrderLineDto> Lines { get; set; } = new();
    }
}
